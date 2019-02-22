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
  var files = utils.readdirRecursive(dir, function(name) {
    const nameInfo = name.split('.');
    if (
      nameInfo[1].toLowerCase() === 'js' ||
      nameInfo[1].toLowerCase() === 'jsx'
    )
      return true;
    return false;
  });

  files.forEach(file => {
    const filePath = path.join(dir, file);
    babel.transformFileSync(filePath, babelOptions, function(err, result) {
      if (err) {
        console.error(err);
        return;
      } else
        fs.writeFile(filePath, result.code, err => {
          if (err) {
            console.error(err);
            return;
          }
        });
    });
  });
  const localizationFile = path.join(dir, 'localizations/zh-CN.json');
  const localizationData = JSON.stringify(storage.getAllItems());
  const localizationDir = path.parse(localizationFile).dir;
  if (!fs.existsSync(localizationFile)) fs.mkdirSync(localizationFile);
  fs.writeFileSync(localizationFile, localizationData, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
};
