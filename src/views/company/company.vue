<template>
  <div class="company" v-loading="loading">
    <el-form ref="form" label-width="120px" :model="comForm" :rules="rule">
      <el-form-item label="手机或电话" prop="phone">
        <el-input v-model="comForm.phone" maxLength="12" />
      </el-form-item>
      <el-form-item label="公司地址" prop="partnersName">
        <el-input v-model="comForm.partnersName" maxLength="30" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="update">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import companyApi from '../../api/company'

export default {
  name: 'Company',
  data() {
    return {
      loading: false,
      comForm: {
        phone: '',
        partnersName: ''
      },
      rule: {
        phone: [
          { required: true, message: '请输入手机或电话' },
          { pattern: /^(\d+(-\d*)?)?$/g, message: '请输入合法的手机或电话', trigger: 'change' }
        ],
        partnersName: [
          { required: true, message: '请输入公司地址' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      companyApi.getCompanyInfo().then(res => {
        this.comForm = res
      }).finally(() => {
        this.loading = false
      })
    },
    update() {
      this.loading = true
      companyApi.updateCompanyInfo(this.comForm).then(res => {
        this.$message1000('更新成功', 'success')
      }).catch(() => {
        this.$ref.form.resetFields()
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.company{
  width: 80%;
  margin: 20px auto 0;
  padding: 20px 40px;
  box-shadow: #e8e8e8 5px 5px 10px 5px;
}
</style>
