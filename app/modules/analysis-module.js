/**
* @Author: fiyc
* @Date : 2018-09-13 15:46
* @FileName : analysis-module.js
* @Description : 
    - md文件解析模块
*/

let fs = require('fs');
let log = require('./log-module');
let md = require('marked');
md.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value
    }
})


/**
 * 将目标地址的md文件解析, 包含头部信息以及html
 * 头部信息规范
 * ---
 * title: 文章显示在页面上的标题
 * name: 文章保存文件名
 * date: 文章发布日期
 * ---
 * @param {*} targetPath 
 */
let analysis = function (targetPath) {
    let result;
    let content = fs.readFileSync(targetPath, "utf8");
    let headerPart = content.match(/^---\r\n([\s\S]*?)---\r\n/);

    if (!headerPart) {
        console.error(`[-] 文件: ${targetPath} 未包含有效头部信息. 将被忽略`);
        log.error(`文件: ${targetPath} 未包含有效头部信息, 将被忽略.`);
        return result;
    }

    let headerInfoStr = headerPart[1];
    let headerInfoLine = headerInfoStr.split('\r\n');

    if (headerInfoLine.length < 3) {
        log.error(`文件: ${targetPath} 未包含有效头部信息(至少包含 name, title, date), 将被忽略`);
        return result;
    }

    result = {};
    for (let eachLine of headerInfoLine) {
        let keyAndValue = eachLine.split(':');
        if (keyAndValue.length >= 2) {
            result[keyAndValue[0].trim()] = keyAndValue.slice(1).join(":").trim()
        }
    }

    content = content.replace(/^---\r\n([\s\S]*?)---\r\n/g, "");
    let htmlContent = md(content);

    result['htmlContent'] = htmlContent;
    return result;
}

module.exports = analysis;

