<template>
  <div style="float: right;margin: 20px">
    合计：<span class="color-danger">￥{{ order.totalAmount }}</span>
  </div>
  <div style="margin-top: 60px">
    <svg-icon icon-class="marker" style="color: #606266"/>
    <span class="font-small">费用信息</span>
  </div>
  <div class="table-layout">
    <el-row>
      <el-col :span="6" class="table-cell-title">商品合计</el-col>
      <el-col :span="6" class="table-cell-title">运费</el-col>
      <el-col :span="6" class="table-cell-title">优惠券</el-col>
      <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="table-cell">￥{{ order.totalAmount }}</el-col>
      <el-col :span="6" class="table-cell">￥{{ order.freightAmount }}</el-col>
      <el-col :span="6" class="table-cell">-￥{{ order.couponAmount }}</el-col>
      <el-col :span="6" class="table-cell">-￥{{ order.integrationAmount }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="table-cell-title">活动优惠</el-col>
      <el-col :span="6" class="table-cell-title">折扣金额</el-col>
      <el-col :span="6" class="table-cell-title">订单总金额</el-col>
      <el-col :span="6" class="table-cell-title">应付款金额</el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="table-cell">-￥{{ order.promotionAmount }}</el-col>
      <el-col :span="6" class="table-cell">-￥{{ order.discountAmount }}</el-col>
      <el-col :span="6" class="table-cell">
        <span class="color-danger">￥{{ order.totalAmount+order.freightAmount }}</span>
      </el-col>
      <el-col :span="6" class="table-cell">
        <span class="color-danger">￥{{ order.payAmount+order.freightAmount-order.discountAmount }}</span>
      </el-col>
    </el-row>
  </div>
  <div style="margin-top: 20px">
    <svg-icon icon-class="marker" style="color: #606266"/>
    <span class="font-small">操作信息</span>
  </div>
</template>

<script>
  export default {
    name: 'sss'
  }
</script>

<style scoped>

</style>
