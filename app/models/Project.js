/**
 * Created by lijinde on 2017-4-20.
 */

const sequelize = require('../utils/SequelizeConfig');
const Sequelize = require('sequelize');
const Project = sequelize.define('proejct', {
        pid: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true
        },
        projectName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true

        },
        type:{
            type:Sequelize.DataTypes.ENUM,
            values:['PROJECT','WORK_TASK']
        },
        status: {
            type: Sequelize.DataTypes.ENUM,
            values: ['ACTIVE', 'PENDING', 'CLOSE']
        },
        brief: {
            type: Sequelize.DataTypes.STRING
        }

    },
    {
        tableName: 't_project',
        freezeTableName: true
    });

module.exports = Project;