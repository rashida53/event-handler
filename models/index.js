const User = require('./User');
const Event = require('./Event');
const Venue = require('./Venue');
const Category = require('./category');
const Rsvp = require('./Rsvp');

User.hasMany(Event, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Event.belongsTo(User, {
    foreignKey: 'user_id'
});

Venue.hasMany(Event, {
    foreignKey: 'venue_id',
});

Event.belongsTo(Venue, {
    foreignKey: 'venue_id',
});

Category.hasMany(Event, {
    foreignKey: 'category_id',
});

Event.belongsTo(Category, {
    foreignKey: 'category_id',
});

User.belongsToMany(Event, {
    through: {
        model: Rsvp,
        foreignKey: 'user_id'
    }
});

Event.belongsToMany(User, {
    through: {
        model: Rsvp,
        foreignKey: 'event_id'
    }
});




module.exports = { User, Event, Venue, Category, Rsvp };