const router = require('express').Router();
const { User, Event, Venue } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const eventData = await Event.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                    model: Venue,
                    attributes: ['name']
                }
            ]
        });
        const events = eventData.map((event) => event.get({ plain: true }));

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
            include: [{
                model: Event, Venue
            }],
        });
        const user = userData.get({ plain: true });

        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// router.get('/profile', withAuth, async (req, res) => {
//     try {
//         const eventData = await Event.findAll();
//         const events = eventData.map((event) => event.get({ plain: true }));

//         res.render('profile', {
//             events,
//             logged_in: true
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });


module.exports = router;