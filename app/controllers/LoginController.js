/**
 * Created by lijinde on 2017-4-20.
 */
const ldap = require("ldapjs");
const ENV = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../../config/config.json')[ENV];
const User = require('../models/User');
module.exports = function(app,authChecker) {
    var saveOrUpdate =function(user){
            return User
                .findOne({ where: {uid:user.uid }})
                .then(function(obj) {
                    if(obj) { // update
                        return obj.update(user);
                    }
                    else { // insert
                        return User.create(user);
                    }
                })
}
    var ladpLogin = function(uid,password,req,res,next){
        let client = ldap.createClient({
            url: config.ldap.url
        });
        let opts = {
            filter: `(uid=${uid})`, //查询条件过滤器
            scope: 'sub',    //查询范围
            timeLimit: 500    //查询超时
        };
        client.bind(
            `uid=${uid},ou=${config.ldap.ou},dc=${config.ldap.dc[0]},dc=${config.ldap.dc[1]},dc=${config.ldap.dc[2]}`,
            password,
            function (err, res1) {
            //开始查询
            //第一个参数：查询基础路径，代表在查询用户信心将在这个路径下进行，这个路径是由根节开始
            //第二个参数：查询选项
            client.search(`dc=${config.ldap.dc[0]},dc=${config.ldap.dc[1]},dc=${config.ldap.dc[2]}`, opts, function (err, res2) {
                let resultObj ;
                //查询结果事件响应
                res2.on('searchEntry', function (entry) {
                    //获取查询的对象
                    var user = entry.object;
                    console.log(JSON.stringify(user));
                    resultObj = {user,message:'ok'}


                });

                res2.on('searchReference', function(referral) {
                    console.log('referral: ' + referral.uris.join());
                });

                //查询错误事件
                res2.on('error', function(err) {
                    console.error('error: ' + err.message);
                    //unbind操作，必须要做
                    client.unbind();
                    resultObj = {err,message:'error'}
                });

                //查询结束
                res2.on('end', function(result) {
                    console.log('search status: ' + result.status);
                    //unbind操作，必须要做
                    client.unbind();
                    console.log(req.cookie);
                    if(resultObj.message === 'ok' && resultObj.user.userPassword){
                        let user = {uid:resultObj.user.uid,email:resultObj.user.mail};
                        req.session.loginUser = user;
                        req.session.save(function (err) {

                        });
                        saveOrUpdate(user);
                        res.end(JSON.stringify({result:true,uid:resultObj.user.uid}));
                    }
                    else{
                        res.end(JSON.stringify({result:false,error:resultObj.err}));
                    }


                });

            });
        });
    };
    app.post('/api/login',function(req,res,next){
        var data = req.body;
        if(data.uid && data.password){
            ladpLogin(data.uid,data.password,req,res,next);
        }
        else{
            res.end(JSON.stringify({result:false,error:"uid or password is miss"}));
        }});

    app.delete('/api/logout',function(req,res,next){
        var  user = req.session.loginUser;
        req.session.destroy(function(err) {
            if(err){
                res.json({result: false, error: 'logout fail'});
                return;
            }
            delete user;
            res.clearCookie('connect.sid');
            res.end(res.json({result:true}));
        });
    });
    app.get('/api/check/login',function(req,res,next){
        if(req.session.loginUser){
            res.json({result:true });
        }
        else{
            res.json({result: false, error: 'not logins'});
        }
    });
    app.get('/api/user',authChecker,function(req,res,next){
        var user = req.session.loginUser;
        res.json({result:true,user:user});
    })
}
