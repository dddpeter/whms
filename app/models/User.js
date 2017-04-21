/**
 * Created by lijinde on 2017-4-20.
 */
const sequelize = require('../utils/SequelizeConfig');
const Sequelize = require('sequelize');
const User = sequelize.define('user', {
    uid: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true
    },

    email:{
        type: Sequelize.DataTypes.STRING
    },
    role:{
        type:Sequelize.DataTypes.ENUM,
        values:['MASTER','DEVELOPER'],
        defaultValue:'DEVELOPER'
    }
}, {
    tableName:'t_user',
    freezeTableName: true
});

module.exports = User;