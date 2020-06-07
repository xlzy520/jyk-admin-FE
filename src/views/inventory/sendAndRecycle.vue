<template>
  <div class="app-container">
<!--    <add-button @add="add" />-->

    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item label="餐具类型" prop="useTypeId">
          <el-select v-model="searchForm.useTypeId" placeholder="请选择餐具类型" clearable>
            <el-option v-for="tableware in tablewareList" :key="tableware.useTypeId"
                       :label="tableware.useType" :value="tableware.useTypeId"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="vehicle" label="所属车辆">
          <el-select v-model="searchForm.vehicle" placeholder="所属车辆" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="car in cars" :label="car.carNum+'---'+car.mark" :value="car.carId" />
          </el-select>
        </el-form-item>

        <el-form-item prop="saveDate" label="日期">
          <el-date-picker
            v-model="searchForm.saveDate"
            type="daterange"
            align="center"
            start-placeholder="添加时间起"
            end-placeholder="添加时间止"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="()=>fetchData(true)"
          >查询</el-button>
          <el-button type="info" @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-ext-header" v-if="false">
      <div class="table-ext-header-item">
        <span>今日累计发货量：</span>
        <span>{{countData.todayProduceCount}}</span>
      </div>
      <div class="table-ext-header-item">
        <span>今日累计回收量：</span>
        <span>{{countData.todaySendCount}}</span>
      </div>
      <div class="table-ext-header-item">
        <span>今日结营量：</span>
        <span>{{countData.totalSendCount}}</span>
      </div>
    </div>
    <xl-table
      ref="userListTable"
      v-loading="loading"
      :index="true"
      :count="count"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      :table-data="produceData"
      :table-columns="columns"
      @change-page="pageChange"
      @size-change="sizeChange"
    />
  </div>
</template>

<script>
import userApi from '../../api/user'
import produceApi from '../../api/produce'
import pagination from '../../mixins/pagination'
import AddButton from "../../components/AddButton";
import {mapGetters} from "vuex";
import {deepClone} from "../../utils";
import staffApi from "../../api/staff";
import inventoryApi from "../../api/inventory";
import carApi from "../../api/cars";

