/**
 * Created by lijinde on 17-5-3.
 */
let schedule = require('node-schedule');
const sequelize = require('../utils/SequelizeConfig');
const moment = require('moment');
var scheduleObject ={
    scheduleUpdateTaskStatus:function(){
        schedule.scheduleJob('0 0 2 * * 1-7', function(){
            console.log('scheduleUpdateTaskStatus start:' + new Date());
            let curr = moment();
            let day =curr.format('d');
            let first = curr.add(0-day,'days').add(1,'days').format('YYYY-MM-DD 00:00:00') ;
            sequelize
                .query(`update t_task t set status=0 where t.status=1 and t."issueDate"<'${first}'`,{type: sequelize.QueryTypes.UPDATE})
                .then((data)=>{
                    console.log('scheduleUpdateTaskStatus success:' + new Date());
                },
                    (e)=>{
                        console.log('scheduleUpdateTaskStatus fail:' + new Date());
                    });

        });
    }
}
module.exports = scheduleObject;
