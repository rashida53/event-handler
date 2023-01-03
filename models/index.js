const User = require('./User');
const Event = require('./Event');
const Venue = require('./Venue');
const Category = require('./category');
const Rsvp = require('./Rsvp');
const Errand = require('./Errand');

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

User.hasMany(Event, {
    foreignKey: 'user_id',
});

Event.belongsTo(User, {
    foreignKey: 'user_id',
});

User.hasMany(Rsvp, {
    foreignKey: 'user_id',
});

Rsvp.belongsTo(User, {
    foreignKey: 'user_id',
});

Event.hasMany(Rsvp, {
    foreignKey: 'event_id',
});

Rsvp.belongsTo(Event, {
    foreignKey: 'event_id',
});

User.hasMany(Errand, {
    foreignKey: 'user_id',
});

Errand.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Event, Venue, Category, Rsvp, Errand };