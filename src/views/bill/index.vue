<template>
  <div class="app-container" v-loading.body="fullLoading">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="searchForm.username" maxLength="11" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="订单号" prop="orderNumber">
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
    <el-dialog
      width="80%"
      title="查看月结账单详情"
      :close-on-click-modal="true"
      :visible.sync="visible"
      @close="close"
    >
      <div v-loading="dialogLoading">
        <xl-table
          ref="payTable"
          :index="true"
          :table-data="billDetailData"
          :table-columns="billDetailColumns"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import { downloadFile} from '../../utils/index'
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
        { label: '手机号', prop: 'mobile',minWidth: 108 },
        { label: '账单号', prop: 'billNumber', width: 122 },
        { label: '订单号', prop: 'orderNumber' },
        { label: '支付通道号', prop: 'openNumber' },
        { label: '金额', prop: 'amount' },
        { label: '支付方式', prop: 'method', width: 80,
          render: (h, { props: { row }}) => {
            const typeMap = ['#007BFB', '#EA3F33']
            return (
              <el-tag effect="dark" color={typeMap[row.type]}>
                {row.type?'线下':'线上' }{row.monthSettle? '月结': ''}
              </el-tag>
            )
          }},
        { label: '支付时间', prop: 'saveDate', sortable: true, minWidth: 100 },
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
                <span onClick={() => this.viewOrder(row)}>{row.type? '查看月结': '查看订单'}</span>
              </div>
            )
          } }
      ],
      fullLoading: false,
      loading: false,
      dialogLoading: false,
      visible: false,
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
      },

      billDetailData: [],
      billDetailColumns: [
        { label: '用户', prop: 'payer', width: 100, showOverflowTooltip: true,},
        { label: '手机号', prop: 'mobile', width: 120 },
        { label: '地址', prop: 'address',},
        { label: '订单号', prop: 'orderNumber', width: 115 },
        { label: '支付方式', prop: 'method', width: 80,
          render: (h, { props: { row }}) => {
            const typeMap = ['#007BFB', '#EA3F33']
            return (
              <el-tag effect="dark" color={typeMap[row.type]}>
                {row.type?'线下':'线上' }
              </el-tag>
            )
          }},
        { label: '状态', prop: 'statusCode',
          render: (h, { props: { row }}) => {
            const schoolMap = {
              'unpaid': 'info',
              'unshipped': 'primary',
              'unreceived': 'warning',
              'completed': 'success',
              'monthSettle': 'danger'
            }
            let text = row.statusName
            if (row.monthSettle) {
              if (row.statusCode !== 'monthSettle') {
                text = '月结' + text
              } else {
                text = '月结待结算'
              }
            }
            return (
              <el-tag effect='dark' type={schoolMap[row.statusCode]}>{text}</el-tag>
            )
          } },
        { label: '金额/元', prop: 'amount', align: 'center', width: 100 },
        { label: '提交时间', prop: 'saveDate', sortable: true, width: 100 },
        { label: '操作', prop: 'operate',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.detail(row)}>详情</span>
              </div>
            )
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    detail(row) {
      this.$router.push('/orders/detail?orderId='+row.orderId)
    },
    close (){
      this.visible = false
    },
    viewOrder(row){
      if (row.type) {
        this.fullLoading = true
        billApi.offlineOrderList({
          billId: row.billId
        }).then(res=>{
          this.billDetailData = res
          this.visible = true
        }).finally(() => {
          this.fullLoading = false
        })
      } else {
        this.$router.push('/orders/detail?orderId='+row.orderId)
      }
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
