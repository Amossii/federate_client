<template>
  <el-upload class="upload-demo" :http-request="handleUploadCatch" :limit="100" :multiple="true" v-bind="$attrs">
    <el-button type="primary" icon="Upload">
      点击上传文件
    </el-button>
  </el-upload>
  <br>
</template>
<script setup>
import { fileUploadPart, fileUploadBefore } from '@/apis/video'
import { MD5LargeFile } from '@/utils'
import { ElNotification } from 'element-plus'

// const handleUpload = async (options) => {
//   options.onProgress({ percent: 0 })
//   // 获取文件的md5
//   const fileMd5 = await MD5LargeFile(options.file, (p) => {
//     const progress = parseInt(p * 100)
//     options.onProgress({ percent: (100 - progress) })
//   })
//   const upload = await fileUploadBefore({
//     name: options.file.name,
//     md5: fileMd5,
//     size: options.file.size
//   })
//   //   处理文件上传
//   const countPart = Math.floor(options.file.size / upload.urate)
//   for (let currentPart = upload.ucount; currentPart <= countPart; currentPart += 1) {
//     const start = currentPart * upload.urate
//     const end = start + upload.urate
//     const uploadData = options.file.slice(start, end)

//     const formData = new FormData()
//     formData.append('currentPart', currentPart)
//     formData.append('uploadID', fileMd5)
//     formData.append('uploadData', uploadData)
//     console.log(formData);
//     await fileUploadPart(formData)
//     options.onProgress({ percent: parseInt((currentPart / countPart) * 100) })
//   }
// }

const handleUploadCatch = async (options) => {
  try {
    const formData = new FormData()
    formData.append('file', options.file)
    console.log(formData);
    fileUploadPart(formData).then((result) => {
      console.log(result);
    })
    // await handleUpload(options)
  } catch (error) {
    console.log(error)
    ElNotification({
      title: options.file.name,
      message: error.response.data,
      type: 'error',
      duration: 0
    })
    throw error
  }
}

</script>
