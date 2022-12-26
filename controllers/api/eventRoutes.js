const router = require('express').Router();
const { Event, User, Venue, Category, Rsvp } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {
        const newEvent = await Event.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        console.log(req.body);
        console.log(req.session.user_id);
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
                {
                    model: Category,
                },
                {
                    model: Venue,
                },
            ],
        });


        const event = eventData.get({ plain: true });

        const countData = await Rsvp.sum('count', {
            where: {
                event_id: req.params.id,
            }
        });

        console.log(countData);

        res.render('eventpage', {
            ...event, countData,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});









module.exports = router;