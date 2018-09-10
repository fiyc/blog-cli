/**
* @Author: fiyc
* @Date : 2018-09-10 10:09
* @FileName : index.js
* @Description : 
    - 网页脚手架入口目录
    - 
*/

let programe = require('commander')

programe.version('1.0.0');

programe.command('clean')
    .alias('c')
    .description('clean build')
    .action(param => {
        console.log('begin clean');
    })
    

programe.command('build')
    .alias('b')
    .description('build static html files')
    .action(param => {
        console.log('begin build')
    })

programe.command('push')
    .alias('p')
    .description('upload to repository')
    .action(param => {
        console.log('begin push')
    })

programe.parse(process.argv);