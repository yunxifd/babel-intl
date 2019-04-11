const babel = require('@babel/core');
const path = require('path');
const fs = require('fs');

const utils = require('./utils');

const babelOptions = {
  plugins: [require.resolve('./plugins/restore.js')],
  parserOpts: {
    plugins: ['jsx', 'classProperties', 'objectRestSpread'],
  },
  generatorOpts: {
    jsescOption: {
      minimal: true,
    },
  },
};

module.exports = dir => {
  var files = utils.readdirRecursive(dir);
  files.forEach(file => {
    const code = babel.transformFileSync(file, babelOptions).code;
    fs.writeFileSync(file, code, err => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
};
