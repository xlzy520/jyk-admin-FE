<template>
  <div class="app-container">
    <add-button @add="add" />

    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="keyword" label="规格">
          <el-select v-model="searchForm.produceTypeId" placeholder="规格" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="option in typeOptions" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="saveDate" label="生产日期">
          <el-date-picker
            v-model="searchForm.saveDate"
            type="daterange"
            align="center"
            start-placeholder="注册时间起"
            end-placeholder="注册时间止"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item prop="keyword" label="填报人">
          <el-select v-model="searchForm.realName" placeholder="填报人" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="reporter in reporters" :label="reporter.realName" :value="reporter.userId" />
          </el-select>
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
    <div class="table-ext-header">
      <div class="table-ext-header-item">
        <span>今日累计生产量：</span>
        <span>{{countData.todayProduceCount}}</span>
      </div>
      <div class="table-ext-header-item">
        <span>今日累计出货量：</span>
        <span>{{countData.todaySendCount}}</span>
      </div>
      <div class="table-ext-header-item">
        <span>累计出货量：</span>
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
    <el-dialog
        :title="isAdd?'新增今日生产数据' : '数据更新'"
        :close-on-click-modal="true"
        :visible.sync="visible"
        @close="close"
    >
      <el-form ref="form" :model="produceDayData" label-width="80px" :rules="rules">
        <el-form-item prop="produceTypeId" label="规格">
          <el-select v-model="produceDayData.produceTypeId" placeholder="规格" clearable>
            <el-option v-for="option in typeOptions" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="生产数量" prop="produceCount">
          <el-input v-model="produceDayData.produceCount" />
        </el-form-item>
        <el-form-item label="出货数量" prop="sendCount">
          <el-input v-model="produceDayData.sendCount" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button v-loading="submitLoading" type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-dialog>

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

export default {
  name: 'UserList',
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
      typeOptions:[
        {label: '学生餐具', value: 0},
        {label: '幼儿园餐具', value: 1},
        {label: '餐馆餐具', value: 2},
        {label: '宴席餐具', value: 3},
      ],
      produceDayData: {
        produceTypeId: '',
        produceCount: '',
        sendCount: ''
      },
      searchForm: {
        produceTypeId: '',
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
        {label: '规格种类', prop: 'produceTypeId', formatter: row=> {
          return this.typeOptions.find(option => option.value === row.produceTypeId).label
          }},
        {label: '生产数量', prop: 'produceCount'},
        {label: '出货数量', prop: 'sendCount'},
        {label: '生产时间', prop: 'saveDate'},
        {label: '填报人', prop: 'reporterName'},
        {label: '操作', render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.edit(row)} >编辑</span>
              </div>
            )
          }},
      ],
      loading: false
    }
  },
  created() {
    this.getReporters()
    this.fetchData()
    if (!this.hasAuth) {
      this.columns.pop()
    }
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
      let seachParams = {}
      const { saveDate } = this.searchForm
      if (saveDate.length === 2) {
        const [startDate, endDate] = this.searchForm.saveDate
        seachParams = {
          startDate: startDate,
          endDate: endDate
        }
      }
      this.loading = true
      const params = {
        ...this.searchForm,
        ...seachParams,
        ...this.pageOption
      }
      produceApi.getProduceList(params).then(res => {
        if (search) {
          this.$message1000('请求成功')
        }
        this.produceData = res.list
        this.countData = res.countData
        this.count = res.count
      }).finally(_ => {
        this.loading = false
      })
    },
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
