/**
 * Created by lijinde on 2017-4-20.
 */
const sequelize = require('../utils/SequelizeConfig');
const UserProject = require('../models/UserProject');
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

}