const fs = require("fs")
const path = require("path")
const FormData = require("form-data")
const axios = require('axios')

const token = '' //访问https://sm.ms/home/apitoken 填写你的token
const url = 'https://smms.app/api/v2/upload'

if(!token) throw new Error('访问https://sm.ms/home/apitoken 填写你的token')

// sm.ms仅支持单图片的上传
async function uploadImageToSMMS(imgPath) {
  const formData = new FormData()
  const file = fs.createReadStream(imgPath)
  formData.append('smfile', file)
  try {
    const res = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: token
      }
    }).then(r => r.data)

    if(res.success) {
      res.url = res.data.url
    }
    if(res.code === 'image_repeated') { //图片重复也当它成功
      res.success = true
      res.url = res.images
    }
    return res
  } catch(error) {
    throw new Error(error.message)
  }
}

// 多图片上传
// 参数 ["/imgs/bird.png","/imgs/cat.jpg"]
// 参数传递文件的绝对路径，可在该函数的模块通过path.resolve(__dirname, "./imgs/bird.png")拼接
async function uploadImagesToSMMS(imgPathArr) {
  try {
    const promiseArr = []
    imgPathArr.forEach(path => {
      promiseArr.push(uploadImageToSMMS(path))
    })
    const resArr = await Promise.all(promiseArr)
    return resArr
  } catch(error) {
    throw new Error(error.message)
  }
}

// 测试
// const paths = [
//   path.resolve(__dirname, "./public/uploads/cat.jpg"),
//   path.resolve(__dirname, "./public/uploads/drop.jpg"),
// ]
// uploadImagesToSMMS(paths)

module.exports = uploadImagesToSMMS

