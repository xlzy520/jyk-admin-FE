<template>
  <div class="app-container">
    <add-button @add="add" />
    <xl-table
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
        <el-form-item label="姓名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" maxLength="11" />
        </el-form-item>
        <el-form-item label="员工类型" prop="addRoleCode">
          <el-radio-group v-model="form.addRoleCode">
            <el-radio label="super" border v-if="userData.roleCode === 'super'">超级管理员</el-radio>
            <el-radio label="admin" border v-if="userData.roleCode === 'super'">管理员</el-radio>
            <el-radio label="staff" border>普通员工</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="负责区域" prop="area">
          <el-input v-model="form.area" placeholder="请选择负责区域" />
        </el-form-item>
        <el-form-item v-if="isAdd" label="登录密码" prop="password">
          <el-input v-model="form.password" type="password" max-length="20" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button v-loading="submitLoading" type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
import AddButton from '../../components/AddButton'
import staffApi from '../../api/staff'
import { deepClone } from '../../utils'
import md5 from 'md5'
const initForm = {
  username: '',
  addRoleCode: 'staff',
  mobile: '',
  password: '',
  area: ''
}
export default {
  name: 'Staff',
  components: { AddButton },
  data() {
    return {
      staffData: [],
      columns: [
        { label: '姓名', prop: 'username' },
        { label: '手机号', prop: 'mobile' },
        { label: '角色', prop: 'roleCode',
          render: (h, { props: { row }}) => {
            const roleCode = this.statusFilter(row.roleCode)
            return (
              <el-tag type={roleCode.type}>{ roleCode.text }</el-tag>
            )
          }
        },
        { label: '负责区域', prop: 'area' },
        { label: '操作', render: (h, { props: { row }}) => {
            const canEdit = this.userData.roleCode === 'super' ||
              (this.userData.roleCode === 'admin' && row.roleCode==='staff')
            const superAdmin = (
              <div class='table-action'>
                <span onClick={() => this.update(row)}>编 辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delete(row.userId)}>删 除</span>
              </div>
            )
            if (canEdit) {
              return superAdmin
            }

            return (
              <div class='table-action'>
                <span onClick={() => this.update(row)}>编 辑</span>
              </div>
            )
          }
        }
      ],
      pageOption: {
        pageIndex: 1,
        pageSize: 100
      },
      loading: false,
      isAdd: false,
      editVisible: false,
      form: initForm,
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '请选择一个角色', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请选择一个区域', trigger: 'change' }
        ],
        mobile: [
          this.$rules.required('请输入手机号'),
          this.$rules.phone
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { pattern: /^[^\\\\\\/:*?\s\\"<>|]+$/, message: '请不要输入特殊字符', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
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
      staffApi.getStaff(this.pageOption).then(res => {
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
      this.form.addRoleCode = this.form.roleCode
      this.editVisible = true
    },
    delete(userId) {
      this.$confirm('此操作将删除该人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.loading = true
        staffApi.deleteStaff({ userId }).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    },
    close() {
      this.$refs.form.resetFields()
      this.form = initForm
      this.editVisible = false
      this.submitLoading = false
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.form.password) {
            this.form.password = md5(this.form.password)
          }
          const result = this.isAdd ? staffApi.addStaff(this.form) : staffApi.updateStaff(this.form)
          result.then(res => {
            this.$message1000('提交成功', 'success')
            this.close()
            this.fetchData()
          }).finally(() => {
            this.submitLoading = false
          })
        } else {
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

<style lang="scss" scoped>

</style>
