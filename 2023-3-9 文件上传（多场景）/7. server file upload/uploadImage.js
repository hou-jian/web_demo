const fs = require("fs")
const path = require("path")
const FormData = require("form-data")
const axios = require('axios')

const token = '' //访问https://sm.ms/home/apitoken 填写你的token
const url = 'https://smms.app/api/v2/upload'

async function uploadImageToSMMS() {
  const formData = new FormData()
  const file = fs.createReadStream(path.resolve(__dirname, "./imgs/drop.jpg"))
  formData.append('smfile', file)
  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: token
      }
    })
    console.log(response.data)
  } catch(error) {
    console.error(error)
  }
}

uploadImageToSMMS()