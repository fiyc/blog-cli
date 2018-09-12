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
md.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value
    }
})

let h = require('handlebars');
/**
 * 遍历目录, 加载指定后缀的文件 
 * @param {*} targetPath 
 */
let loadFiles = function (targetPath, targetFileTypes) {
    let result = [];

    if (!targetFileTypes || targetFileTypes.length === 0) {
        return result;
    }

    if (!fs.existsSync(targetPath)) {
        return result;
    }

    let fileStat = fs.statSync(targetPath);
    if (!fileStat.isDirectory()) {
        return result;
    }

    let files = fs.readdirSync(targetPath);
    files.forEach(item => {
        let filePath = path.join(targetPath, item);
        let stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            let subFiles = loadFiles(filePath, targetFileTypes);
            result = result.concat(subFiles);
        } else if (targetFileTypes.includes(path.extname(filePath))) {
            result.push(filePath);
        }
    });

    return result;
}

/**
 * 提取指定文件头信息, 并转未html文件
 * @param {*} filePath
 */
let analysisMD = function (filePath) {
    let result;
    let content = fs.readFileSync(filePath, "utf8");
    let headerPart = content.match(/^---\r\n([\s\S]*?)---\r\n/)

    if (!headerPart) {
        console.error(`[-] 文件: ${filePath} 未包含有效头部信息. 将被忽略`);
        return result;
    }

    let headerInfoStr = headerPart[1];
    let headerInfoLine = headerInfoStr.split('\r\n');

    if (headerInfoLine.length < 3) {
        console.error(`[-] 文件: ${filePath} 未包含有效头部信息(至少包含 name, title, date). 将被忽略`);
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
    // let parentPath = path.dirname(item);
    // let name = path.basename(item, path.extname(item));
    // let outputPath = path.join(parentPath, `${name}.html`);
    // fs.writeFileSync(outputPath, htmlContent, { encoding: "utf8" });
}

/**
 * 使用模板生成文件并保存
 * @param {*} savePath 
 * @param {*} config 
 * @param {*} templateName 
 */
let compareTemplateAndSave = function (savePath, config, templateName) {
    let targetTemplatePath = path.join(__dirname, `../templates/${templateName}`);
    let templateContent = fs.readFileSync(targetTemplatePath, 'utf-8').toString();
    let result = h.compile(templateContent)(config);
    fs.writeFileSync(savePath, result);
}

/**
 * 拷贝文件或目录
 * @param {*} sourcePath 
 * @param {*} targetPath 
 */
let copyFile = function (sourcePath, targetPath) {
    if (!fs.existsSync(sourcePath)) {
        console.log(`[-] 目标文件: ${sourcePath} 不存在.`);
        return;
    }

    let targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    fs.writeFileSync(targetPath, fs.readFileSync(sourcePath));
}

/**
 * 删除文件或目录
 * @param {*} targetPath 
 * @param {*} includeRootFloder 
 */
let removeFile = function (targetPath, includeRootFloder) {
    if (!fs.existsSync(targetPath)) {
        return;
    }

    let fileStat = fs.statSync(targetPath);
    if (!fileStat.isDirectory()) {
        fs.unlinkSync(targetPath);
    } else {
        let subFiles = fs.readdirSync(targetPath);
        for (let file of subFiles) {
            let itemPath = path.join(targetPath, file);
            removeFile(itemPath, true)
        }

        if (includeRootFloder) {
            fs.rmdirSync(targetPath);
        }
    }
}

let initBuildFloder = function () {
    copyFile(
        path.join(__dirname, "../templates/index.html"),
        path.join(__dirname, "../build/index.html")
    );

    copyFile(
        path.join(__dirname, "../templates/resource/common.css"),
        path.join(__dirname, "../build/resource/common.css"),
    );

    copyFile(
        path.join(__dirname, "../templates/resource/style.css"),
        path.join(__dirname, "../build/resource/style.css"),
    );

    copyFile(
        path.join(__dirname, "../templates/resource/article.css"),
        path.join(__dirname, "../build/resource/article.css"),
    );

    let articlePath = path.join(__dirname, "../build/article");
    if (!fs.existsSync(articlePath)) {
        fs.mkdirSync(articlePath);
    }
}


/**
 * 转化主逻辑
 * @param {*} targetPath 
 *  1. 加载目标目录的所有md文件信息
 *  2. 遍历文件
 *      2.1 提取头部信息
 *      2.2 获取转化后的html文件
 *      2.3 将html根据模板, 写入到目标位置
 *      2.4 将头部信息加入集合
 *  3. 将文件信息写入js模板
 */
let build = function (targetPath) {
    initBuildFloder();

    let fileInfos = [];
    let files = loadFiles(targetPath, ['.md']);
    files.forEach(item => {
        let itemFileInfo = analysisMD(item);
        if (itemFileInfo) {
            fileInfos.push({
                title: itemFileInfo.title,
                name: itemFileInfo.name,
                date: itemFileInfo.date
            });

            let savePath = path.join(__dirname, `../build/article/${itemFileInfo.name}.html`);
            compareTemplateAndSave(savePath, itemFileInfo, "article-template.txt");
        }
    });

    let renderJSPath = path.join(__dirname, `../build/resource/render.js`);
    fileInfos = fileInfos.sort(function(a, b){
        
    });
    compareTemplateAndSave(renderJSPath, { files: fileInfos }, "render-template.txt");
}

let clean = function () {
    let targetRemovePath = path.join(__dirname, '../build');
    removeFile(targetRemovePath);
}


module.exports = {
    clean,
    build
};

clean();
build("d://temp");