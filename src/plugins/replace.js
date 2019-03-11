const utils = require('../utils');
const nodePath = require('path');

module.exports = function({ types: t }) {
  return {
    visitor: {
      StringLiteral(path, state) {
        const value = path.node.value;
        // 是否包含中文
        const isContainChinese = utils.isContainChinese(value);
        const { filename } = state;
        const fileName = nodePath.parse(filename).name;
        const randmeKey = utils.getKey(fileName);

        if (!isContainChinese) return;
        if (path.node.hasReplaced) return;
        // 是否在import语句中
        const isInImportDeclaration = t.isImportDeclaration(path.parent);
        if (isInImportDeclaration) return;
        var valueStringLiteral = t.stringLiteral(value);
        valueStringLiteral.hasReplaced = true;
        var formMessageExpression = t.callExpression(
          t.identifier('formatMessage'),
          [
            t.objectExpression([
              t.objectProperty(t.identifier('id'), t.stringLiteral(randmeKey)),
              t.objectProperty(
                t.identifier('defaultMessage'),
                valueStringLiteral
              ),
            ]),
          ]
        );
        const isJSXAttribute = t.isJSXAttribute(path.parent);

        if (isJSXAttribute)
          path.replaceWith(t.jsxExpressionContainer(formMessageExpression));
        else path.replaceWith(formMessageExpression);
      },
      JSXText(path, state) {
        const value = path.node.value;
        // 是否包含中文
        const isContainChinese = utils.isContainChinese(value);
        const { filename } = state;
        const fileName = nodePath.parse(filename).name;
        const randmeKey = utils.getKey(fileName);

        if (!isContainChinese) return;
        path.replaceWith(
          t.jsxExpressionContainer(
            t.callExpression(t.identifier('formatMessage'), [
              t.objectExpression([
                t.objectProperty(
                  t.identifier('id'),
                  t.stringLiteral(randmeKey)
                ),
                t.objectProperty(
                  t.identifier('defaultMessage'),
                  t.stringLiteral(value)
                ),
              ]),
            ])
          )
        );
      },
    },
  };
};
