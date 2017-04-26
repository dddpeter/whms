/**
 * Created by lijinde on 2017-4-20.
 */
const sequelize = require('../utils/SequelizeConfig');
const UserProject = require('../models/UserProject');
const Project = require('../models/Project');
module.exports = function (app,authChecker) {
    app.get('/api/user/projects',authChecker,function(req,res,next){
        let loginUser = req.session.loginUser;
        let uid = loginUser.uid;
        sequelize.query(`select up.pid,p."projectName" from t_user_project up left join t_project p on ( up.pid = p.pid) where up.uid='${uid}'`)
            .then(function(data){

                res.json({result: true,data: data[0]});
            },function(){
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': 'Server error'}));
            });
    });
    app.get('/api/projects/all',authChecker,function(req,res,next){
        Project.findAll()
            .then(function(data){
                res.json({result: true,data: data});
            },function(){
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': 'Server error'}));
            });
    });

    app.get('/api/projects',authChecker,function(req,res,next){
        var pageNum = req.query.pageNum;
        var pageSize = req.query.pageSize;
        if (pageNum === undefined || isNaN(pageNum)) {
            pageNum = 0;
        }
        if (pageSize === undefined || isNaN(pageSize)) {
            pageSize = 5;
        }
        Project.findAll({ offset: pageSize*pageNum, limit: pageSize })
            .then(function(projects){
                var projects = projects;
                sequelize.query(`select ceil(count(*)/(${pageSize}+0.00)) from t_project`)
                    .then(function (total) {
                    res.json({result: true,
                        current: pageNum,
                        total: total[0][0].ceil,
                        'projects': projects});
                }
                ,function(){
                            res.writeHead(500,
                                {"Content-Type": "application/json; charset=utf8"});
                            res.end(JSON.stringify({result: false, 'error': 'Server error'}));
                });
            },function(){
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': 'Server error'}));
            });
    });

}