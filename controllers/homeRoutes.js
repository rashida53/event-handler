const router = require('express').Router();
const { User, Event, Rsvp, Venue, Category, Errand } = require('../models');
const withAuth = require('../utils/auth');
const https = require('https');
const nodemailer = require("nodemailer");
const moment = require('moment');
const { Op } = require('sequelize')
require('dotenv').config();

// renders homepage with all events and errands
router.get('/', async (req, res) => {
    try {
        const eventData = await Event.findAll({
            where: {
                event_date: {
                    [Op.gte]: moment().format('YYYY-MM-DD')
                }
            },
            include: [
                {
                    model: User,
                    required: false,
                },
                {
                    model: Category,
                }
            ],
        });

        const events = eventData.map((event) => event.get({ plain: true }));
        console.log(events);

        const errandData = await Errand.findAll({
            include: [
                {
                    model: User,
                }
            ],
        });
        const errands = errandData.map((errand) => errand.get({ plain: true }));

        res.render('homepage', {
            events, errands,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// login route
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    res.render('login');
});

// signup route
router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    res.render('signup');
});

// renders profile page with users events, count of people going to that event, category and venue data for dropdown in create event form
router.get('/profile', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Event,
                    include: Category
                }
            ]
        });
        const user = userData.get({ plain: true });

        const venueData = await Venue.findAll();
        const venues = venueData.map((venue) => venue.get({ plain: true }));

        const categoryData = await Category.findAll();
        const categories = categoryData.map((category) => category.get({ plain: true }));

        const errandData = await Errand.findAll();
        const errands = errandData.map((errand) => errand.get({ plain: true }));

        user.events.forEach(async event => {
            const countData = await Rsvp.sum('count', {
                where: {
                    event_id: event.id
                }
            });
            event.countData = countData;
        })

        res.render('profile', {
            ...user, venues, categories, errands,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


var options = {
    hostname: 'maps.googleapis.com',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
};

// renders planning page with nearby restaurants using google api
router.get('/planning', withAuth, (req, res) => {
    let data = '';
    var dish = req.query.dish;
    options.path = `/maps/api/place/nearbysearch/json?location=30.2672%2C-97.7431&radius=1500&type=restaurant&keyword=${dish}&key=${process.env.API_KEY}`;
    const request = https.request(options, (response) => {
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            data += chunk;
        });
        console.log(data);
        response.on('end', () => {
            let payload = JSON.parse(data);

            const results = payload.results.slice(0, 9);
            console.log(results);
            res.render('planning', {
                results,
                logged_in: true
            });
        });
    });
    request.on('error', (error) => {
        console.error(error);
    });
    request.end();
});

// posts count of rsvp for a particular event to the rsvp table
router.post('/rsvp', withAuth, async (req, res) => {
    try {
        const newCount = await Rsvp.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        const eventData = await Event.findByPk(req.body.event_id, {
            include: [
                {
                    model: User,
                }
            ],
        });
        const event = eventData.get({ plain: true });
        console.log(event);
        console.log(event.user.username);
        sendEmailForEvent(event.user.username, event.user.email, req.body.count, event.title);
        res.status(200).json(newCount);
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
});

// function to send email to host of an event each time there is a new RSVP
async function sendEmailForEvent(userName, emailId, rsvpCount, eventName) {

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: 'nickolas.mckenzie3@ethereal.email',
            pass: 'xRpSbhKTxyqwMMyCTp'
        },
    });

    let info = await transporter.sendMail({
        from: '"Event Handler 👻" <eventhandler@example.com>',
        to: emailId,
        subject: "RSVP alert",
        text: `Hey ${userName}, ${rsvpCount} people have RSVP'd for ${eventName}!`,
        html: `<b>Hey ${userName}, ${rsvpCount} people have RSVP'd for  ${eventName}!</b>`,
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

// post new errand
router.post('/errands', withAuth, async (req, res) => {
    try {
        const newErrand = await Errand.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        console.log(req.body);
        console.log(req.session.user_id);
        res.status(200).json(newErrand);
    } catch (err) {
        res.status(400).json(err)
    }
});

module.exports = router;