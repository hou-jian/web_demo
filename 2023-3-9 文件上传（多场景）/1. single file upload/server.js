const fs = require('fs-extra')
const path = require('path')
const express = require('express')
const multer = require('multer')
// const cors = require('cors')
// app.use(cors()) // 本例开放了public，直接同源访问，如果需要跨域可以安装这个包

const PORT = 3000
const RESOURCE_URL = `http://localhost:${PORT}` //上传后资源的URL地址
const UPLOAD_DIR = path.resolve(__dirname, './public/uploads')
const app = express()

// 使用 multer 来处理 multipart/form-data 类型的表单数据
const storage = multer.diskStorage({
  destination: function(req, file, cb) { //设置存储路径
    fs.ensureDir(UPLOAD_DIR) //确保有这个目录，没有则创建
    cb(null, UPLOAD_DIR)
  },
  filename: function(req, file, cb) { //设置文件名
    cb(null, `${file.originalname}`)
  }
})
const upload = multer({ storage: storage })

app.post('/upload/single', upload.single('fileName'), (req, res) => {
  res.json({
    msg: 'ok',
    url: `${RESOURCE_URL}/uploads/${req.file.originalname}`
  })
})

//开放public，这样就可以通过返回的url，访问上传的文件了
app.use(express.static(path.resolve(__dirname, './public'))) 

app.listen(PORT, () => {
  console.log(`启动成功：http://localhost:${PORT}, \r\n已经开放了静态资源目录，访问这个网址即可加载index.html`);
})



