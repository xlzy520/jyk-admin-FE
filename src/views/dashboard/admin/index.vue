<template>
  <div class="dashboard-editor-container">

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <h3>本周交易额</h3>
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import LineChart from './components/LineChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
}

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart,
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  mounted() {
    this.$notify({
      title: '提示',
      message: '此页面数据均为模拟数据,待有真实数据后完善',
      type: 'info'
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
