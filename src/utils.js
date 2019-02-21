const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 *  判断给定字符段是否包含中文字符
 * @param {string} str
 */
const isContainChinese = str => {
  const reg = new RegExp('[\u4e00-\u9fa5]');
  return reg.test(str);
};

/**
 * 将文件名转换成 CamelCase
 * @param {string} fileName 文件名
 */
const toCamelCase = fileName => {
  return `${fileName.slice(0, 1).toLocaleLowerCase()}${fileName.slice(1)}`;
};

const randomKey = () => {
  return crypto.randomBytes(4).toString('hex');
};

/**
 * 根据文件名获取随机的多语言翻译项的key
 * @param {string} fileName 文件名
 */
const getKey = fileName => {
  return toCamelCase(fileName) + '.' + randomKey();
};

//递归读取目录下所有文件
// ref: https://github.com/fs-utils/fs-readdir-recursive/blob/master/index.js
function readdirRecursive(root, filter, files, prefix) {
  prefix = prefix || '';
  files = files || [];

  var dir = path.join(root, prefix);
  if (!fs.existsSync(dir)) return files;
  if (fs.statSync(dir).isDirectory())
    fs.readdirSync(dir)
      .filter(function(name, index) {
        if (filter) return filter(name, index, dir);
        return true;
      })

      .forEach(function(name) {
        readdirRecursive(root, filter, files, path.join(prefix, name));
      });
  else files.push(prefix);
  return files;
}

module.exports = {
  getKey,
  isContainChinese,
  readdirRecursive,
};
