const storage = require('../storage');

module.exports = function({ types: t }) {
  return {
    visitor: {
      CallExpression(path) {
        // 是否是执行formatMessage函数
        if (path.node.callee && path.node.callee.name === 'formatMessage') {
          const intlObject = path.node.arguments[0];
          const tmp = {};
          intlObject.properties.forEach(p => {
            var key = p.key.name;
            var value = p.value.value;
            tmp[key] = value;
          });
          storage.setItem(tmp.id, tmp.defaultMessage);
        } else return;
      },
    },
  };
};
