<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="时间" align="center">
      <template slot-scope="scope">
        {{ scope.row.timestamp }}
      </template>
    </el-table-column>
    <el-table-column label="订单号" align="center">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="价格" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="状态" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import transactionApi from '@/api/transaction'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      transactionApi.transactionList().then(response => {
        this.list = response.items.slice(0, 8)
      })
    }
  }
}
</script>
