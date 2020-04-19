<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="keyword" label="规格">
          <el-select v-model="searchForm.guige" placeholder="规格" clearable>
            <el-option label="全部" value="" />
            <el-option label="规格A" :value="0" />
            <el-option label="规格B" :value="1" />
            <el-option label="规格C" :value="2" />
            <el-option label="规格D" :value="3" />
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
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="fetchData"
          >查询</el-button>
          <el-button type="info" @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-ext-header">
      <div class="table-ext-header-item">
        <span>今日累计生产量：</span>
        <span>{{todayProduce}}</span>
      </div>
      <div class="table-ext-header-item">
        <span>今日累计出货量：</span>
        <span>{{todaySend}}</span>
      </div>
      <div class="table-ext-header-item">
        <span>累计出货量：</span>
        <span>{{totalSend}}</span>
      </div>
    </div>
    <xl-table
      ref="userListTable"
      v-loading="loading"
      :index="true"
      :count="count"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      :table-data="userListData"
      :table-columns="columns"
      @change-page="pageChange"
      @size-change="sizeChange"
    />
  </div>
</template>

<script>
import userApi from '../../api/user'
import pagination from '../../mixins/pagination'

export default {
  name: 'UserList',
  mixins: [pagination],
  data() {
    return {
      todayProduce: 1110,
      todaySend: 1110,
      totalSend: 22220,
      searchForm: {
        guige: '',
        saveDate: []
      },
      userListData: [
        {
          guigeType: '规格A', num: 999, saveDate: '2019-09-29 12:33:29', 'reporter': '测试人'
        }
      ],
      columns: [
        {label: '规格种类', prop: 'guigeType'},
        {label: '数量', prop: 'num'},
        {label: '生产时间', prop: 'saveDate', sortable: true},
        {label: '填报人', prop: 'reporter'},
        { label: '操作', render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.mark(row)}>编辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.black(row)}>删除</span>
              </div>
            )
          }},
      ],
      loading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      let seachParams = {}
      const { saveDate, keyword } = this.searchForm
      if (saveDate.length === 2) {
        const [startDate, endDate] = this.searchForm.saveDate
        seachParams = {
          startDate: startDate,
          endDate: endDate
        }
      }
      this.loading = true
      userApi.getUserList({
        ...seachParams,
        keyword: keyword,
        ...this.pageOption
      }).then(res => {
        // this.userListData = res.list
        this.count = res.count
      }).finally(_ => {
        this.loading = false
      })
    },
    mark(row){
      this.$prompt('', '请输入备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.mark,
        inputValidator: function (val) {
          if (val === '') {
            return '请输入备注'
          } else if (val.length > 100) {
            return '请输入100字以内备注'
          }
        }
      }).then(({ value }) => {
        userApi.markUser({
          userId: row.userId,
          mark: value
        }).then(() => {
          this.$message1000('备注成功', 'success')
          this.fetchData()
        })
      })
    },
    black(row){
      const text = row.white?'取消拉黑': '拉黑'
      this.$confirm(`此操作将${text}该用户, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.blackUser({
          userId: row.userId,
          white: !row.white
        }).then(() => {
          this.$message1000(`${text}成功`, 'success')
          this.fetchData()
        })
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
