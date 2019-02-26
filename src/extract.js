const babel = require('@babel/core');
const path = require('path');
const fs = require('fs');
const storage = require('./storage');

const utils = require('./utils');

const babelOptions = {
  plugins: [require.resolve('./plugins/extract.js')],
  parserOpts: {
    plugins: ['jsx', 'classProperties', 'objectRestSpread'],
  },
};

module.exports = dir => {
  var files = utils.readdirRecursive(dir);

  files.forEach(file => {
    babel.transformFileSync(file, babelOptions);
  });

  const localizationFile = path.join(dir, 'localizations/zh-CN.json');
  let localizationData = storage.getAllItems();
  // 由于js 中 object property 序列化的时候不会将key 按顺序排列，因此使用下列方法，将key排序
  localizationData = Object.keys(localizationData)
    .sort()
    .reduce((accumulator, currentValue) => {
      accumulator[currentValue] = localizationData[currentValue];
      return accumulator;
    }, {});
  const localizationDir = path.parse(localizationFile).dir;
  if (!fs.existsSync(localizationDir)) fs.mkdirSync(localizationDir);
  fs.writeFileSync(localizationFile, JSON.stringify(localizationData), err => {
    if (err) {
      console.error(err);
      return;
    }
  });
};
