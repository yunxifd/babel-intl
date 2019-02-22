# babel-intl

使用 babel 转换和提取多语言文本

`replace` 用来将项目中用到的中文字符串，替换成特定的写法

```js
formatMessage({
  id: 'detailPanel.code',
  defaultMessage: '编号',
});
```

`extract` 用来提取代码中的多语言文本，生成类似：

```json
{
  "detailPanel.code": "编号"
}
```

## 使用方法

```
node ./src/index.js replace [dir]
node ./src/index.js extract [dir]
```
