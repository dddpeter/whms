/**
 * Created by lijinde on 2017-4-20.
 */
const sequelize = require('../utils/SequelizeConfig');
const Sequelize = require('sequelize');
const userProject = sequelize.define('userProject', {
        id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true
        },
       pid:{
           type: Sequelize.DataTypes.UUID,
           references: {model:'t_project',key:'pid'},
           allowNull: false
       },
       uid:{
           type: Sequelize.DataTypes.STRING,
           references: {model:'t_user',key:'uid'},
           allowNull: false
       }
    },
    {
        tableName: 't_user_project',
        freezeTableName: true
    });
module.exports = userProject;