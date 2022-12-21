const User = require('./User');
const Event = require('./Event');
const Venue = require('./Venue');

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

// Venue.belongsToMany(Event, {
//     through: {
//         model: User,
//         unique: false
//     },
//     as: 'event_venue'
// });

module.exports = { User, Event, Venue };