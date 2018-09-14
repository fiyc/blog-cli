/**
* @Author: fiyc
* @Date : 2018-09-13 13:41
* @FileName : command-controller.js
* @Description : 
    - 指令回调模块
*/
let fm = require('./modules/file-module');
let path = require('path');
let log = require('./modules/log-module');
let bs = require('./build-service');
let git = require('./modules/git-module');

let control = {
    /**
     * 初始化博客项目目录结构
     */
    init: function(targetPath){
        targetPath = targetPath ? targetPath : "./";
        let structPath = path.join(__dirname, 'templates/struct');
        fm.copyFile(structPath, targetPath);
    },

    /**
     * 编译博客项目, 生成产物
     */
    build: function(){
        bs();
    },

    /**
     * 更新发布博客
     */
    publish: function(){
        let currentCWD = process.cwd();
        let configPath = path.join(currentCWD, 'blog.json');
        let config = require(configPath);
        let buildPath = path.join(currentCWD, 'build');

        git.push(buildPath, config.repository, config.branch);
    }
};

module.exports = control;