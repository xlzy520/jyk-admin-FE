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
          <span style="font-size: 12px" v-if="order.statusCode==='unpaid'">(剩余{{order.lastTime}}自动关闭)</span>
          <div class="operate-button-container">
            <el-button v-show="order.statusCode==='unshipped'" size="mini" @click="delivery">确认发货</el-button>
            <el-button v-show="order.statusCode!=='completed'" size="mini" @click="orderClose">关闭订单</el-button>
          </div>
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
          <el-table-column label="属性" width="120" align="center">
            <template slot-scope="scope">
              {{ scope.row.productAttr | formatProductAttr }}
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120" align="center">
            <template slot-scope="scope">
              ￥{{ scope.row.productPrice*scope.row.productQuantity }}
            </template>
          </el-table-column>
        </xl-table>
      </el-card>
    </div>
  </div>
</template>
<script>
  import orderApi from '../../api/order'
  export default {
    name: 'OrderDetail',
    data() {
      return {
        loading: false,
        orderId: null,
        order: {},
        goodsTableData: [],
        goodsColumns: [
          {
            label: '商品图片', prop: 'pic',
            render: (h, { props: { row }}) => {
              return (
                <el-image src={this.$baseImgUrl + row.goodsUrl} fit='fit'>
                  <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
              )
            }
          },
          { label: '商品名称', prop: 'goodsName', align: 'left' },
          { label: '价格', prop: 'price' },
          { label: '数量', prop: 'quantity', width: 120 },
          { label: '小计/元', prop: 'amount', align: 'center', width: 120,formatter: row=>{
              return (row.quantity * Number(row.price)).toFixed(2)
            } },
        ],
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
          const { orderDetails, ...order } = res
          this.order = order
          this.goodsTableData = orderDetails
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
            this.$message1000('订单关闭成功', 'success')
            this.getOrderDetail()
          }).catch(() => {
            this.loading = false
          })
        })
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

</style>
