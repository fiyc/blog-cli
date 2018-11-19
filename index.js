#!/usr/bin/env node

/**
* @Author: fiyc
* @Date : 2018-09-13 11:30
* @FileName : index.js
* @Description : 
    - 入口文件
    - 设置命令行指令
*/
let programeInfo = require('./package.json');
let programe = require('commander');
let control = require('./app/command-controller');

//程序版本
programe.version(programeInfo.version);


// -- 设置指令 --
programe.command('init [dir]')
    .description('初始化博客目录')
    .action(function(dir){
        control.init(dir);
    });

programe.command('build')
    .description('生成博客产物')
    .action(function(){
        control.build();
    });

programe.command('publish')
    .description('推送至远程仓库')
    .action(function(){
        control.publish();
    })

programe.parse(process.argv);
