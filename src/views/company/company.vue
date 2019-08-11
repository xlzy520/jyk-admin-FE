<template>
  <div v-loading="loading" class="company">
    <el-form label-width="80px" :model="comForm">
      <el-form-item label="电话" prop="mobile">
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
import request from '@/utils/request'

export default {
  name: 'Company',
  data() {
    return {
      loading: false,
      comForm: {
        phone: '',
        partnersName: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      request.post('/company/getInfo').then(res => {
        this.comForm = res
      }).finally(() => {
        this.loading = false
      })
    },
    update() {
      this.loading = true
      request.post('/partner/update', this.comForm).then(res => {
        this.fetchData()
        this.$message1000('更新成功', 'success')
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
