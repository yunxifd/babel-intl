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
  const localizationData = JSON.stringify(storage.getAllItems());
  const localizationDir = path.parse(localizationFile).dir;
  if (!fs.existsSync(localizationDir)) fs.mkdirSync(localizationDir);
  fs.writeFileSync(localizationFile, localizationData, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
};
