// src/models/appointments.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Appointment = sequelize.define('Appointment', {
    bookingId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    /*userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },*/
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            isAfter: new Date().toISOString().split('T')[0],
        },
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        defaultValue: 'My reason for making this appointment is...',
    },
});

module.exports = Appointment;
