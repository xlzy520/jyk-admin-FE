<template>
  <div class="detail-container" v-loading="loading">
    <div class="detail-header">
      <el-steps :active="formatStepStatus(order.statusCode)" finish-status="success" align-center>
        <el-step title="提交订单" :description="order.submitTime"/>
        <el-step title="支付订单" :description="order.saveDate"/>
        <el-step title="平台发货" :description="order.deliveryTime"/>
        <el-step title="交易完成" :description="order.completedTime"/>
      </el-steps>
    </div>
    <div class="detail-status">
      <el-card shadow="never" style="margin-top: 15px">
        <div class="operate-container">
          <i class="el-icon-warning color-danger" style="margin-left: 20px"/>
          <span class="color-danger">当前订单状态：{{ order.statusName }}</span>
          <div class="operate-button-container">
            <el-button v-show="order.statusCode==='unshipped'" size="mini" @click="delivery">确认发货</el-button>
            <el-button v-show="order.statusCode!=='completed'" size="mini" @click="orderClose">关闭订单</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <div style="margin-top: 20px">
      <svg-icon icon-class="marker" style="color: #606266"/>
      <span class="font-small">基本信息</span>
    </div>
    <div class="table-layout">
      <el-row>
        <el-col :span="8" class="table-cell-title">订单编号</el-col>
        <el-col :span="8" class="table-cell-title">用户账号</el-col>
        <el-col :span="8" class="table-cell-title">支付单号</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="table-cell">{{ order.orderNumber }}</el-col>
        <el-col :span="8" class="table-cell">{{order.payer}}</el-col>
        <el-col :span="8" class="table-cell">{{ order.billNumber }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="table-cell-title">支付方式</el-col>
        <el-col :span="8" class="table-cell-title">订单金额</el-col>
        <el-col :span="8" class="table-cell-title">订单类型</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="table-cell">月结或在线支付</el-col>
        <el-col :span="8" class="table-cell">{{ order.amount}}</el-col>
        <el-col :span="8" class="table-cell">月结或在线支付</el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px">
      <svg-icon icon-class="marker" style="color: #606266"/>
      <span class="font-small">收货人信息</span>
    </div>
    <div class="table-layout address">
      <el-row>
        <el-col :span="6" class="table-cell-title">收货人</el-col>
        <el-col :span="6" class="table-cell-title">手机号码</el-col>
        <el-col :span="6" class="table-cell-title">类型</el-col>
        <el-col :span="6" class="table-cell-title">收货地址</el-col>
      </el-row>
      <el-row>
        <el-col :span="6" class="table-cell">{{ order.consignee }}</el-col>
        <el-col :span="6" class="table-cell">{{ order.mobile }}</el-col>
        <el-col :span="6" class="table-cell">{{ order.addressType?'学校':'餐馆' }}</el-col>
        <el-col :span="6" class="table-cell">{{ order.address }}</el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px">
      <svg-icon icon-class="marker" style="color: #606266"/>
      <span class="font-small">商品信息</span>
    </div>
    <xl-table
      ref="goods"
      :table-data="goodsTableData"
      :table-columns="goodsColumns"
      style="width: 100%;margin-top: 20px"
      border
    >
      <el-table-column label="商品图片" width="120" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.productPic" style="height: 80px">
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.productName }}</p>
          <p>品牌：{{ scope.row.productBrand }}</p>
        </template>
      </el-table-column>
      <el-table-column label="价格/货号" width="120" align="center">
        <template slot-scope="scope">
          <p>价格：￥{{ scope.row.productPrice }}</p>
          <p>货号：{{ scope.row.productSn }}</p>
        </template>
      </el-table-column>
      <el-table-column label="属性" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.productAttr | formatProductAttr }}
        </template>
      </el-table-column>
      <el-table-column label="数量" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.productQuantity }}
        </template>
      </el-table-column>
      <el-table-column label="小计" width="120" align="center">
        <template slot-scope="scope">
          ￥{{ scope.row.productPrice*scope.row.productQuantity }}
        </template>
      </el-table-column>
    </xl-table>
  </div>
