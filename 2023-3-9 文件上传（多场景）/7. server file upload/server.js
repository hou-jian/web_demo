const fs = require('fs-extra')
const path = require('path')
const express = require('express')
const multer = require('multer')
const fileType = require("file-type");

const uploadImagesToSMMS = require('./uploadImage')

const PORT = 3000
const RESOURCE_URL = `http://localhost:${PORT}` //上传后资源的URL地址
const UPLOAD_DIR = path.resolve(__dirname, './public/uploads')
const app = express()

// 使用 multer 来处理 multipart/form-data 类型的表单数据
const storage = multer.diskStorage({
  destination: function(req, file, cb) { //设置存储路径
    fs.ensureDirSync(UPLOAD_DIR) //确保有这个目录，没有则创建
    cb(null, UPLOAD_DIR)
  },
  filename: function(req, file, cb) { //设置文件名
    const originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8') //解决中文乱码问题
    cb(null, originalname)
  }
})

const upload = multer({ storage })

app.post('/upload/multiple', upload.fields([{ name: 'fileName' }]), async (req, res) => {
  try {
    const paths = req.files.fileName.map(file => file.path)
    const resArr = await uploadImagesToSMMS(paths)
    res.json(resArr)
  } catch(error) {
    console.log(error)
    res.status(500).json('服务器出错')
  }
})



//开放public，这样就可以通过返回的url，访问上传的文件了
app.use(express.static(path.resolve(__dirname, './public')))

app.listen(PORT, () => {
  console.log(`启动成功，已经开放了静态资源目录，访问 http://localhost:${PORT} 即可加载index.html`)
})



