<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item label="昵称:" prop="nickname">
          <el-input v-model="searchForm.nickname" maxLength="11" />
        </el-form-item>
        <el-form-item label="支付单号:" prop="orderNumber">
          <el-input v-model="searchForm.orderNumber" maxLength="11" />
        </el-form-item>
        <el-form-item label="支付通道订单号:" prop="payChannel">
          <el-input v-model="searchForm.payChannel" maxLength="11" />
        </el-form-item>
        <el-form-item label="金额:" prop="count">
          <el-input v-model="searchForm.count" maxLength="11" />
        </el-form-item>
        <el-form-item label="支付状态:" prop="status">
          <el-select v-model="searchForm.status" placeholder="类型">
            <el-option label="未支付" value="no-pay" />
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付时间:" prop="addTime">
          <el-date-picker
            v-model="searchForm.addTime"
            type="daterange"
            align="center"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="fetchData(searchForm)"
          >查询</el-button>
          <el-button type="info" @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <xl-table
      ref="payTable"
      :index="true"
      :loading="loading"
      :table-data="payData"
      :table-columns="columns"
    />
  </div>
</template>

<script>
import payApi from '../../api/pay'

export default {
  name: 'Online',
  data() {
    return {
      payData: [],
      columns: [
        { label: '微信昵称', prop: 'payer'},
        { label: '账单号', prop: 'billNumber'},
        { label: '支付单号', prop: 'orderNumber'},
        { label: '支付通道订单号', prop: 'openNumber'},
        { label: '金额', prop: 'amount'},
        { label: '支付时间', prop: 'saveDate'},
        { label: '支付状态', prop: 'billStatus'},
        { label: '手机号', prop: 'mobile'},
        { label: '线上线下', prop: 'type'},
        { label: '操作', render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.delete(row.id)}>删 除</span>
              </div>
            )
          } }
      ],
      loading: false,
      searchForm: {
        nickname: '',
        orderNumber: '',
        payChannel: '',
        count: '',
        addTime: '',
        status: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(data) {
      this.loading = true
      payApi.getPayOnline(data).then(res => {
        this.payData = res.list
      }).finally(_ => {
        this.loading = false
      })
    },
    delete(id) {
      this.$confirm('此操作将删除该支付记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        payApi.deletePartner(id).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    },
    submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.fetchData(this.searchForm)
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

<style lang="scss" scoped>

</style>
