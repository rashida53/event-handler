const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Rsvp extends Model { }

Rsvp.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        event_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'event',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'rsvp',
    }
);

module.exports = Rsvp;