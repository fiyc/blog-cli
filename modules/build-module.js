/**
* @Author: fiyc
* @Date : 2018-09-10 16:23
* @FileName : build-module.js
* @Description : 
    - 读取指定目录下的md文件 并转化为html
*/

let fs = require('fs');
let path = require('path');
let md = require('marked');
/**
 * 遍历目录, 加载指定后缀的文件 
 * @param {*} targetPath 
 */
let loadFiles = function(targetPath, targetFileTypes){
    let result = [];

    if(!targetFileTypes || targetFileTypes.length === 0){
        return result;
    }

    if(!fs.existsSync(targetPath)){
        return result;
    }

    let fileStat = fs.statSync(targetPath);
    if(!fileStat.isDirectory()){
        return result;
    }

    let files = fs.readdirSync(targetPath);
    files.forEach(item => {
        let filePath = path.join(targetPath, item);
        let stat = fs.statSync(filePath);
        if(stat.isDirectory()){
            let subFiles = loadFiles(filePath, targetFileTypes);
            result = result.concat(subFiles);
        }else if(targetFileTypes.includes(path.extname(filePath))){
            result.push(filePath);
        }
    });

    return result;
}

/**
 * 将指定文件转为html
 * @param {*} files 
 */
let analysisMD = function(files){
    files.forEach(item => {
        let content = fs.readFileSync(item, "utf8");
        let htmlContent = md(content);

        let parentPath = path.dirname(item);
        let name = path.basename(item, path.extname(item));
        let outputPath = path.join(parentPath, `${name}.html`);
        fs.writeFileSync(outputPath, htmlContent, {encoding: "utf8"});
    });
}

let result = loadFiles("D:\\temp", ['.md']);
analysisMD(result);
console.log(result);