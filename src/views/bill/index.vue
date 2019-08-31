<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="searchForm.username" maxLength="11" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="支付单号" prop="orderNumber">
          <el-input v-model="searchForm.orderNumber" maxLength="30" placeholder="支付单号" />
        </el-form-item>
        <el-form-item label="支付方式" prop="statusCode">
          <el-select v-model="searchForm.type" placeholder="支付方式" clearable>
            <el-option label="全部" value="" />
            <el-option label="线上" :value="0" />
            <el-option label="线下" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model.number="searchForm.amount" maxLength="11" placeholder="金额" />
        </el-form-item>
        <el-form-item prop="addTime">
          <el-date-picker
            v-model="searchForm.addTime"
            type="daterange"
            align="center"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="支付开始日期"
            end-placeholder="支付结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="fetchData(searchForm)">查询</el-button>
          <el-button type="info" @click="resetForm">清空</el-button>
          <el-button type="success" @click="downloadExcel">导出记录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <xl-table
      ref="payTable"
      :index="true"
      :loading="loading"
      :table-data="payData"
      :table-columns="columns"
      :count="count"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      @change-page="pageChange"
      @size-change="sizeChange"
    />
  </div>
</template>

<script>
import billApi from '../../api/bill'
import pagination from '../../mixins/pagination'

export default {
  name: 'Online',
  mixins: [pagination],
  data() {
    return {
      payData: [],
      columns: [
        { label: '用户名', prop: 'payer' },
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
        } },
        { label: '操作',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.viewOrder(row)}>{row.type? '': '查看订单详情'}</span>
              </div>
            )
          } }
      ],
      loading: false,
      searchForm: {
        addTime: [],
        username: '',
        orderNumber: '',
        openNumber: '',
        amount: '',
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
    viewOrder(row){
      this.$router.push('/orders/detail?orderId='+row.orderId)
    },
    downloadExcel(){
      axios.post('/market/bill/list/export', this.searchForm, {
        responseType: 'blob'
      }).then(res=>{
        const url = URL.createObjectURL(res.data)
        downloadFile(url, '支付记录.xlsx')
      })
    },
    fetchData(data) {
      this.loading = true
      let params = {}
      if (data) {
        params = data
      }
      if (params.addTime&&params.addTime.length>0) {
        params = Object.assign(params, {
          startDate: params.addTime[0],
          endDate: params.addTime[1]
        })
      }
      billApi.getBill({
        ...params,
        ...this.pageOption
      }).then(res => {
        this.payData = res.list
        this.count = res.count
      }).finally(_ => {
        this.loading = false
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