</template>
<script>
  import orderApi from '../../api/order'
  const defaultReceiverInfo = {
    orderId: null,
    receiverName: null,
    receiverPhone: null,
    receiverPostCode: null,
    receiverDetailAddress: null,
    receiverProvince: null,
    receiverCity: null,
    receiverRegion: null,
    status: null
  }
  export default {
    name: 'OrderDetail',
    filters: {
      formatNull(value) {
        if (value === undefined || value === null || value === '') {
          return '暂无'
        } else {
          return value
        }
      },
      formatLongText(value) {
        if (value === undefined || value === null || value === '') {
          return '暂无'
        } else if (value.length > 8) {
          return value.substr(0, 8) + '...'
        } else {
          return value
        }
      },
      formatPayType(value) {
        if (value === 1) {
          return '支付宝'
        } else if (value === 2) {
          return '微信'
        } else {
          return '未支付'
        }
      },
      formatSourceType(value) {
        if (value === 1) {
          return 'APP订单'
        } else {
          return 'PC订单'
        }
      },
      formatOrderType(value) {
        if (value === 1) {
          return '秒杀订单'
        } else {
          return '正常订单'
        }
      },
      formatAddress(order) {
        let str = order.receiverProvince
        if (order.receiverCity != null) {
          str += '  ' + order.receiverCity
        }
        str += '  ' + order.receiverRegion
        str += '  ' + order.receiverDetailAddress
        return str
      },
      formatStatus(value) {
        if (value === 1) {
          return '待发货'
        } else if (value === 2) {
          return '已发货'
        } else if (value === 3) {
          return '已完成'
        } else if (value === 4) {
          return '已关闭'
        } else if (value === 5) {
          return '无效订单'
        } else {
          return '待付款'
        }
      },
      formatPayStatus(value) {
        if (value === 0) {
          return '未支付'
        } else if (value === 4) {
          return '已退款'
        } else {
          return '已支付'
        }
      },
      formatDeliverStatus(value) {
        if (value === 0 || value === 1) {
          return '未发货'
        } else {
          return '已发货'
        }
      },
      formatProductAttr(value) {
        if (value == null) {
          return ''
        } else {
          const attr = JSON.parse(value)
          let result = ''
          for (let i = 0; i < attr.length; i++) {
            result += attr[i].key
            result += ':'
            result += attr[i].value
            result += ';'
          }
          return result
        }
      }
    },
    data() {
      return {
        loading: false,
        orderId: null,
        order: {},
        goodsTableData: [],
        goodsColumns: [
          { label: '用户', prop: 'payer', width: 120, showOverflowTooltip: true, formatter: row => {

            } },
          { label: '手机号', prop: 'mobile', width: 120 },
          { label: '数量', prop: 'total', width: 120 },
          { label: '订单号', prop: 'orderNumber', width: 120 },
          { label: '状态', prop: 'statusName',
            render: (h, { props: { row }}) => {
              const schoolMap = {
                'unpaid': 'info',
                'unshipped': 'primary',
                'unreceived': 'warning',
                'completed': 'success'
              }
              return (
                <el-tag effect='dark' type={schoolMap[row.statusCode]}>{row.statusName }</el-tag>
              )
            } },
          { label: '金额/元', prop: 'amount', align: 'center', width: 120 },
          { label: '提交时间', prop: 'saveDate', sortable: true, width: 200 },
          { label: '操作', prop: 'operate', fixed: 'right', width: 150,
            render: (h, { props: { row }}) => {
              const send = (
                <span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delivery(row)}>发 货</span>
              </span>
              )
              return (
                <div class='table-action'>
                  <span onClick={() => this.detail(row)}>详 情</span>
                  {row.statusCode === 'unshipped' ? send : null}
                  <el-divider direction={'vertical'}/>
                  <span onClick={() => this.orderDelete('one', row.id)}>删 除</span>
                </div>
              )
            }
          }
        ],


        receiverDialogVisible: false,
        receiverInfo: Object.assign({}, defaultReceiverInfo),
        moneyDialogVisible: false,
        moneyInfo: { orderId: null, freightAmount: 0, discountAmount: 0, status: null },
        messageDialogVisible: false,
        message: { title: null, content: null },
        closeDialogVisible: false,
        closeInfo: { note: null, id: null },
        markOrderDialogVisible: false,
        markInfo: { note: null },
        logisticsDialogVisible: false
      }
    },
    created() {
      this.orderId = this.$route.query.orderId
      this.getOrderDetail()
    },
    methods: {
      getOrderDetail(){
        this.loading = true
        orderApi.orderDetail({
          orderId: this.orderId
        }).then(res => {
          this.order = res
        }).finally(() => {
          this.loading = false
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
            orderId: this.orderId
          }).then(res => {
            this.loading = false
            this.$message1000('发货成功', 'success')
            this.getOrderDetail()
          }).catch(() => {
            this.loading = false
          })
        })
      },
      orderClose(){
        let text = ''
        if (this.order.statusCode!== 'unpaid') {
          text = '用户已确认支付，'
        }
        this.$confirm(`${text}您确定要关闭该订单?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.loading = true
          orderApi.orderClose({
            orderId: this.orderId
          }).then(()=>{
            this.loading = false
            this.$message('订单关闭成功', 'success')
            this.getOrderDetail()
          }).catch(() => {
            this.loading = false
          })
        })
      },

      onSelectRegion(data) {
        this.receiverInfo.receiverProvince = data.province.value
        this.receiverInfo.receiverCity = data.city.value
        this.receiverInfo.receiverRegion = data.area.value
      },
      formatStepStatus(value) {
        const statusMap = {
          'unpaid': 1,
          'unshipped': 2,
          'unreceived': 3,
          'completed': 4
        }
        return statusMap[value]
      },
      showUpdateReceiverDialog() {
        this.receiverDialogVisible = true
        this.receiverInfo = {
          orderId: this.order.id,
          receiverName: this.order.receiverName,
          receiverPhone: this.order.receiverPhone,
          receiverPostCode: this.order.receiverPostCode,
          receiverDetailAddress: this.order.receiverDetailAddress,
          receiverProvince: this.order.receiverProvince,
          receiverCity: this.order.receiverCity,
          receiverRegion: this.order.receiverRegion,
          status: this.order.status
        }
      },
      handleUpdateReceiverInfo() {
        this.$confirm('是否要修改收货信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateReceiverInfo(this.receiverInfo).then(response => {
            this.receiverDialogVisible = false
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            getOrderDetail(this.orderId).then(response => {
              this.order = response.data
            })
          })
        })
      },
      showUpdateMoneyDialog() {
        this.moneyDialogVisible = true
        this.moneyInfo.orderId = this.order.id
        this.moneyInfo.freightAmount = this.order.freightAmount
        this.moneyInfo.discountAmount = this.order.discountAmount
        this.moneyInfo.status = this.order.status
      },
      handleUpdateMoneyInfo() {
        this.$confirm('是否要修改费用信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateMoneyInfo(this.moneyInfo).then(response => {
            this.moneyDialogVisible = false
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            getOrderDetail(this.orderId).then(response => {
              this.order = response.data
            })
          })
        })
      },
      showMessageDialog() {
        this.messageDialogVisible = true
        this.message.title = null
        this.message.content = null
      },
      handleSendMessage() {
        this.$confirm('是否要发送站内信?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.messageDialogVisible = false
          this.$message({
            type: 'success',
            message: '发送成功!'
          })
        })
      },
      showCloseOrderDialog() {
        this.closeDialogVisible = true
        this.closeInfo.note = null
        this.closeInfo.id = this.orderId
      },
      handleCloseOrder() {
        this.$confirm('是否要关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = new URLSearchParams()
          params.append('ids', [this.closeInfo.id])
          params.append('note', this.closeInfo.note)
          closeOrder(params).then(response => {
            this.closeDialogVisible = false
            this.$message({
              type: 'success',
              message: '订单关闭成功!'
            })
            getOrderDetail(this.orderId).then(response => {
              this.order = response.data
            })
          })
        })
      },
      showMarkOrderDialog() {
        this.markOrderDialogVisible = true
        this.markInfo.id = this.orderId
        this.closeOrder.note = null
      },
      handleMarkOrder() {
        this.$confirm('是否要备注订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = new URLSearchParams()
          params.append('id', this.markInfo.id)
          params.append('note', this.markInfo.note)
          params.append('status', this.order.status)
          updateOrderNote(params).then(response => {
            this.markOrderDialogVisible = false
            this.$message({
              type: 'success',
              message: '订单备注成功!'
            })
            getOrderDetail(this.orderId).then(response => {
              this.order = response.data
            })
          })
        })
      },
      handleDeleteOrder() {
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = new URLSearchParams()
          params.append('ids', [this.orderId])
          deleteOrder(params).then(response => {
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            })
            this.$router.back()
          })
        })
      },
      showLogisticsDialog() {
        this.logisticsDialogVisible = true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .color-danger{
    color: #f56c6c;
  }
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>
