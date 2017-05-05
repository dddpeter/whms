/**
 * Created by lijinde on 2017-4-20.
 */
const sequelize = require('../utils/SequelizeConfig');
const Task = require('../models/Task');
//const nodeExcel = require('excel-export');
const excel = require('node-excel-export');
const moment = require('moment');
module.exports = function (app, authChecker) {
    app.get('/api/tasks', authChecker, (req, res, next) => {
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
                            , function () {
                                res.writeHead(500,
                                    {"Content-Type": "application/json; charset=utf8"});
                                res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                            });
                }
                , function (e) {
                    res.writeHead(500,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                })
    });
    app.post('/api/tasks/:taskId', authChecker, (req, res, next) => {
        let taskId = req.params.taskId;
        let loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        let data = req.body;
        Task.findOne({where: {uid: uid, id: taskId}})
            .then(function (obj) {
                if (obj) {
                    obj.update({data})
                        .then(function (o) {
                                res.end(JSON.stringify({result: true}));
                            },
                            function (e) {
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
    var saveOrUpdate = function (req, task) {
        var loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        if (task.id) {
            return Task
                .findOne({where: {id: task.id, uid: uid}})
                .then(function (obj) {
                    if (obj) { // update
                        console.log(obj);
                        return obj.update(task);
                    }
                    else { // insert
                        return Task.create(task);
                    }
                })
        }
        else {
            return Task.create(task);
        }
    }
    app.post('/api/task', authChecker, (req, res, next) => {
        var task = req.body;
        console.log(task);
        saveOrUpdate(req, task).then(
            function (o) {
                res.json({result: true, data: task});
            },
            function (e) {
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': 'Task add or update fail:' + e.message}));
            });
    });
    app.delete('/api/tasks/:taskId', authChecker, (req, res, next) => {
        var taskId = req.params.taskId;
        var loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        Task.findOne({where: {uid: uid, id: taskId}})
            .then(function (obj) {
                if (obj) {
                    obj.destroy({where: {uid: uid, id: taskId}})
                        .then(function (o) {
                                res.end(JSON.stringify({result: true}));
                            },
                            function (e) {
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
    app.get('/api/tasks/last/week', authChecker, (req, res, next) => {
        var loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        sequelize.query(`SELECT to_char(sum(t."spendTime")/(select sum(t."spendTime")+0.00
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-6
        AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+1
        AND uid='${uid}')*100.00,'999.99') y,(select p."projectName" from t_project p WHERE  p.pid=t.pid) as name
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-6
        AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+1
        AND uid='${uid}' GROUP BY t.pid`)
            .then(function (obj) {
                    res.json({result: true, data: obj[0]});
                },
                function (e) {
                    res.writeHead(500,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                }
            );
    });
    app.get('/api/tasks/last/month', authChecker, (req, res, next) => {
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
        let firstDay = year + "-" + month + "-" + "01 00:00:00";//上个月的第一天
        let myDate = new Date(year, month, 0);
        let lastDay = year + "-" + month + "-" + myDate.getDate() + " 23:59:59";//上个月的最后一天
        var loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        sequelize.query(`SELECT to_char(sum(t."spendTime")/(select sum(t."spendTime")+0.00
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        '${firstDay}'
        AND '${lastDay}'
        AND uid='${uid}')*100.00,'999.99') y,(select p."projectName" from t_project p WHERE  p.pid=t.pid) as name
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        '${firstDay}'
        AND '${lastDay}'
        AND uid='${uid}' GROUP BY t.pid`)
            .then(function (obj) {
                    res.json({result: true, data: obj[0]});
                },
                function (e) {
                    res.writeHead(500,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                }
            );

    });

    app.get('/api/tasks/this/week', authChecker, (req, res, next) => {
        var loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        sequelize.query(`SELECT to_char(sum(t."spendTime")/(select sum(t."spendTime")+0.00
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER
        AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+7
        AND uid='${uid}')*100.00,'999.99') y,(select p."projectName" from t_project p WHERE  p.pid=t.pid) as name
        FROM t_task t
        WHERE to_date(to_char(t."createdAt",'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN
        NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER
        AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+7
        AND uid='${uid}' GROUP BY t.pid`)
            .then(function (obj) {
                    res.json({result: true, data: obj[0]});
                },
                function (e) {
                    res.writeHead(500,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                }
            );
    });
    app.get('/api/tasks/export', authChecker, (req, res, next) => {
        var start = req.query.start;
        var end = req.query.end;
        var pids = req.query.pids;
        var where = '1=1 and ';
        if (start == undefined) {
            let curr = moment();
            let day = curr.format('d');
            start = curr.add(0 - day, 'days').add(1, 'days').format('YYYY-MM-DD');
        }
        if (end == undefined) {
            let curr = moment();
            let day = curr.format('d');
            let first = curr.add(0 - day, 'days').add(1, 'days').format('YYYY-MM-DD');
            end = moment(first, 'YYYY-MM-DD').add(6, 'days').format('YYYY-MM-DD');
        }
        if (pids.length > 0) {
            let temp = '';
            pids.map((pid, i) => {
                pids[i] = `'${pid}'`;
            });
            where += `t.pid in (${pids.join(',')})`;
        }
        const styles = {
            headerMain: {
                fill: {
                    fgColor: {
                        rgb: 'B3930784'
                    }
                },
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                },
                font: {
                    color: {
                        rgb: 'FFFFFF'
                    },
                    sz: 14,
                    bold: true,
                    underline: false
                }
            },
            cellNormal: {
                font: {
                    color: {
                        rgb: '333333'
                    },
                    sz: 12,

                },
                alignment:{
                    wrapText:true
                }
            },
            cellCenter: {
                font: {
                    color: {
                        rgb: '333333'
                    },
                    sz: 12,

                },
                alignment:{
                    wrapText:true,
                    horizontal:'center'
                }
            }
        };

        const specification = {
            projectName: { // <- the key should match the actual data key
                displayName: '项目', // <- Here you specify the column header
                headerStyle: styles.headerMain, // <- Header style
                cellStyle: styles.cellNormal,
                width: '20'
            },
            content: { // <- the key should match the actual data key
                displayName: '内容', // <- Here you specify the column header
                headerStyle: styles.headerMain, // <- Header style
                cellStyle: styles.cellNormal,
                width: '60'
            },
            spendTime: { // <- the key should match the actual data key
                displayName: '耗时(h)', // <- Here you specify the column header
                headerStyle: styles.headerMain, // <- Header style
                cellStyle: styles.cellCenter,
                width: '10'
            },
            type: { // <- the key should match the actual data key
                displayName: '类型', // <- Here you specify the column header
                headerStyle: styles.headerMain, // <- Header style
                cellStyle: styles.cellCenter,
                width: '20'
            },
            uid: { // <- the key should match the actual data key
                displayName: '用户', // <- Here you specify the column header
                headerStyle: styles.headerMain, // <- Header style
                cellStyle: styles.cellCenter,
                width: '10'
            },
            startTime: { // <- the key should match the actual data key
                displayName: '时间', // <- Here you specify the column header
                headerStyle: styles.headerMain, // <- Header style
                cellStyle: styles.cellCenter,
                width: '20'
            }
        };

        sequelize.query(`select p."projectName",t.content,t."spendTime",t."type",t.uid,to_char(t."issueDate",'YYYY/MM/DD') "startTime" from t_task t left join t_project p on (p.pid=t.pid) 
        where ${ where} and t."issueDate" between '${start}' and '${end}'`, {type: sequelize.QueryTypes.SELECT})
            .then((data) => {
                console.log(data);
                const report = excel.buildExport(
                    [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                        {
                            name: `Report(${start}_${end}).xlsx`, // <- Specify sheet name (optional)
                            specification: specification, // <- Report specification
                            data: data // <-- Report data
                        }
                    ]
                );
                res.attachment(`Report(${start}_${end}).xlsx`); // This is sails.js specific (in general you need to set headers)
                return res.send(report);
            });
    });

}