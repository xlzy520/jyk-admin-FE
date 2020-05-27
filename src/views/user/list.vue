<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="keyword" label="微信昵称">
          <el-input v-model="searchForm.keyword" max-length="11" placeholder="微信昵称" />
        </el-form-item>
        <el-form-item prop="saveDate" label="注册时间">
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
      searchForm: {
        keyword: '',
        saveDate: []
      },
      userListData: [],
      columns: [
        {label: '微信昵称', prop: 'username', width: 100,showOverflowTooltip: true,},
        {label: '城市', prop: 'city', width: 100, formatter: (row) => row.city === 'Changde' ? '常德' : row.city},
        {label: '手机号', prop: 'addressMobile',width: 120},
        {label: '默认地址', prop: 'defaultAddress',width: 160,showOverflowTooltip: true,
          formatter: (row) => {
            if (row.address) {
              return row.address|| row.schoolName + ' / ' + row.consignee
            }
            return ''
          }},
        {label: '备注', prop: 'mark'},
        { label: '状态', prop: 'white',width: 80,
          render: (h, { props: { row }}) => {
            return (
              <div class='is-default-icon'>
                <i class={'el-icon-' + (row.white ? 'success' : 'error')}/>
              </div>
            )
          }
        },
        {label: '注册时间', prop: 'saveDate',width: 100, sortable: true},
        {label: '微信唯一ID',prop: 'openId', width: 95, showOverflowTooltip: true},
        { label: '操作',width: '120', render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.mark(row)}>备注</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.black(row)}>{row.white?'拉黑': '取消拉黑'}</span>
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
      // if (saveDate.length === 2) {
      //   const [startDate, endDate] = this.searchForm.saveDate
      //   seachParams = {
      //     startDate: startDate,
      //     endDate: endDate
      //   }
      // }
      this.loading = true
      userApi.getUserList({
        ...seachParams,
        keyword: keyword,
        ...this.pageOption
      }).then(res => {
        this.userListData = res.list
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
/deep/ .table-action{
  span{
    font-size: 14px;
  }
}
  /deep/ .el-range-editor.el-input__inner{
    width: 300px;
  }
</style>
