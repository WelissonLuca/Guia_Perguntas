const Sequelize = require('sequelize');

const connection = new Sequelize('guiapress', 'root', '240306', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection;

