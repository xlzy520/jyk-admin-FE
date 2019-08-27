<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="nickname">
          <el-input v-model="searchForm.nickname" maxLength="11" placeholder="昵称" />
        </el-form-item>
        <el-form-item prop="orderNumber">
          <el-input v-model="searchForm.orderNumber" maxLength="11" placeholder="支付单号" />
        </el-form-item>
        <el-form-item prop="payChannel">
          <el-input v-model="searchForm.payChannel" maxLength="11" placeholder="支付通道订单号" />
        </el-form-item>
        <el-form-item prop="count">
          <el-input v-model.number="searchForm.count" maxLength="11" placeholder="金额" />
        </el-form-item>
        <el-form-item prop="addTime">
          <el-date-picker
            v-model="searchForm.addTime"
            type="daterange"
            align="center"
            start-placeholder="支付开始日期"
            end-placeholder="支付结束日期"
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
      :total="total"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      @change-page="pageChange"
      @size-change="sizeChange"
    />
  </div>
</template>

<script>
import payApi from '../../api/pay'
import pagination from '../../mixins/pagination'

export default {
  name: 'Online',
  mixins: [pagination],
  data() {
    return {
      payData: [],
      columns: [
        { label: '微信昵称', prop: 'payer' },
        { label: '手机号', prop: 'mobile' },
        { label: '账单号', prop: 'billNumber' },
        { label: '支付单号', prop: 'orderNumber' },
        { label: '支付通道号', prop: 'openNumber' },
        { label: '支付时间', prop: 'saveDate', sortable: true, width: 100 },
        { label: '金额', prop: 'amount' },
        { label: '支付状态', prop: 'billStatus', render: (h, { props: { row }}) => {
          if (row.billStatus) {
            return (
              <el-tag effect={'dark'} type={'success'}>已支付</el-tag>
            )
          }
          return (
            <el-tag effect={'dark'} type={'info'}>未支付</el-tag>
          )
        } }
      ],
      loading: false,
      searchForm: {
        payer: '',
        billNumber: '',
        orderNumber: '',
        openNumber: '',
        amount: '',
        saveDate: '',
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
      payApi.getPayOnline({
        ...data,
        ...this.pageOption
      }).then(res => {
        this.payData = res.list
        this.total = res.count
      }).finally(_ => {
        this.loading = false
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
