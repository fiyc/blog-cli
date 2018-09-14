/**
* @Author: fiyc
* @Date : 2018-09-13 17:27
* @FileName : git-module.js
* @Description : 
    - git 控制模块
*/

let execSync = require('child_process').execSync;
let log = require('./log-module');


let exec = function(command){
    try{
        execSync(command);
    }catch(error){
        log.error(`执行命令 ${command} 出错`);
    }
}


/**
 * 将指定目录推送到远程仓库
 * @param {*} targetPath 
 * @param {*} repositoryUrl 
 */
let push = function(targetPath, repository, branch){
    let currentPath = process.cwd();
    process.chdir(targetPath);

    exec(`git init`);
    exec(`git remote rm origin`);
    exec(`git remote add origin ${repository}`);

    exec(`git add *`);
    exec(`git commit -m "publish"`);
    exec(`git push -u origin ${branch} -f`);
}

module.exports = {
    push
};

