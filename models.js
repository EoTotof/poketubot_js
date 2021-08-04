const Sequelize = require('sequelize');
const initModels = require('./models/init-models');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'poketubot.db',
});

console.log('Initializing models...');
const models = initModels(sequelize);
console.log('Done.');

module.exports = models;
