<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item label="注册时间:" prop="registerTime">
          <el-date-picker
            v-model="searchForm.registerTime"
            type="daterange"
            align="center"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="登录时间:" prop="lastLoginTime">
          <el-date-picker
            v-model="searchForm.lastLoginTime"
            type="daterange"
            align="center"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="昵称:" prop="nickname">
          <el-input v-model="searchForm.nickname" max-length="11" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="fetchData(searchForm)"
          >查询</el-button>
          <el-button type="info" @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <base-table
      ref="userListTable"
      :index="true"
      :loading="loading"
      :table-data="userListData"
      :table-columns="columns"
    />
  </div>
</template>

<script>
import BaseTable from '../../components/baseTable'
import userApi from '../../api/user'

export default {
  name: 'UserList',
  components: { BaseTable },
  data() {
    return {
      searchForm: {
        nickname: '',
        registerTime: '',
        // TODO 格式化时间
        lastLoginTime: ''
      },
      userListData: [],
      columns: [
        {
          label: '昵称',
          prop: 'nickname',
          align: 'center',
          width: '120'
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
          prop: 'avatar',
          align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-img'>
                <el-image style='width: 50px; height: 50px' src={row.avatar} fit='fit'/>
              </div>
            )
          }
        },
        {
          label: '注册时间',
          prop: 'registerTime',
          align: 'center',
          sortable: true
        },
        {
          label: '登录时间',
          prop: 'lastLoginTime',
          align: 'center',
          sortable: true
        },
        {
          label: '微信唯一ID',
          prop: 'openId',
          align: 'center'
        },
        {
          label: '操作',
          prop: 'region',
          align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <el-button type='danger' size='small' onClick={() => this.delete(row.id)}>删除</el-button>
              </div>
            )
          }
        }
      ],
      loading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(data) {
      this.loading = true
      userApi.getUserList(data).then(res => {
        this.userListData = res.list
      }).finally(_ => {
        this.loading = false
      })
    },
    delete(id) {
      userApi.deleteUser(id).then(_ => {
        this.$message1000('删除成功', 'success')
        this.fetchData()
      })
    },
    resetForm() {
      this.$refs.searchForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
