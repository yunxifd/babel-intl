const dictionary = [];
export default {
  CallExpression(path, state) {
    if (
      (path.node.callee && path.node.callee.name === 'getString') ||
      (path.node.callee &&
        path.node.callee.property &&
        path.node.callee.property.name === 'getString')
    ) {
      const args = path.node.arguments;
      if (args.length === 2) {
        dictionary.push({
          key: args[0].value,
          value: args[1].value,
        });
      }
    }
  },
  post(state) {
    console.log(dictionary);
  },
};
