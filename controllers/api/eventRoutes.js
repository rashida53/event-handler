const router = require('express').Router();
const { User } = require('../../models');

router.post('./:id', async (req, res) => {
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







module.exports = router;