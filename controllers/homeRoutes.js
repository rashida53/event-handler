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
            // logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;