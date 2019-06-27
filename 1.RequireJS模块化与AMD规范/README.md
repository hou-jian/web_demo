> 这个demo暂时放着了，以后入职的公司需要用到再学习细节

## 文件说明

- 项目代码是初学JS时写的`Todo`程序，随便处理了下用来测试**Require.js**模块管理和**r.js**打包

- `r.js`用来合并压缩代码的工具

- `build.js`是`r.js`的配置文件

- `./dist`是打包输出目录

## 打包流程

`node r.js -o build.js`，即可按照`build.js`的配置说明，打包到`./dist`目录下

## 插曲

这个JS-todo程序是很早前写的，包含了一些`ES6`的语法，忘记了…

`r.js`不支持所以没有压缩代码，导致我折腾了半天，以后嘚注意看报错信息…

## 参考资料

阮一峰的文章[RequireJS和AMD规范](https://javascript.ruanyifeng.com/tool/requirejs.html#toc5)

更多`r.js`的[配置说明](https://github.com/requirejs/r.js/blob/master/build/example.build.js)

