const ENV = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../../config/config.json')[ENV];
const Sequelize = require('sequelize');
const sequelize =
    new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            host: config.host,
            dialect: config.dialect,
            timezone:'+08:00',
            pool: {
                max: 10,
                min: 0,
                idle: 200
            },
        });
module.exports = sequelize;