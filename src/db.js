// src/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'lucrisnes',
    database: 'law_firm_system',
});

module.exports = sequelize;