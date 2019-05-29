<template>
  <div class="app-container">
    <div class="header">
      <el-button type="primary" @click="add">新增</el-button>
    </div>
    <base-table
      ref="staffTable"
      :index="true"
      :loading="loading"
      :table-data="staffData"
      :table-columns="columns"
    />
    <el-dialog
      width="40%"
      :title="isAdd?'新增人员' : '人员信息更新'"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" maxLength="11" />
        </el-form-item>
        <el-form-item label="角色类型" prop="roles">
          <el-radio-group v-model="form.roles">
            <el-radio label="super" border>超级管理员</el-radio>
            <el-radio label="admin" border>管理员</el-radio>
            <el-radio label="staff" border>普通员工</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="负责区域" prop="region">
          <el-select v-model="form.region" placeholder="请选择负责区域">
            <el-option label="上海" value="shanghai" />
            <el-option label="深圳" value="shenzhen" />
          </el-select>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="form.password" type="password" max-length="20" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '../../components/baseTable'
import staffApi from '../../api/staff'
import { deepClone } from '../../utils/index'

export default {
  name: 'Staff',
  components: { BaseTable },
  data() {
    return {
      staffData: [],
      columns: [
        {
          label: '姓名',
          prop: 'name',
          align: 'center'
        },
        {
          label: '手机号',
          prop: 'phone',
          align: 'center'
        },
        {
          label: '角色',
          prop: 'roles',
          align: 'center',
          render: (h, { props: { row }}) => {
            const roles = this.statusFilter(row.roles)
            return (
              <el-tag type={roles.type}>{ roles.text }</el-tag>
            )
          }
        },
        {
          label: '负责区域',
          prop: 'region',
          align: 'center'
        },
        {
          label: '操作',
          prop: 'region',
          align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.update(row)}>编辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delete(row.id)}>删除</span>
              </div>
            )
          }
        }
      ],
      loading: false,
      isAdd: false,
      editVisible: false,
      form: {
        name: '',
        roles: '',
        phone: '',
        password: '',
        region: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '请选择一个角色', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请填写符合要求的11位手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'change' },
          { pattern: /^[^\\\\\\/:*?\s\\"<>|]+$/, message: '请不要输入特殊字符', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    statusFilter(status) {
      const statusMap = {
        'super': 'danger',
        'admin': 'warning',
        'staff': 'success'
      }
      const statusTextMap = {
        'super': '超级管理员',
        'admin': '管理员',
        'staff': '员工'
      }
      return {
        text: statusTextMap[status],
        type: statusMap[status]
      }
    },
    fetchData() {
      this.loading = true
      staffApi.getStaff().then(res => {
        this.staffData = res.list
      }).finally(_ => {
        this.loading = false
      })
    },
    add() {
      this.isAdd = true
      this.editVisible = true
    },
    update(row) {
      this.isAdd = false
      this.form = deepClone(row)
      // resetFields()会将form中的数据更改
      this.editVisible = true
    },
    delete(id) {
      staffApi.deleteStaff(id).then(_ => {
        this.$message1000('删除成功', 'success')
        this.fetchData()
      })
    },
    close() {
      this.editVisible = false
      this.form = {
        name: '',
        roles: '',
        phone: '',
        password: '',
        region: ''
      }
    },
    submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const result = await this.isAdd ? staffApi.addStaff(this.form) : staffApi.updateStaff(this.form)
          result.then(res => {
            this.$message1000('提交成功', 'success')
            this.close()
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss">
  .header{
    padding: 0 0 20px 0;
  }
  .line{
    text-align: center;
  }
  .table-action span{
    color: #1890ff;
    cursor: pointer;
  }
  .dialog-footer{
    display: flex;
    justify-content: center;
  }
</style>
