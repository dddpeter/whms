/**
 * Created by lijinde on 2017-4-20.
 */
const sequelize = require('../utils/SequelizeConfig');
const Task = require('../models/Task');
module.exports = function (app, authChecker) {
    app.get('/api/tasks', authChecker, function (req, res, next) {
        var pageNum = req.query.pageNum;
        var pageSize = req.query.pageSize;
        if (pageNum === undefined || isNaN(pageNum)) {
            pageNum = 0;
        }
        if (pageSize === undefined || isNaN(pageSize)) {
            pageSize = 5;
        }
        var loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        sequelize
            .query(`select t.id,t."issueDate",t.type,uid,(select p."projectName" from t_project p WHERE  p.pid=t.pid) projectName,
            t."spendTime",t.status,t.content 
                from t_task t where t.uid='${uid}' order by t."updatedAt" desc,t.pid
                limit ${pageSize} offset ${pageNum * pageSize}`)
            .then(function (projects) {
                sequelize
                    .query(`select ceil(count(*)/(${pageSize}+0.00)) 
                        from t_task t where t.uid='${uid}' `)
                    .then(function (total) {
                        res.json({result: true, current: pageNum, total: total[0][0].ceil, 'tasks': projects[0]});
                    }
                        ,function(){
                            res.writeHead(500,
                                {"Content-Type": "application/json; charset=utf8"});
                            res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                        });
            }
                ,function(){
                    res.writeHead(500,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                })
    });
    app.post('/api/tasks/:taskId', authChecker, function (req, res, next) {
        let taskId = req.params.taskId;
        let loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        let data = req.body;
        Task.findOne({where: {uid: uid, id: taskId}})
            .then(function (obj) {
                if (obj) {
                    obj.update({data})
                        .then(function () {
                                res.end(JSON.stringify({result: true}));
                            },
                            function () {
                                res.writeHead(500,
                                    {"Content-Type": "application/json; charset=utf8"});
                                res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                            });
                }
                else {
                    res.writeHead(200,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': 'Task need to update was not found'}));

                }
            })

    });
    var saveOrUpdate =function(req,task){
        var loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        if(task.id){
            return Task
                .findOne({ where: {id:task.id,uid:uid }})
                .then(function(obj) {
                if(obj) { // update
                    return obj.update(task);
                }
                else { // insert
                    return Task.create(task);
                }
            })
        }
        else{
            return Task.create(task);
        }
    }
    app.post('/api/task',authChecker,function (req, res, next) {
        var task = req.body;
        saveOrUpdate(req,task).then(
            function(){
                res.json({result:true,data:task});
            },
            function(){
                res.writeHead(200,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': 'Task add or update fail'}));
            });
    });
    app.delete('/api/tasks/:taskId', authChecker, function (req, res, next) {
        var taskId = req.params.taskId;
        var loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        Task.findOne({where: {uid: uid, id: taskId}})
            .then(function (obj) {
                if (obj) {
                    obj.destroy({where: {uid: uid, id: taskId}})
                        .then(function () {
                                res.end(JSON.stringify({result: true}));
                            },
                            function () {
                                res.writeHead(500,
                                    {"Content-Type": "application/json; charset=utf8"});
                                res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                            });
                }
                else {
                    res.writeHead(200,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': 'Task need to delete was not found'}));

                }
            })
    });
    app.get('/api/tasks/last/week', authChecker, function (req, res, next) {
        var loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        sequelize.query(`SELECT to_char(sum(t."spendTime")/(select sum(t."spendTime")+0.00
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-6
        AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+1
        AND uid='lijd')*100.00,'999.99') y,(select p."projectName" from t_project p WHERE  p.pid=t.pid) as name
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-6
        AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+1
        AND uid='${uid}' GROUP BY t.pid`)
            .then(function (obj) {
                    res.json({result: true, data: obj[0]});
                },
                function () {
                    res.writeHead(500,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                }
            );
    });
    app.get('/api/tasks/last/month', authChecker, function (req, res, next) {
        let nowdays = new Date();
        let year = nowdays.getFullYear();
        let month = nowdays.getMonth();
        if (month == 0) {
            month = 12;
            year = year - 1;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let firstDay = year + "-" + month + "-" + "01";//上个月的第一天
        let myDate = new Date(year, month, 0);
        let lastDay = year + "-" + month + "-" + myDate.getDate();//上个月的最后一天
        var loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        sequelize.query(`SELECT to_char(sum(t."spendTime")/(select sum(t."spendTime")+0.00
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        '${firstDay}'
        AND '${lastDay}'
        AND uid='lijd')*100.00,'999.99') y,(select p."projectName" from t_project p WHERE  p.pid=t.pid) as name
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        '${firstDay}'
        AND '${lastDay}'
        AND uid='${uid}' GROUP BY t.pid`)
            .then(function (obj) {
                    res.json({result: true, data: obj[0]});
                },
                function () {
                    res.writeHead(500,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                }
            );

    });

    app.get('/api/tasks/this/week', authChecker, function (req, res, next) {
        var loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        sequelize.query(`SELECT to_char(sum(t."spendTime")/(select sum(t."spendTime")+0.00
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER
        AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+7
        AND uid='lijd')*100.00,'999.99') y,(select p."projectName" from t_project p WHERE  p.pid=t.pid) as name
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER
        AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+7
        AND uid='${uid}' GROUP BY t.pid`)
            .then(function (obj) {
                    res.json({result: true, data: obj[0]});
                },
                function () {
                    res.writeHead(500,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                }
            );
    });

}