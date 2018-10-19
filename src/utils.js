import readDirRecursive from 'fs-readdir-recursive';
import fs from 'fs';
import path from 'path';

/**
 * 获取指定目录下的所有文件
 * @param {string} dirname 目录，必填
 * @param {func} filter 过滤器，排除忽略的文件，可选
 */
export const readDir = (dirname, filter) => {
    return readDirRecursive(dirname, (filename, _index, currentDirectory) => {
        const stat = fs.statSync(path.join(currentDirectory, filename));

        if (stat.isDirectory()) return true;
        return !filter || filter(filename);
    });
};

/**
 *  判断给定字符段是否包含中文字符
 * @param {string} str
 */
export const hasChineseChar = str => {
    const reg = new RegExp('[\u4e00-\u9fa5]|[（）；，。“”！]');
    return reg.test(str);
};
/**
 * 将文件名转换成 CamelCase
 * @param {string} filename
 */
const toCamelCase = filename => {
    return `${fileName.slice(0, 1).toLocaleLowerCase()}${fileName.slice(1)}`;
};
const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
const guid = () => {
    return S4() + S4();
};

/**
 * 根据文件名获取随机的多语言翻译项的key
 * @param {string} filename
 */
export const getKey = filename => {
    return toCamelCase(fileName) + '.' + guid();
};
