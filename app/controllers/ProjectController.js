/**
 * Created by lijinde on 2017-4-20.
 */
const sequelize = require('../utils/SequelizeConfig');
const Task = require('../models/Task');
const Project = require('../models/Project');
module.exports = function (app, authChecker) {
    app.get('/api/user/projects', authChecker, function (req, res, next) {
        let loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        sequelize.query(`select up.pid,p."projectName" from t_user_project up left join t_project p on ( up.pid = p.pid) where up.uid='${uid}'`)
            .then(function (data) {

                res.json({result: true, data: data[0]});
            }, function () {
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': 'Server error'}));
            });
    });
    app.get('/api/projects/all', authChecker, function (req, res, next) {
        Project.findAll()
            .then(function (data) {
                res.json({result: true, data: data});
            }, function () {
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': 'Server error'}));
            });
    });

    app.get('/api/projects', authChecker, function (req, res, next) {
        var pageNum = req.query.pageNum;
        var pageSize = req.query.pageSize;
        var pid = req.query.pid;
        var projectStatus = req.query.projectStatus;
        var where = {};
        if (pid && pid != 'ALL') {
            where.pid = pid;
        }
        if (projectStatus && projectStatus != 'ALL') {
            where.status = projectStatus;
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
                sequelize.query(`select ceil(count(*)/(${pageSize}+0.00)) from t_project`)
                    .then(function (total) {
                            res.json({
                                result: true,
                                current: pageNum,
                                total: total[0][0].ceil,
                                'projects': projects
                            });
                        }
                        , function () {
                            res.writeHead(500,
                                {"Content-Type": "application/json; charset=utf8"});
                            res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                        });
            }, function () {
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': 'Server error'}));
            });
    });
    app.post('/api/project/:pid', authChecker, function (req, res, next) {
        let data = req.body;
        var pid = req.params.pid;
        Project.findOne({where: {pid: pid}})
            .then(function (obj) {
                if (obj) {
                    obj.update(data)
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
                    res.end(JSON.stringify({result: false, 'error': 'Project need to update was not found'}));

                }
            })

    });

    app.get('/api/project/tasks/:pid', authChecker, function (req, res, next) {
        var pageNum = req.query.pageNum;
        var pageSize = req.query.pageSize;
        var pid = req.params.pid;
        if (pageNum === undefined || isNaN(pageNum)) {
            pageNum = 0;
        }
        if (pageSize === undefined || isNaN(pageSize)) {
            pageSize = 5;
        }
        Task.findAll({pid: pid, offset: pageSize * pageNum, limit: pageSize})
            .then(function (tasks) {
                var tasks = tasks;
                sequelize.query(`select ceil(count(*)/(${pageSize}+0.00)) from t_task where pid='${pid}'`)
                    .then(function (total) {
                            res.json({
                                result: true,
                                current: pageNum,
                                total: total[0][0].ceil,
                                tasks: tasks
                            });
                        }
                        , function () {
                            res.writeHead(500,
                                {"Content-Type": "application/json; charset=utf8"});
                            res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                        });
            }, function () {
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': 'Server error'}));
            });
    });

}