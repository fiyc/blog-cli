/**
* @Author: fiyc
* @Date : 2018-09-13 15:56
* @FileName : compile-module.js
* @Description : 
    - 模板编译模块
*/

let handlebars = require('handlebars');
let fs = require('fs');
let path = require('path');
let log = require('./log-module');
let fm = require('./file-module');

const templateRootPath = path.join(__dirname, '../templates');

/**
 * 编译模板
 * @param {*} param 编译参数
 * @param {*} template 模板名
 */
let compileTemplate = function(param, template){
    let result = '';
    let targetTemplatePath = path.join(templateRootPath, template);

    if(!fs.existsSync(targetTemplatePath)){
        log.error(`目标模板不存在, ${targetTemplatePath}`);
        return result;
    }

    let templateContent = fs.readFileSync(targetTemplatePath, 'utf-8').toString();
    result = handlebars.compile(templateContent)(param);
    return result;
}

let compileTemplateAndSave = function(param, template, savePath){
    let content = compileTemplate(param, template);
    fm.saveFile({
        content,
        savePath
    });
}

module.exports = compileTemplateAndSave;