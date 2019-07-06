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
import time from '../../mixins/time'

export default {
  name: 'UserList',
  mixins: [pagination, time],
  data() {
    return {
      searchForm: {
        keyword: '',
        saveDate: ''
      },
      userListData: [],
      columns: [
        {
          label: '昵称',
          prop: 'username',
          align: 'center',
          width: '180',
          showOverflowTooltip: true
        },
        {
          label: '城市',
          prop: 'city',
          align: 'center',
          width: '80',
          formatter: (row) => row.city === 'Changde' ? '常德' : row.city
        },
        {
          label: '头像',
          prop: 'fileUrl',
          align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-img'>
                <el-image style='width: 50px; height: 50px' src={row.fileUrl} fit='fit'/>
              </div>
            )
          }
        },
        {
          label: '注册时间',
          prop: 'saveDate',
          align: 'center'
        },
        {
          label: '微信唯一ID',
          prop: 'openId',
          align: 'center'
        }
      ],
      loading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      userApi.getUserList({
        ...this.getStartEndTime(this.searchForm.saveDate),
        ...this.searchForm,
        ...this.pageOption
      }).then(res => {
        this.userListData = res.list
        this.total = res.total
      }).finally(_ => {
        this.loading = false
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
