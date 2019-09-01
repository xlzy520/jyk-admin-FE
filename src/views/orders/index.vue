<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="payer" label="用户名">
          <el-input v-model="searchForm.payer" maxLength="11" placeholder="输入用户名" />
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="searchForm.mobile" maxLength="11" placeholder="输入手机号" />
        </el-form-item>
        <el-form-item prop="orderNumber" label="订单编号">
          <el-input v-model="searchForm.orderNumber" maxLength="11" placeholder="输入订单编号" />
        </el-form-item>
        <el-form-item prop="statusCode" label="订单状态">
          <el-select v-model="searchForm.statusCode" placeholder="选择订单状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="待支付" value="unpaid" />
            <el-option label="待发货" value="unshipped" />
            <el-option label="已发货" value="unreceived" />
            <el-option label="已完成" value="completed" />
            <el-option label="月结" value="monthSettle" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
          <el-button type="info" @click="resetForm">清空</el-button>
          <el-button type="success" @click="downloadExcel">导出记录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <xl-table
      ref="orderTable"
      :index="true"
      :selection="true"
      :table-data="orderData"
      :table-columns="columns"
      :count="count"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      @change-page="pageChange"
      @size-change="sizeChange"
      @selection-change="handleSelectionChange"
    />
    <div class="footer" v-if="orderData.length>0">
      <el-button :disabled="selected.length<1"
                 type="danger" @click="orderDelete('all')">批量删除</el-button>
      <el-button :disabled="selected.length<1"
                 type="success" @click="monthSettle">完成月结</el-button>
    </div>
    <order-detail v-if="visible" ref="dialog" @close="close"/>
  </div>
</template>

<script>
import orderApi from '../../api/order'
import axios from 'axios'
import { downloadFile} from '../../utils/index'
import pagination from '../../mixins/pagination'
import OrderDetail from './detail'

export default {
  payer: 'OrderList',
  components: { OrderDetail },
  mixins: [pagination],
  data() {
    return {
      orderData: [],
      columns: [
        { label: '用户', prop: 'payer', minWidth: 100, showOverflowTooltip: true, formatter: row => {} },
        { label: '用户备注', prop: 'mark', minWidth: 100, showOverflowTooltip: true, },
        { label: '手机号', prop: 'mobile', width: 120 },
        { label: '数量', prop: 'total', width: 80 },
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
        { label: '状态', prop: 'statusCode',minWidth: 120,
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
        { label: '提交时间', prop: 'saveDate', sortable: true, minWidth: 100 },
        { label: '操作', prop: 'operate', minWidth: 135,
          render: (h, { props: { row }}) => {
            const send = (
              <span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delivery(row)}>发货</span>
              </span>
            )
            const month = (
              <span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.markMonth(row)}>月结</span>
              </span>
            )
            return (
              <div class='table-action'>
                <span onClick={() => this.detail(row)}>详情</span>
                {row.statusCode === 'unshipped' ? send : null}
                {row.statusCode === 'unpaid'&& row.type? month : null}
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.orderDelete(row)}>删除</span>
              </div>
            )
          }
        }
      ],
      loading: false,
      visible: false,
      searchForm: {
        payer: '',
        mobile: '',
        statusCode: '',
        orderNumber: ''
      },
      selected: [],
      count: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    monthSettle(){
      let canMonthComplete = this.selected.some(v=>v.statusCode!=='monthSettle')
      if (canMonthComplete) {
        this.$message1000('存在不是月结状态的订单，请选择月结状态的订单！', 'error')
        return false
      }
      this.loading = true
      orderApi.monthCompleted({
        orderIds: this.selected.map(v=>v.orderId)
      }).then(res=>{
        this.loading = false
        this.$message1000('完成月结', 'success')
        this.fetchData()
      }).catch(() => {
        this.loading = false
      })
    },
    downloadExcel(){
      axios.post('/market/order/list/export', this.searchForm, {
        responseType: 'blob'
      }).then(res=>{
        const url = URL.createObjectURL(res.data)
        downloadFile(url, '订单记录.xlsx')
      })
    },
    markMonth(row){
      this.$confirm('确定将此订单标记为月结用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.loading = true
        orderApi.orderConfirm({
          monthSettle:true,
          orderId: row.orderId
        }).then(res => {
          this.loading = false
          this.$message1000('标记成功！', 'success')
          this.fetchData()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    delivery(row) {
      this.$confirm('确认发货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        orderApi.fahuo({
          orderId: row.orderId
        }).then(res => {
          this.loading = false
          this.$message1000('发货成功', 'success')
          this.fetchData()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    orderDelete(type, id) {
      this.$confirm('此操作将删除订单,并且无法恢复,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        const params = type === 'all' ? this.selected.map(v=>v.id) : id
        orderApi.deleteOrder({
          id: params
        }).then(res => {
          this.$message1000('删除成功', 'success')
          this.loading = false
          this.fetchData()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    handleSelectionChange(rows) {
      this.selected = rows
    },
    fetchData() {
      this.loading = true
      orderApi.getOrder({
        ...this.searchForm,
        ...this.pageOption
      }).then(res => {
        this.orderData = res.list
        this.count = res.count
      }).finally(_ => {
        this.loading = false
      })
    },
    detail(row) {
      this.$router.push('/orders/detail?orderId='+row.orderId)
    },
    close() {
      this.form = {
        payer: '',
        stores: '',
        statusCode: '',
        price: ''
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          orderApi.updateOrder(this.form).then(_ => {
            this.visible = false
            this.$message1000('提交成功', 'success')
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.searchForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .stores{
    font-size: 20px;
    margin-bottom: 10px;
  }
  /deep/.table-img{
    img{
      width: 75%;
    }
  }
  .footer{
    margin: 20px auto;
  }
</style>
