const crypto = require('crypto');
const glob = require('glob');
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

// 获取指定目录下的所有 js jsx文件
const readdirRecursive = dir => {
  var pattern = path.join(dir || process.cwd(), '**/*.+(js|jsx)');
  return glob.sync(pattern);
};

module.exports = {
  getKey,
  isContainChinese,
  readdirRecursive,
};
