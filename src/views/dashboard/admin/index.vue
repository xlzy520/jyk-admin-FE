<template>
  <div class="dashboard-editor-container">

    <panel-group :visit-pv="visitPv" :data="billStatistics"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import userApi from '../../../api/user'
import billApi from '../../../api/bill'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
  },
  data() {
    return {
      lineChartData: {
        date: [],
        value: []
      },
      visitPv: null,
      billStatistics: {
        unshippedCount: null,
        monthSettleCount: null,
        dailyAmountCount: null
      },
    }
  },
  mounted() {
    this.getData()
    this.getbillStatistics()
    this.getSalesStatistics()
  },
  methods: {
    getData(){
      // userApi.visitTrend().then(res=>{
      //   this.visitPv = res[0].visitPv
      // })
      this.visitPv = 150  // todo visitPv接口报错  模拟数据
    },
    getbillStatistics(){
      billApi.billStatistics().then(res=>{
        this.billStatistics = res
      })
    },
    getSalesStatistics(){
      billApi.getSalesStatistics().then(res => {
        const date = res.map(v=>v.time.substr(0,10))
        const value = res.map(v=>Number(v.amount))
        this.lineChartData = {
          date: date,
          value: value
        }
      })
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
