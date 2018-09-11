/**
* @Author: fiyc
* @Date : 2018-09-10 10:09
* @FileName : index.js
* @Description : 
    - 网页脚手架入口目录
    - 
*/

let programe = require('commander');
let bm = require('./modules/build-module');
let path = require('path');

programe.version('1.0.0');

programe.command('clean')
    .alias('c')
    .description('clean build')
    .action(bm.clean)


programe.command('build')
    .alias('b')
    .option('-f', "target floder")
    .description('build static html files')
    .action(param => {
        let absolutePath = path.resolve(param);
        // console.log(absolutePath);
        bm.build(absolutePath);
    })

programe.command('push')
    .alias('p')
    .description('upload to repository')
    .action(param => {
        console.log('begin push')
    })

programe.parse(process.argv);