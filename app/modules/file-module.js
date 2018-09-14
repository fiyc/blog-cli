/**
* @Author: fiyc
* @Date : 2018-09-13 13:45
* @FileName : file-module.js
* @Description : 
    - 文件操作模块
*/

let fs = require('fs');
let path = require('path');

let log = require('./log-module');

let m = {
    /**
     * 保存文件到指定目录
     * 当目录不存在时, 会创建
     * @param content 文件内容
     * @param savePath 保存地址
     * @param encoding 保存编码
     */
    saveFile: function (param) {
        let defaultParam = {
            content: '',
            savePath: '',
            encoding: 'utf-8'
        };

        param = Object.assign(defaultParam, param);
        if (!param.savePath) {
            log.error('保存文件失败, 无效的保存路径.');
        }

        //保存文件绝对路径
        let absoluteFilePath = path.resolve(param.savePath);

        //保存文件所在目录绝对路径
        let absoluteFileFloder = path.dirname(absoluteFilePath);

        //校验文件所在目录是否存在, 不存在则新建一个
        if (!fs.existsSync(absoluteFileFloder)) {
            fs.mkdirSync(absoluteFileFloder);
        }

        fs.writeFileSync(absoluteFilePath, param.content, { encoding: param.encoding });
        log.info(`保存文件: ${absoluteFilePath}`);
    },

    /**
     * 拷贝目录或文件
     */
    copyFile: function (sourcePath, targetPath) {
        sourcePath = path.resolve(sourcePath);
        targetPath = path.resolve(targetPath);

        if (!fs.existsSync(sourcePath)) {
            log.error(`拷贝文件失败, 源文件 ${sourcePath} 不存在.`);
            return;
        }

        let sourceStat = fs.statSync(sourcePath);
        if (sourceStat.isDirectory()) {
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath);
            }
            
            let subFile = fs.readdirSync(sourcePath);
            subFile.forEach(file => {
                let subSourcePath = path.join(sourcePath, file);
                let subTargetPath = path.join(targetPath, file);
                m.copyFile(subSourcePath, subTargetPath);
            });
        } else {
            let content = fs.readFileSync(sourcePath);
            m.saveFile({
                content: content,
                savePath: targetPath
            });
        }

    },

    /**
     * 递归列出目录下文件信息
     * @param sourcePath 目标目录
     * @param excludes 排除文件类型
     */
    listFloderRecursive: function (sourcePath, excludes) {
        let result = [];

        sourcePath = path.resolve(sourcePath);
        if (!fs.existsSync(sourcePath)) {
            return result;
        }

        let sourceStat = fs.statSync(sourcePath);
        if (!sourceStat.isDirectory()) {
            return result;
        }

        let files = fs.readdirSync(sourcePath);
        files.forEach(f => {
            let itemFilePath = path.join(sourcePath, f);
            let itemFileStat = fs.statSync(itemFilePath);

            if (itemFileStat.isDirectory()) {
                let fileList = m.listFloderRecursive(itemFilePath);
                result = result.concat(fileList);

            } else if (!excludes || excludes.length === 0 || excludes.includes(path.extname(itemFilePath))) {
                result.push(itemFilePath);
            }
        });

        return result;
    }

}

module.exports = m;