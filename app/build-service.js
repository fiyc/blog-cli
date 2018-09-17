/**
* @Author: fiyc
* @Date : 2018-09-13 16:28
* @FileName : build-service.js
* @Description : 
    - 编译模块逻辑处理
*/

let path = require('path');
let log = require('./modules/log-module');
let fs = require('fs');

let compile = require('./modules/compile-module');
let fm = require('./modules/file-module');
let analysis = require('./modules/analysis-module');


/**
 * 校验当前路径是否有效
 */
let validCheck = function () {
    let currentCWD = process.cwd();
    let blogConfigPath = path.join(currentCWD, 'blog.json');

    if (!fs.existsSync(blogConfigPath)) {
        log.error(`当前项目缺少配置文件, ${blogConfigPath}`);
        process.exit(0);
        return;
    }

    let config = require(blogConfigPath);
    if (!config.title) {
        log.error(`配置文件缺少title信息.`);
        process.exit(0);
        return;
    }

    return { currentCWD, title: config.title};
}

let build = function () {
    //校验项目信息
    let checkResult = validCheck();
    let currentCWD = checkResult.currentCWD;
    let title = checkResult.title;

    // 拷贝默认的css文件
    let indexCssPath = path.join(currentCWD, 'build/resource/style.css');
    let indexMediaCssPath = path.join(currentCWD, 'build/resource/style_media.css');
    let commonCssPath = path.join(currentCWD, 'build/resource/common.css');
    let articleCssPath = path.join(currentCWD, 'build/resource/article.css');
    let articleMediaCssPath = path.join(currentCWD, 'build/resource/article_media.css');
    compile({}, 'style-css-template.txt', indexCssPath);
    compile({}, 'style-media-css-template.txt', indexMediaCssPath);
    compile({}, 'common-css-template.txt', commonCssPath);
    compile({}, 'article-css-template.txt', articleCssPath);
    compile({}, 'article-media-css-template.txt', articleMediaCssPath);

    //编译首页
    let indexPath = path.join(currentCWD, 'build/index.html');
    compile({title}, 'index-template.txt', indexPath);


    // 获取文章列表
    let fileInfos = [];
    let targetMDPath = path.join(currentCWD, 'articles');
    let files = fm.listFloderRecursive(targetMDPath, ['.md']);

    //编译并保存
    files.forEach(item => {
        let itemFileInfo = analysis(item);
        if (itemFileInfo) {
            fileInfos.push({
                title: itemFileInfo.title,
                name: itemFileInfo.name,
                date: itemFileInfo.date
            });

            let savePath = path.join(currentCWD, `build/article/${itemFileInfo.name}.html`);
            compile(itemFileInfo, "article-template.txt", savePath);
        }
    });

    //编译render.js
    let renderSavePath = path.join(currentCWD, 'build/resource/render.js');
    compile({
        files: fileInfos,
    },
        "render-template.txt",
        renderSavePath);

    //如果有自定义的resource目录则覆盖
    let customResourcePath = path.join(currentCWD, 'resource');
    if (fs.existsSync(customResourcePath)) {
        let targetResourcePath = path.join(currentCWD, 'build/resource');
        fm.copyFile(customResourcePath, targetResourcePath);
    }

    //拷贝静态文件到编译产物首页
    let staticPath = path.join(currentCWD, 'static');
    let buildPath = path.join(currentCWD, 'build');
    fm.copyFile(staticPath, buildPath);
}

module.exports = build;