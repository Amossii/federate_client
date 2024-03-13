<template>
  <el-main class="ea-table">
    <el-button type="primary" icon="Plus" @click="handleDialogAdd">
      新增
    </el-button>
    <el-table :data="table.data" style="width: 100%" @sort-change="handleSortChange">
      <el-table-column prop="id" label="ID" width="40" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="username" label="名称" />
      <el-table-column prop="password" label="密码">
        <template v-slot="{ row }">
          ***********
        </template>
      </el-table-column>
      <el-table-column prop="access" label="权限">
        <template v-slot="{ row }">
          {{ row.access ? "管理员" : "普通用户" }}
        </template>
      </el-table-column>
      <el-table-column prop="join_time" label="加入日期" />

      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" @click="handleDialogEdit(scope.row)">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDialogDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination background layout="total, sizes, prev, pager, next" :total="table.total"
      :default-page-size="table.query.limit" @current-change="handleChangePage" @size-change="handleChangeLimit" />
  </el-main>

  <el-dialog v-model="dialog.visible" :title="dialog.title" :close-on-click-modal="false" destroy-on-close
    close-on-press-escape center>
    <el-form ref="dialogRef" :model="dialog.form" :rules="dialog.formRule">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dialog.form.email" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="dialog.form.password" />
      </el-form-item>
      <el-form-item label="昵称" prop="username">
        <el-input v-model="dialog.form.username" />
      </el-form-item>
      <el-form-item label="权限" prop="access">
        <el-select v-model="dialog.form.access" placeholder="输入权限名称">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

// import api
import { getSystemAdmin, addSystemAdmin, setSystemAdmin, deleteSystemAdmin } from '@/apis/system/administrator'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSystemRole } from '@/apis/system/permission'

const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: null,
    email: null
  },
  data: []
})
const options = [
  {
    value: 0,
    label: "普通用户",
  },
  {
    value: 1,
    label: "管理员",
  },
]
const handleChangePage = (value) => {
  table.value.query.page = value
  handleTableData()
}
const handleChangeLimit = (value) => {
  table.value.query.limit = value
  handleTableData()
}
const handleSortChange = ({ column, prop, order }) => {
  let orderSymbol = ''
  if (order === 'descending') {
    orderSymbol = '-'
  } else if (order === 'ascending') {
    orderSymbol = '+'
  }
  table.value.query.order = orderSymbol + prop
  handleTableData()
}
const handleTableData = () => {
  getSystemAdmin(table.value.query).then((result) => {
    ElMessage.info(result.message)
    table.value.data = result.data.userInfo
    table.value.total = table.value.data.length
  })
}

// 新增编辑数据
const dialogRef = ref(null)
const dialog = ref({
  visible: false,
  title: 'dialog',
  form: {},
  formRule: {
    email: [
      { required: true, message: '邮箱', trigger: 'blur' },
      { min: 5, message: '用户名最少为5个字符', trigger: 'blur' }
    ],
  },
  formAction: 'add', // add|edit
  roleSelect: {
    value: null,
    loading: false,
    options: []
  }
})
const handleDialogAdd = () => {
  dialog.value.title = '创建数据'
  dialog.value.visible = true
  dialog.value.formAction = 'add'
  dialog.value.form = {}
}
const handleDialogEdit = (row) => {
  if (row.adminRoleId < 1) {
    ElMessage.warning('超级管理员不允许被编辑')
    return
  }
  dialog.value.title = '创建数据'
  dialog.value.visible = true
  dialog.value.formAction = 'edit'
  dialog.value.form = row
}
const handleDialogDelete = (id) => {
  ElMessageBox.confirm('请仔细确认是否删除?', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteSystemAdmin({ id }).then((result) => {
      ElMessage.warning(result)
      handleTableData()
    })
  })
}
const handleSubmitForm = () => {
  // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) { // 判断表单是否验证通过。
      if (dialog.value.formAction === 'add') {
        console.log(dialog.value.form);
        addSystemAdmin(dialog.value.form).then((result) => {
          console.log(result);
          dialog.value.visible = false
          ElMessage.info(result)
          handleTableData()
        })
      } else if (dialog.value.formAction === 'edit') {
        console.log(dialog.value.form);
        setSystemAdmin(dialog.value.form).then((result) => {
          dialog.value.visible = false
          ElMessage.info(result)
          handleTableData()
        })
        dialog.value.visible = false
      } else {
        ElMessage.info('提交错误')
      }
    } else {
      ElMessage.error('请输入正确的数据！')
    }
  })
}
const handleRoleSelectSearch = async (query) => {
  const roleList = await getSystemRole({ page: 1, limit: 20, name: query })
  dialog.value.roleSelect.options = roleList.data
}
const handleRoleSelectChange = async (val) => {
  dialog.value.form.adminRoleId = val.id
  dialog.value.form.AdminRole = val
}

handleTableData()

</script>
