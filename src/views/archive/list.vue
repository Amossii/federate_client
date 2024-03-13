<template>
  <el-main class="ea-table">
    <!-- 处理操作按钮 -->


    <!-- :data="table.data" -->
    <!-- @sort-change="handleSortChange" -->
    <el-table :data="table.data">
      <el-table-column label="模型名称" prop="modelname" fixed width="160" sortable="custom" />

      <el-table-column label="所有者" prop="username" align="center" />
      <el-table-column label="加入时间" prop="join_time" align="center" />
      <el-table-column label="acc" prop="acc" align="center">
        <template v-slot="{ row }">
          {{ row.acc.toFixed(3) }}
        </template>
      </el-table-column>
      <el-table-column label="loss" prop="loss" align="center">
        <template v-slot="{ row }">
          {{ row.loss.toFixed(3) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="140">
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
import { ref } from 'vue'

// import api
import {
  getModel, deleteModel
} from '@/apis/models'
import { ElMessage, ElMessageBox } from 'element-plus'

const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: '-id',
    id: null,
    name: null,
    status: null,
    updateStart: null,
    updateEnd: null
  },
  data: []
})

const handleChangePage = (value) => {
  table.value.query.page = value
  handleTableData()
}

const handleChangeLimit = (value) => {
  table.value.query.limit = value
  handleTableData()
}

const handleTableData = () => {
  getModel().then((result) => {
    table.value.data = result.data.fileInfo
    table.value.total = table.value.data.length
  })
}

const handleDialogDelete = (row) => {
  ElMessageBox.confirm('请仔细确认是否删除 ' + row.modelname + ' ?', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteModel({ id: row.id }).then((result) => {
      ElMessage.warning(result)
      handleTableData()
    })
  })
}

handleTableData()

</script>
