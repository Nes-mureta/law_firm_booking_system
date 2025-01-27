// src/models/users.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Admin = sequelize.define('Admin', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey:true,
        validate: {
            isEmail: true,
        },
    },
    phoneNumber: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    key: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});
module.exports =Admin;

