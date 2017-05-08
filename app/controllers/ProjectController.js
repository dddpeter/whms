/**
 * Created by lijinde on 2017-4-20.
 */
const sequelize = require('../utils/SequelizeConfig');
const Task = require('../models/Task');
const Project = require('../models/Project');
const UserProject = require('../models/UserProject');
const moment = require('moment');
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
/**
 *
 * @param req
 * @param res
 * @param next
 */
var authRoleChecker = (req, res, next) => {
        if(req.session.loginUser.email.endsWith('unicc.com.cn')){
            next();
        }
        else{
            res.writeHead(401, {"Content-Type": "application/json; charset=utf8"});
            res.end(JSON.stringify({result: false, 'error': 'not authorized'}));
        }
}
/**
 *
 * @param app
 * @param authChecker
 */
module.exports = function (app, authChecker) {
    /**
     * 获取所有用户参与的所有项目
     */
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
    /**
     * 获取所有项目
     */
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
    /**
     * 项目列表分页
     */
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
    /**
     * 更新一个项目的信息
     */
    app.post('/api/project/:pid', authChecker,authRoleChecker, (req, res, next) => {
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
    /**
     * 添加一个项目
     */
    app.post('/api/project', authChecker,authRoleChecker,(req, res, next) => {
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
            res.end(JSON.stringify({result: false, 'error': `Server error：${e}`}));
        });


    });
    /**
     *添加项目成员
     */
    app.post('/api/project/member/:pid', authChecker,authRoleChecker,(req, res, next) => {
        let pid = req.params.pid;
        let members = req.body;
        var membersWillAdd = [];
        var result =[];
        UserProject.findAll({where:{pid:pid,uid:members}}).then((up)=>{
            up.map((u)=>{
                members.remove(u.uid);
                result.push(u.uid);
            });
                members.map((m,i)=>{
               membersWillAdd[i] ={uid:m,pid:pid};
           });

            UserProject.bulkCreate(membersWillAdd).then(()=>{
                    res.json({result: true,members:result});
                },
                (e)=>{
                    res.writeHead(500,
                        {"Content-Type": "application/json; charset=utf8"});
                    res.end(JSON.stringify({result: false, 'error': `Project add user fail：${e.errors[0].message}`}));
                });
        },

            (e)=>{
                res.writeHead(500,
                    {"Content-Type": "application/json; charset=utf8"});
                res.end(JSON.stringify({result: false, 'error': `Project add user fail：${e.errors[0].message}`}));
            }
        );

    });
    /**
     *获取项目下任务，带分页
     * rang:
     * 1 Last Week,
     * 2 Last Month,
     * 3 All,
     * otherwise This Week
     */
    app.get('/api/project/tasks/:pid', authChecker, (req, res, next) => {
        let pageNum = req.query.pageNum;
        let pageSize = req.query.pageSize;
        let range =req.query.range;
        let whereObj = {};
        let whereString ='and 1=1';
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
        if(range==3){
            whereString =' and 1=1';
        }
        else{
            whereObj["issueDate"] = {
                $between:[first,last]
            };
            whereString = ` and "issueDate" between '${first}' and '${last}'`;
        }
        // console.log(whereObj);
        if (pageNum === undefined || isNaN(pageNum)) {
            pageNum = 0;
        }
        if (pageSize === undefined || isNaN(pageSize)) {
            pageSize = 5;
        }
        Task.findAll({where:whereObj, offset: pageSize * pageNum, limit: pageSize,order: [['issueDate', 'DESC']]})
            .then(function (tasks) {
                var tasks = tasks;
                sequelize.query(`select ceil(count(*)/(${pageSize}+0.00)) from t_task where pid='${pid}' ${whereString} `,{type: sequelize.QueryTypes.SELECT})
                    .then(function (total) {
                        // console.log(total);
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