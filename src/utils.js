import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
/**
 * glob support promise
 * ref: https://github.com/isaacs/node-glob/issues/228#issuecomment-375170162
 */
import util from 'util';
const glob = util.promisify(require('glob'));

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

const randomKey = () => {
  return crypto.randomBytes(4).toString('hex');
};

/**
 * 根据文件名获取随机的多语言翻译项的key
 * @param {string} filename
 */
export const getKey = filename => {
  return toCamelCase(fileName) + '.' + randomKey();
};
