/**
 * Created by lijinde on 2017-4-20.
 */

module.exports = function(app) {
    app.get('/api/projects/with/tasks',function(req,res,next){
        res.end(JSON.stringify({'projects':[]}));
    });
}