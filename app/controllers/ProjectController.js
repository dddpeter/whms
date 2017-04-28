/**
 * Created by lijinde on 2017-4-20.
 */
const sequelize = require('../utils/SequelizeConfig');
const Task = require('../models/Task');
const Project = require('../models/Project');
const UserProject = require('../models/UserProject');
const moment = require('moment');
module.exports = function (app, authChecker) {
    app.get('/api/user/projects', authChecker, (req, res, next) => {
        let loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        sequelize.query(`select up.pid,p."projectName" from t_user_project up left join t_project p on ( up.pid = p.pid) where up.uid='${uid}'`)
            .then(function (data) {

                res.json({result: true, data: data[0]});
            }, function (e) {
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': `Server error：${e.errors[0].message}`}));
            });
    });
    app.get('/api/projects/all', authChecker, (req, res, next) => {
        Project.findAll()
            .then(function (data) {
                res.json({result: true, data: data});
            }, function (e) {
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': `Server error：${e.errors[0].message}`}));
            });
    });

    app.get('/api/projects', authChecker, (req, res, next) => {
        var pageNum = req.query.pageNum;
        var pageSize = req.query.pageSize;
        var pid = req.query.pid;
        var projectStatus = req.query.projectStatus;
        var where = {};
        var whereString = 'where 1=1'
        if (pid && pid != 'ALL') {
            where.pid = pid;
            whereString += ` and pid='${pid}'`;
        }
        if (projectStatus && projectStatus != 'ALL') {
            where.status = projectStatus;
            whereString += ` and status='${projectStatus}'`;
        }

        if (pageNum === undefined || isNaN(pageNum)) {
            pageNum = 0;
        }
        if (pageSize === undefined || isNaN(pageSize)) {
            pageSize = 5;
        }
        Project.findAll({where: where, offset: pageSize * pageNum, limit: pageSize, order: [['updatedAt', 'DESC']]})
            .then(function (projects) {
                var projects = projects;
                sequelize.query(`select ceil(count(*)/(${pageSize}+0.00)) from t_project ${whereString}`)
                    .then(function (total) {
                            res.json({
                                result: true,
                                current: pageNum,
                                total: total[0][0].ceil,
                                'projects': projects
                            });
                        }
                        , function (e) {
                            res.writeHead(500,
                                {"Content-Type": "application/json; charset=utf8"});
                            res.end(JSON.stringify({result: false, 'error': `Server error：${e.errors[0].message}`}));
                        });
            }, function (e) {
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': `Server error：${e.errors[0].message}`}));
            });
    });
    app.post('/api/project/:pid', authChecker, (req, res, next) => {
        let data = req.body;
        var pid = req.params.pid;
        Project.findOne({where: {pid: pid}})
            .then(function (obj) {
                if (obj) {
                    obj.update(data)
                        .then(function (o) {
                                res.end(JSON.stringify({result: true}));
                            },
                            function (e) {
                                res.writeHead(500,
                                    {"Content-Type": "application/json; charset=utf8"});
                                res.end(JSON.stringify({result: false, 'error': `Server error：${e.errors[0].message}`}));
                            });
                }
                else {
                    res.writeHead(200,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': 'Project need to update was not found'}));

                }
            })

    });
    app.post('/api/project', (req, res, next) => {
        let project = req.body;
        let members = [];
        if(project.members && project.members.length>0){
            members = project.members;
            delete project.members;
        }

        Project.create(project).then((o)=>{
            let pid = o.dataValues.pid;
            let userProject =[];
            if(members.length>0){
                members.map((m)=>{
                    userProject.push({uid:m,pid:pid});
                });
                UserProject.bulkCreate(userProject).then((up)=>{
                    res.json({result: true,project:o.dataValues,members:up});
                },
                    (e)=>{
                    res.writeHead(500,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': `Project add success,but has add user to project error：${e.errors[0].message}`}));
                });
            }
            else{
                res.json({result: true,project:o.dataValues,members:[]});
            }

        },
            (e)=>{
            res.writeHead(500,
                {"Content-Type": "application/json; charset=utf8"});
            res.end(JSON.stringify({result: false, 'error': `Server error：${e.errors[0].message}`}));
        });


    });

    app.get('/api/project/tasks/:pid', authChecker, (req, res, next) => {
        let pageNum = req.query.pageNum;
        let pageSize = req.query.pageSize;
        let range =req.query.range;
        let whereObj = {};
        let pid = req.params.pid;
        let curr = moment();
        let day =curr.format('d');
        let first = curr.add(0-day,'days').add(1,'days').format('YYYY-MM-DD 00:00:00') ;
        let last = moment(first,'YYYY-MM-DD 00:00:00').add(6,'days').format('YYYY-MM-DD 23:59:59');
        if(pid){
            whereObj.pid= pid;
        }
        if(range==1){
            first = moment(first,'YYYY-MM-DD HH:mm:ss').add(-7,'days').format('YYYY-MM-DD 00:00:00') ;
            last = moment(first,'YYYY-MM-DD 00:00:00').add(6,'days').format('YYYY-MM-DD 23:59:59');
        }
        else
            if(range==2){
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
            first = year + "-" + month + "-" + "01 00:00:00";//上个月的第一天
            let myDate = new Date(year, month, 0);
            last = year + "-" + month + "-" + myDate.getDate()+" 23:59:59";//上个月的最后一天
        }

        if(range!=3){
            whereObj["issueDate"] = {
                $between:[first,last]
            };
        }

        if (pageNum === undefined || isNaN(pageNum)) {
            pageNum = 0;
        }
        if (pageSize === undefined || isNaN(pageSize)) {
            pageSize = 5;
        }
        Task.findAll({where:whereObj, offset: pageSize * pageNum, limit: pageSize,order: [['issueDate', 'DESC']]})
            .then(function (tasks) {
                var tasks = tasks;
                sequelize.query(`select ceil(count(*)/(${pageSize}+0.00)) from t_task where pid='${pid}' and "issueDate" between '${first}' and '${last}'`,{type: sequelize.QueryTypes.SELECT})
                    .then(function (total) {
                        console.log(total);
                            res.json({
                                result: true,
                                current: pageNum,
                                total: total[0].ceil,
                                tasks: tasks
                            });
                        }
                        , function (e) {
                            res.writeHead(500,
                                {"Content-Type": "application/json; charset=utf8"});
                            res.end(JSON.stringify({result: false, 'error': `Server error：${e.errors[0].message}`}));
                        });
            }, function (e) {
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': `Server error：${e.errors[0].message}`}));
            });
    });

}