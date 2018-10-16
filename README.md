# babel-intl
使用babel 转换和提取多语言文本

`replace` 用来将项目中用到的中文字符串，替换成特定的写法  `getString(key,"中文字符串")`  
`extract` 用来提取代码中的多语言文本，生成类似：  

```json
{
    "title": "标题",
    "menu": "菜单"
}
```
