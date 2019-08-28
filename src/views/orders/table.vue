<template>
  <el-table
    ref="orderHistoryTable"
    style="margin-top: 20px;width: 100%"
    :data="order.historyList"
    border
  >
    <el-table-column label="操作者" width="120" align="center">
      <template slot-scope="scope">
        {{ scope.row.operateMan }}
      </template>
    </el-table-column>
    <el-table-column label="操作时间" width="160" align="center">
      <template slot-scope="scope">
        {{ scope.row.createTime}}
      </template>
    </el-table-column>
    <el-table-column label="订单状态" width="120" align="center">
      <template slot-scope="scope">
        {{ scope.row.orderStatus | formatStatus }}
      </template>
    </el-table-column>
    <el-table-column label="付款状态" width="120" align="center">
      <template slot-scope="scope">
        {{ scope.row.orderStatus | formatPayStatus }}
      </template>
    </el-table-column>
    <el-table-column label="发货状态" width="120" align="center">
      <template slot-scope="scope">
        {{ scope.row.orderStatus | formatDeliverStatus }}
      </template>
    </el-table-column>
    <el-table-column label="备注" align="center">
      <template slot-scope="scope">
        {{ scope.row.note }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: 'table'
  }
</script>

<style scoped>

</style>
