/**
 * Created by lijinde on 2017-4-20.
 */

const Models={};
const fs = require('fs');
const fileList = [];
function walk(path){
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        let name = item.replace('.js','');
        item = './models/' + name;
        let model = require(item);
        model.sync().then(function () {
            console.log(name+' init finished.');
        });

    });
}
walk(__dirname+'/models');
module.exports =Models;