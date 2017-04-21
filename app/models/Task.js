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
        issueDate:{
            type:Sequelize.DataTypes.DATE,
            allowNull:false
        },
        type:{
            type:Sequelize.DataTypes.ENUM,
            values:['DEVELOPMENT','TEST','REQUIREMENT','MAINTAIN','TEAM','ADMIN']
        },
        uid:{
            type: Sequelize.DataTypes.STRING,
            references: {model:'t_user',key:'uid'}
        },
        pid:{
            type: Sequelize.DataTypes.UUID,
            references: {model:'t_project',key:'pid'}
        },
    },
    {
        tableName: 't_task',
        freezeTableName: true
    });
module.exports = task;
