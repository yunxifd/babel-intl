# babel-intl

使用 babel 转换和提取多语言文本

`replace` 用来将项目中用到的中文字符串，替换成特定的写法

```js
formatMessage({
  id: 'detailPanel.x235432dsd',
  defaultMessage: '编号',
});
```

然后根据中文，手动调整翻译项的 key

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

> 由于根据 ast 来修改代码，重新生成的代码和原来的代码格式上可能变化很大，不便于追踪版本变更，
> 因此推荐 项目使用 [prettier](https://prettier.io/) 来保证代码有统一的格式
