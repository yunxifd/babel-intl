import t from '@babel/types';
import { hasChineseChar, getKey } from '../utils';

export default {
  StringLiteral(path, state) {
    const value = path.node.value;
    // 不是中文
    if (!hasChineseChar(value)) return;
    const { filename, isJSXFile } = state;
    const parames = [t.stringLiteral(getKey(filename)), t.stringLiteral(value)];
    // 如果是变量定义
    const variableDeclaratorParent = path.findParent(p =>
      p.isVariableDeclarator()
    );
    if (variableDeclaratorParent) {
      if (state.isJSXFile) {
        path.replaceWith(
          t.callExpression(
            t.memberExpression(t.thisExpression(), t.identifier('getString')),
            parames
          )
        );
      } else {
        path.replaceWith(t.callExpression(t.identifier('getString'), parames));
      }
      return;
    }
    // 如果是方法参数
    const callExpressionParent = path.findParent(p => p.isCallExpression());
    if (callExpressionParent) {
      //已经符合转换后的结果
      if (
        callExpressionParent.node.callee.memberExpression.ieMemberExpression(
          t.memberExpression(t.thisExpression(), t.identifier('getString'))
        ) ||
        callExpressionParent.node.callee.name === 'getString'
      )
        return;
    } else {
      if (state.isJSXFile) {
        path.replaceWith(
          t.callExpression(
            t.memberExpression(t.thisExpression(), t.identifier('getString')),
            parames
          )
        );
      } else {
        path.replaceWith(t.callExpression(t.identifier('getString'), parames));
      }
      return;
    }
  },
  JSXText(path, state) {
    const { filename } = state;
    const value = path.node.value;
    const parames = [t.stringLiteral(getKey(filename)), t.stringLiteral(value)];
    if (!hasChineseChar(value)) return;
    const callExpressionParent = path.findParent(p => p.isCallExpression());
    if (callExpressionParent) {
      //已经符合转换后的结果
      if (
        callExpressionParent.node.callee.memberExpression.ieMemberExpression(
          t.memberExpression(t.thisExpression(), t.identifier('getString'))
        ) ||
        callExpressionParent.node.callee.name === 'getString'
      )
        return;
    } else {
      path.replaceWith(
        t.jsxExpressionContainer(
          t.callExpression(
            t.memberExpression(t.thisExpression(), t.identifier()),
            parames
          )
        )
      );
      return;
    }
  },
};
