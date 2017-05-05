/**
 * Created by lijinde on 2017-4-20.
 */
/**
 * Created by lijinde on 2017-4-20.
 */
const sequelize = require('../utils/SequelizeConfig');
const Sequelize = require('sequelize');
const task = sequelize.define('task', {
        id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true
        },
        issueDate: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
        },
        type: {
            type: Sequelize.DataTypes.ENUM,
            values: ['DEVELOPMENT', 'TEST', 'REQUIREMENT', 'MAINTAIN', 'TEAM', 'ADMIN'],
            allowNull: false
        },
        uid: {
            type: Sequelize.DataTypes.STRING,
            references: {model: 't_user', key: 'uid'},
            allowNull: false
        },
        spendTime:{
            type:Sequelize.DataTypes.BIGINT,
            allowNull:false,
            defaultValue:60
        },
        pid: {
            type: Sequelize.DataTypes.UUID,
            references: {model: 't_project', key: 'pid'},
            allowNull: false
        },
        status:{
            type:Sequelize.DataTypes.INTEGER,
            allowNull:false,
            defaultValue:1
        },
        content: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 't_task',
        freezeTableName: true
    });
module.exports = task;