export default {
  name: 'ProductList',
  mixins: [pagination],
  components: { AddButton },
  data() {
    return {
      isAdd: true,
      countData: {
        todayProduceCount: 1110,
        todaySendCount: 1110,
        totalSendCount: 22220,
      },
      tablewareList: [],
      produceDayData: {
        produceTypeId: '',
        produceCount: '',
        sendCount: ''
      },
      searchForm: {
        useTypeId: '',
        saveDate: []
      },
      rules: {
        produceCount: [
          this.$rules.required('请输入数量'),
          this.$rules.number
        ],
        sendCount: [
          this.$rules.required('请输入数量'),
          this.$rules.number
        ],
        produceTypeId: [
          this.$rules.required('请选择规格'),
        ],
      },
      submitLoading: false,
      visible: false,
      reporters: [],
      produceData: [],
      columns: [
        {label: '规格种类', prop: 'useType'},
        {label: '所属车辆', prop: 'vehicle'},
        {label: '生产数量详情', prop: 'detail',width: 360, render: (h, { props: { row }}) => {
            return (
              <div class="detail">
                {row.inventoryDetailList.map(v=>{
                  return (
                    <div class="detail-row">
                      <div class="detail-content">
                        {
                          v.inventoryDetail.map(d=> {
                            return (
                              <div class="detail-content-item">
                                <span>{d.tablewareName}: </span>
                                <span>{d.quantity}</span>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }},

        {label: '中转箱数量', prop: 'boxNum'},
        {label: '生产总量', prop: 'produceCount',formatter: row=>{
            const inventoryDetail = row.inventoryDetailList[0].inventoryDetail
            const count = inventoryDetail.reduce((pre, cur)=> {
              return pre + cur.quantity
            }, 0)
            return count
          }},
        {label: '生产时间', prop: 'saveDate'},
        // {label: '操作', render: (h, { props: { row }}) => {
        //     return (
        //       <div class='table-action'>
        //         <span onClick={() => this.edit(row)} >编辑</span>
        //       </div>
        //     )
        //   }},
      ],
      loading: false,
      cars: []
    }
  },
  created() {
    this.getCars()
    this.getTablewareList()
  },
  computed: {
    ...mapGetters([
      'userData'
    ]),
    hasAuth() {
      return ['super', 'admin'].includes(this.userData.roleCode)

    }
  },
  methods: {
    getCars(){
      carApi.getCar().then(res=>{
        this.cars = res
        this.fetchData()
      })
    },
    getTablewareList(){
      inventoryApi.tablewareList().then(res => {
        this.tablewareList = res
      })
    },
    add() {
      this.isAdd = true
      this.visible = true
    },
    close() {
      this.$refs.form.resetFields()
      this.produceDayData = {}
      this.visible = false
      this.submitLoading = false
    },
    getReporters(){
      userApi.getUserList({
        pageIndex: 1,
        pageSize: 1000,
        hasProduceAuth: true
      }).then(res => {
        this.reporters = res.list
      })
    },
    fetchData(search) {
      let data = this.searchForm
      this.loading = true
      if (data&&data.payTime&&data.payTime.length>0) {
        data.startDate = data.payTime[0]
        data.endDate = data.payTime[1]
      } else {
        data.startDate = ''
        data.endDate = ''
      }
      inventoryApi.list({
        ...data,
        ...this.pageOption,
        inventoryType: 4
      }).then(res => {
        if (search) {
          this.$message1000('请求成功')
        }
        this.produceData = res.list.map(v=>{
          const item= this.cars.find(f=> f.carId == v.vehicle)
          if (item) {
            v.vehicle = item.carNum+ '---' + item.mark
          }
          return v
        })
        this.count = res.count
      }).finally(_ => {
        this.loading = false
      })
    },

    // fetchData(search) {
    //   let seachParams = {}
    //   const { saveDate } = this.searchForm
    //   if (saveDate.length === 2) {
    //     const [startDate, endDate] = this.searchForm.saveDate
    //     seachParams = {
    //       startDate: startDate,
    //       endDate: endDate
    //     }
    //   }
    //   this.loading = true
    //   const params = {
    //     ...this.searchForm,
    //     ...seachParams,
    //     ...this.pageOption
    //   }
    //   produceApi.getProduceList(params).then(res => {
    //     if (search) {
    //       this.$message1000('请求成功')
    //     }
    //     this.produceData = res.list
    //     this.countData = res.countData
    //     this.count = res.count
    //   }).finally(_ => {
    //     this.loading = false
    //   })
    // },
    edit(row){
      this.isAdd = false
      this.produceDayData = deepClone(row)
      // this.form.addRoleCode = this.form.roleCode
      this.visible = true
      // this.$prompt('', '请输入修正数量', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   inputValidator: function (val) {
      //     if (val === '') {
      //       return '请输入修正数量'
      //     } else if (val.length > 10) {
      //       return '请输入10位字以内'
      //     }
      //   }
      // }).then(({ value }) => {
      //   produceApi.updateProduce({
      //     produceCount: value
      //   }).then(() => {
      //     this.$message1000('修改成功', 'success')
      //     this.fetchData()
      //   })
      // })
    },
    deleteRow(row){
      this.$confirm(`此操作将删除该条数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.deleteDayProduceData({
          userId: row.userId,
        }).then(() => {
          this.$message1000(`删除成功`, 'success')
          this.fetchData()
        })
      })
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const result = this.isAdd ? produceApi.addProduce : produceApi.updateProduce
          const text = this.isAdd ? '新增成功': '更新成功'
          result(this.produceDayData).then(res => {
            this.$message1000(text, 'success')
            this.close()
            this.fetchData()
          }).finally(() => {
            this.submitLoading = false
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
  .table-ext-header{
    display: flex;
    margin-bottom: 10px;
    padding: 0 40px;
    &-item{
      font-weight: bold;
      padding-right: 80px;
      span:last-child{
        margin-right: 20px;
        color: coral;
      }
      &:last-child{
        border: none;
      }
    }
  }
/deep/ .table-action{
  span{
    font-size: 14px;
  }
}
  /deep/ .el-range-editor.el-input__inner{
    width: 300px;
  }
</style>
