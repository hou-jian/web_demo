const fse = require('fs-extra')
const path = require('path')
const express = require('express')
const multer = require('multer')
const fileType = require('file-type')

const uploadImagesToSMMS = require('./uploadImage')

const PORT = 3000
const UPLOAD_DIR = path.resolve(__dirname, './public/uploads')
const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp']
const app = express()

// 使用 multer 来处理 multipart/form-data 类型的表单数据
const storage = multer.diskStorage({
  destination: function(req, file, cb) { //设置存储路径
    fse.ensureDirSync(UPLOAD_DIR) //确保有这个目录，没有则创建
    cb(null, UPLOAD_DIR)
  },
  filename: function(req, file, cb) { //设置文件名
    const originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8') //解决中文乱码问题
    const extension = path.extname(originalname) //获取文件后缀名
    const basename = path.basename(originalname, extension) //获取文件名（不含后缀）
    const filename = `${basename}_${Date.now()}` //拼接新文件名，使用时间戳避免重名
    cb(null, filename + extension)
  }
})

const limits = {
  fileSize: 5 * 1024 * 1024, // 限制文件大小为 5M
  files: 10 // 限制文件数量为 10
}

const upload = multer({ storage, limits, })

app.post('/upload/multiple', upload.fields([{ name: 'fileName' }]), async (req, res) => {
  try {
    const paths = req.files.fileName.map(file => file.path)
    const result = await areAllImages(paths)
    if(!result) {
      deleteFiles(paths)
      res.json({
        success: false,
        message: '图片格式不支持，上传失败',
      })
      return
    }
    const resArr = await uploadImagesToSMMS(paths)
    res.json(resArr)
  } catch(error) {
    console.log('上传图片出错', error)
    res.status(500).json({
      success: false,
      message: '上传图片出错',
    })
  }
})

// Error-handling middleware
app.use((err, req, res, next) => {
  if(err instanceof multer.MulterError) {
    return res.status(500).json({ success: false, ...err })
  }
  res.status(500).json({
    success: false,
    message: "未知错误",
  })
  console.log('未知错误', err)
})

//开放public，这样就可以通过返回的url，访问上传的文件了
app.use(express.static(path.resolve(__dirname, './public')))

app.listen(PORT, () => {
  console.log(`启动成功，已经开放了静态资源目录，访问 http://localhost:${PORT} 即可加载index.html`)
})


// 一些工具函数
function readFiles(paths) {
  return Promise.all(
    paths.map(path => fse.readFile(path)) //fse.readFile返回的是个Promise
  )
}

async function areAllImages(paths) {
  const imagesBuffer = await readFiles(paths)

  for(const imageBuffer of imagesBuffer) {
    const fileInfo = await fileType.fromBuffer(imageBuffer)
    if(
      fileInfo === undefined ||
      !allowedTypes.includes(fileInfo.ext)
    ) {
      return false;
    }
  }
  return true;
}

async function deleteFiles(paths) {
  try {
    await Promise.all(
      paths.map((path) => {
        return fse.remove(path)
      })
    )
  } catch(err) {
    console.error('删除文件出错', err)
  }
}
