const router = require('express').Router();
const { User, Event, Rsvp, Venue, Category } = require('../models');
const withAuth = require('../utils/auth');
const https = require('https');
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const eventData = await Event.findAll({
            include: [
                {
                    model: User,
                    required: false
                }
            ],
        });
        const events = eventData.map((event) => event.get({ plain: true }));
        console.log(events);
        res.render('homepage', {
            events,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    res.render('login');
});

//add withAuth in this route
router.get('/profile', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [Event]
        });
        const user = userData.get({ plain: true });

        const venueData = await Venue.findAll();
        const venues = venueData.map((venue) => venue.get({ plain: true }));

        const categoryData = await Category.findAll();
        const categories = categoryData.map((category) => category.get({ plain: true }));

        user.events.forEach(async event => {
            const countData = await Rsvp.sum('count', {
                where: {
                    event_id: event.id
                }
            });
            event.countData = countData;
        })

        res.render('profile', {
            ...user, venues, categories,
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

router.post('/rsvp', withAuth, async (req, res) => {
    try {
        const newCount = await Rsvp.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        console.log(newCount);
        res.status(200).json(newCount);
    } catch (err) {
        res.status(400).json(err)
    }
});


module.exports = router;