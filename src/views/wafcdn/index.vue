<template>
  <!-- 数据展示框 -->
  <el-main class="ea-table">
    <!-- 数据操作按钮 -->
    <el-button type="primary" icon="Plus" @click="dialog.handleDialogAdd">
      新增
    </el-button>
    <el-button type="primary" icon="Refresh" @click="conf.visible = true">
      全局配置
    </el-button>
    <el-button type="primary" @click="conf.visible = true">
      <el-icon class="el-icon--right">
        <Upload />
      </el-icon>
      <span> </span>一键训练
    </el-button>
    <!-- 数据table -->
    <el-table style="width: 100%" ref="tableRef" :data="table.data">
      <el-table-column label="主机编号" prop="number" />
      <el-table-column label="源数据" prop="filename" align="center" />
      <el-table-column label="模型名称" prop="model_name" />

      <el-table-column label="模型id" prop="model_id" align="center" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button size="small" type="primary" @click="terminal.handleNew(scope.row)">本地训练</el-button>
          <el-button type="danger" :icon="Delete" circle @click="dialog.handleDialogDelete(scope.row.number)" />
          <el-button :type="scope.row.flag" :icon="Check" circle />
        </template>
      </el-table-column>
    </el-table>

    <br>

    <el-pagination background layout="total, sizes, prev, pager, next" :total="table.total" :page-size="table.query.limit"
      @current-change="table.handleChangePage" @size-change="table.handleChangeLimit" />
  </el-main>

  <!-- 处理数据|新增编辑 -->
  <el-dialog v-model="dialog.visible" :title="dialog.title" :close-on-click-modal="false" destroy-on-close
    close-on-press-escape center>

    <el-form ref="dialogRef" label-position="left" :model="dialog.form" :rules="dialog.formRule">
      <el-form-item label="主机id" prop="title">
        <el-input v-model="dialog.form.title" />
      </el-form-item>
      <el-form-item label="训练源模型" prop="model">
        <el-select placeholder="请输入模型名" v-model="dialog.form.model_name" clearable>
          <el-option v-for="item in file.model" :label="item.modelname" :value="item.modelname" :key="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="训练源文件" prop="ip">
        <el-select placeholder="请输入文件名" v-model="dialog.form.filename" clearable>
          <el-option v-for="item in file.data" :label="item.filename" :value="item.filename" :key="item.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="dialog.handleSubmitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="conf.visible" title="全局配置">

    <el-form ref="dialogRef" label-position="left" :model="dialog.form" :rules="dialog.formRule">
      <el-form-item label="conf文件" prop="title">
        <el-input v-model="conf.text" type="textarea" autosize />
      </el-form-item>

      <el-form-item label="测试源文件" prop="ip">
        <el-select placeholder="请输入文件名" v-model="conf.test_file" clearable>
          <el-option v-for="item in file.data" :label="item.filename" :value="item.filename" :key="item.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="conf.visible = false">取消</el-button>
        <el-button type="primary" @click="conf.handleSubmitForm">上传</el-button>
      </span>
    </template>
  </el-dialog>
  <div ref="trendChart" class="chart" />
</template>




<script setup>
import { ref, onMounted } from 'vue'

import {
  Check,
  Delete,
  Upload
} from '@element-plus/icons-vue'

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

// import api
import { getArchive, getModel } from '@/apis/archive'
import { postConf, queryHost, addHost, deleteHost, trainHost } from '@/apis/wafcdn'
import { ElMessage, ElMessageBox } from 'element-plus'

// ws 请求地址配置
import { authStore } from '@/stores'
import { byteBPSFormat, dateFormat, fileSizeFormat } from '@/utils'

import * as echarts from 'echarts'

const wsUrl = new URL(import.meta.env.VE_API_URL, window.location.href).origin.replace('http', 'ws').replace('https', 'wss')
const wsssh = `${wsUrl}/ssh?token=${authStore().token}`
const wsmonitor = `${wsUrl}/monitor?token=${authStore().token}`

