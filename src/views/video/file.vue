<template>
  <el-main class="ea-table">
    <upload :on-success="handleUploadSuccess" />
    <el-table :data="table.data" @sort-change="handleSortChange">
      <!-- <el-table-column fixed prop="id" label="ID" width="80" sortable="custom" align="center" /> -->
      <el-table-column prop="filename" label="文件名" align="center" />
      <el-table-column prop="username" label="用户名名" align="center" />
      <el-table-column prop="join_time" label="创建时间" align="center" />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button link type="danger" @click="handleDialogDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <br>

    <el-pagination background layout="total, sizes, prev, pager, next" :total="table.total" :page-size="table.query.limit"
      @current-change="handleChangePage" @size-change="handleChangeLimit" />
  </el-main>
</template>

<script setup>
import upload from './components/upload.vue'
import { ref } from 'vue'
// import api
import { getArchive, deleteArchive } from '@/apis/archive'
import { ElMessage, ElMessageBox } from 'element-plus'

const table = ref({
  total: 0,
  data: [],
  query: {
    limit: 20,
    page: 1,
    order: null,
    fileName: null,
    fileMd5: null
  },
  querySelect: {
    status: {
      '-2': '视频损坏',
      '-1': '文件损坏',
      0: '上传中',
      1: '文件正常'
    }
  }
})
const handleUploadSuccess = () => {
  ElMessage.success('上传成功！')
  handleTableData()
}
const handleChangePage = (value) => {
  table.value.query.page = value
  handleTableData()
}
const handleChangeLimit = (value) => {
  table.value.query.limit = value
  handleTableData()
}
const handleTableData = () => {
  getArchive(table.value.query).then((result) => {
    table.value.data = result.data.fileInfo
    table.value.total = table.value.data.length
    console.log(table.value.data)
  })
}

// 新增编辑数据
const handleDialogDelete = (row) => {
  ElMessageBox.confirm('请仔细确认是否删除 ' + row.filename + ' ?', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteArchive({ id: row.id }).then((result) => {
      ElMessage.warning(result)
      handleTableData()
    })
  })
}
/**
 * 提交表单数据
 */

// 播放弹窗

handleTableData()
</script>

<style lang="scss" scoped>
.ea-tag {
  margin: 2px;
}
</style>
