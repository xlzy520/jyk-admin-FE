<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="keyword">
          <el-input v-model="searchForm.keyword" max-length="11" placeholder="昵称" />
        </el-form-item>
        <el-form-item prop="saveDate">
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
      :total="total"
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
        { label: '操作',width: '140',fixed: 'right', render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.mark(row)}>备注</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.black(row)}>拉黑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delete(row.userId)}>删 除</span>
              </div>
            )
          }},
        {label: '昵称', prop: 'username', width: 120,},
        {label: '城市', prop: 'city', width: 100, formatter: (row) => row.city === 'Changde' ? '常德' : row.city},
        {label: '手机号', prop: 'mobile',width: 120,formatter: (row) => '13588043792'},
        {label: '默认地址', prop: 'city',width: 120,showOverflowTooltip: false,
          formatter: (row) => '测试地址测试地址测试地址测试地址测试地址'},
        {label: '备注', prop: 'mark',width: 120,},
        {label: '状态', prop: 'black'},
        {
          label: '头像',
          prop: 'fileUrl',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-img'>
                <el-image style='width: 50px; height: 50px' src={row.fileUrl} fit='fit'/>
              </div>
            )
          }
        },
        {label: '注册时间', prop: 'saveDate',width: 120, sortable: true},
        {label: '微信唯一ID',prop: 'openId', width: 120},
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
        this.userListData = res.list
        this.total = res.total
      }).finally(_ => {
        this.loading = false
      })
    },
    mark(row){
      this.$prompt('请输入备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\w{0,100}$/,
        inputErrorMessage: '备注过长'
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
      this.$confirm('此操作将拉黑该人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.blackUser({
          userId: row.userId,
          black: true
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