const conf = ref({
  visible: false,
  test_file: "",
  text: "",
  handleSubmitForm: () => {
    console.log(conf.value.text);
    console.log(conf.value.test_file);
    let obj = JSON.parse(conf.value.text)
    obj['test_file'] = conf.value.test_file
    postConf(obj).then((result) => {
      console.log(result);
    })
  }
})
const file = ref({
  data: [],
  model: []
})

const handleFileData = () => {
  getArchive().then((result) => {
    file.value.data = result.data.fileInfo
  })
}
const handleModelData = () => {
  getModel().then((result) => {
    file.value.model = result.data.fileInfo
  })
}

const tableRef = ref()
const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: null,
    name: null
  },
  data: [],
  dataShow: {
    id: false,
    ip: false,
    port: false
  },
  handleDate: () => {
    queryHost().then((result) => {
      table.value.data = result.data.fileInfo
      table.value.total = result.data.fileInfo.length
      console.log(table.value.data);
    })
  },
  handleTableData: () => {

  },
  handleConfigPush: () => {

  },
  handleInvertSelection: () => {
    table.value.data.forEach((row) => {
      tableRef.value.toggleRowSelection(row)
    })
  },
  handleNewStat: () => {
    const ws = new WebSocket(wsmonitor)
    ws.onmessage = (event) => {
      const row = JSON.parse(event.data)
      row.conf.time = row.conf.time ? dateFormat('Y-m-d H:i:s', row.conf.time) : '状态出错'
      row.disk.used = fileSizeFormat(row.disk.used)
      row.disk.total = fileSizeFormat(row.disk.total)
      row.netsend = byteBPSFormat(row.netsend)
      row.netrecv = byteBPSFormat(row.netrecv)
      for (const element of table.value.data) {
        if (element.ip === row.host) {
          element.stat = row
          break
        }
      }
    }
  },
})
const trendChart = ref(null)
onMounted(() => {
  const myTrendChart = echarts.init(trendChart.value)
  myTrendChart.setOption({
    title: { text: '模型准确度' },
    legend: {},
    tooltip: {},
    xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7'] },
    yAxis: { type: 'value' },
    series: [{ data: [12, 13, 15, 17, 21, 25, 24], type: 'line' }]
  })

  window.onresize = function () {
    // myShareChart.resize()
    // myDetailChart.resize()
    myTrendChart.resize()
  }
})


// dialog 的 element 实例
const dialogRef = ref(null)
const dialog = ref({
  visible: false,
  title: 'dialog',
  form: {},
  formRule: {
    ip: [
      { required: false, message: '主机必须填写正确的IP', trigger: 'blur' }
    ],
    port: [
      { required: true, message: '端口', trigger: 'blur' }
    ],
    username: [
      { required: true, message: '用户', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '密码', trigger: 'blur' }
    ]
  },
  formAction: 'add', // add|edit
  handleDialogAdd: () => {
    dialog.value.title = '创建数据'
    dialog.value.visible = true
    dialog.value.formAction = 'add'
    dialog.value.form = {}
  },
  handleDialogEdit: (row) => {
    dialog.value.title = '编辑数据'
    dialog.value.visible = true
    dialog.value.formAction = 'edit'
    dialog.value.form = row
  },
  handleSubmitForm: () => { // 提交数据
    dialog.value.visible = false
    let temphost = {
      number: dialog.value.form.title,
      filename: dialog.value.form.filename,
      model_name: dialog.value.form.model_name
    }
    console.log(temphost);
    addHost(temphost).then((result) => {
      console.log(result);
      table.value.handleDate()
    })

  },
  handleDialogDelete: (number) => {
    ElMessageBox.confirm(`请仔细确认是否删除编号为[${number}]的主机?`, '警告', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteHost({ number: number }).then((result) => {
        console.log(result);
        table.value.handleDate();
      })
    })
  }
})

const terminal = ref({
  handleNew: async (row) => {
    console.log(row);
    await trainHost({
      id: row.number,
      model_name: "hello"
    }).then((result) => {
      console.log(result);
    })
    handleFileData()

  }
})
handleFileData()
handleModelData()
table.value.handleDate()

</script>
<style scoped lang="scss">
.chart {
  min-height: 300px;
  color: var(--ea-main-text-color);
  background-color: var(--ea-main-color);
}
</style>