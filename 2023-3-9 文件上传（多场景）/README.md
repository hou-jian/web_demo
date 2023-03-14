# 文件上传

## 初始化

`npm i` 安装依赖

## 启动

在各自目录 `node server.js` 即可启动项目

> 都开放了静态资源目录，访问打印的网址即可直接加载 `index.html`。
>
> 同时，这样是同源访问，无需跨域。如果需要，可以安装 `npm i cors` 这个包。

## 注意点

### 前后端文件类型检测和大小、数量限制

这几点 demo 中没有做，以后用到需注意

### 后端同名文件会被覆盖

可以加时间搓解决，以后用到需注意

###  `accept="image/*"` 

```html
<input id="upload-file" type="file" accept="image/*">
```

上面使用 `accept="image/*"` 限制只选图片，有两个注意点：

- 兼容性
- 用户可以通过改文件后缀绕过，可以通过二级制文件头检查。

![accept attribute for file input](assets/accept attribute for file input.png)

### `multiple` 多文件选择兼容性

```html
<input id="upload-file" type="file" accept="image/*" multiple>
```

![image-20230311224937252](assets/image-20230311224937252.png)

### `webkitdirectory` 目录上传兼容性

```html
<input id="uploadFile" type="file" accept="image/*" webkitdirectory />
```

![image-20230311225219664](assets/image-20230311225219664.png)

如上，只有现代浏览器能用了。另外一点，你选择一个目录，这个目录内的所有层次都会被选择。

### DataTransferItem API: `webkitGetAsEntry`

> 拖拽上传用到 `webkitGetAsEntry` 接口获取文件信息（fullPath、isDirectory、isFile、name），通过 isDirectory 判断是文件夹，递归获取所有层级的文件。

![image-20230314052214351](assets/image-20230314052214351.png)

如上，仅支持现代浏览器。

### `navigator.clipboard.read()` 异步读取剪切板

这个 api 复制浏览器图片正常，但是复制 windows 图片读取不到，兼容性也不好，索性用 `clipboardData` 接口读取了

```js
editArea.addEventListener('paste', async (e) => {
  e.preventDefault()
  files = Array.from(e.clipboardData.files)
  if(files.length === 0) return
})
```

## 参考

主要就是[文件上传，搞懂这8种场景就够了](https://juejin.cn/post/6980142557066067982)，这篇文章的内容。由于不熟悉 `Koa` 所有后端用的 `Express`，参考的其他零散文章找不到了。
