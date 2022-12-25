const router = require('express').Router();
const { Event, User, Venue, Category } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {
        const newEvent = await Event.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(newEvent);
    } catch (err) {
        res.status(400).json(err)
    }
});

router.get('/:id', async (req, res) => {
    try {
        const eventData = await Event.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                },
                { model: Category, },
                {
                    model: Venue,
                },
            ],
        });

        console.log(eventData);

        const event = eventData.get({ plain: true });

        console.log(event);

        res.render('eventpage', {
            ...event,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});









module.exports = router;