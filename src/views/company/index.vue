<template>
  <div class="company">
    <el-form label-width="80px" :model="comForm">
      <el-form-item label="电话">
        <el-input v-model="comForm.phone" />
      </el-form-item>
      <el-form-item label="公司地址">
        <el-input v-model="comForm.address" />
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
      comForm: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      request.post('/company/getInfo').then(res => {
        this.comForm = res
      })
    },
    update() {
      request.post('/company/update').then(res => {
        this.fetchData()
        this.$message1000('更新成功', 'success')
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
