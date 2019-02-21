const babel = require('@babel/core');
const utils = require('./utils');
const babelOptions = {
  plugins: [require.resolve('./plugins/replace.js')],
  parserOpts: {
    plugins: ['jsx', 'classProperties', 'objectRestSpread'],
  },
  generatorOpts: {
    jsescOption: {
      minimal: true,
    },
  },
};

// module.exports = function (dir) {
//   fs.readdir(dir, function (err, files) {
//     console.log(files);
//   })
// }
const dir = 'E:\\myGithub\\babel-intl\\example\\replace';

var files = utils.readdirRecursive(dir, function(name) {
  const nameInfo = name.split('.');
  if (nameInfo[1].toLowerCase() === 'js' || nameInfo[1].toLowerCase() === 'jsx')
    return true;
  return false;
});

files.forEach(file => {
  const filePath = path.join(dir, file);
  babel.transformFile(filePath, babelOptions, function(err, result) {
    if (err) console.error(err);
    else console.log(result.code);
  });
});
