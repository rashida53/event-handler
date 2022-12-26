const sequelize = require('../config/connection');
const { User, Event, Venue, Category } = require('../models');

const userData = require('./userData.json');
const eventData = require('./eventData.json');
const venueData = require('./venueData.json');
const categoryData = require('./categoryData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });
    for (const category of categoryData) {
        await Category.create({
            ...category,
        });
    };
    for (const venue of venueData) {
        await Venue.create({
            ...venue,
        });
    };

    for (const event of eventData) {
        await Event.create({
            ...event,
        });
    };



    process.exit(0);
};

seedDatabase();