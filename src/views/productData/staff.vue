<template>
  <div class="app-container">
    <add-button @add="add" />

    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="keyword" label="微信昵称">
          <el-input v-model="searchForm.keyword" max-length="11" placeholder="微信昵称" />
        </el-form-item>
        <el-form-item prop="keyword" label="微信ID">
          <el-input v-model="searchForm.openId" max-length="11" placeholder="微信ID" />
        </el-form-item>
        <el-form-item prop="keyword" label="员工名称">
          <el-input v-model="searchForm.realName" max-length="11" placeholder="员工名称" />
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
    <el-dialog
        title="新增填报人员"
        :close-on-click-modal="true"
        :visible.sync="visible"
        @close="close"
    >
      <el-form ref="form" :model="produceUSerData" label-width="80px" :rules="rules">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="produceUSerData.mobile" placeholder="输入员工微信手机号"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser">查询员工信息</el-button>
        </el-form-item>
        <el-form-item label="微信ID" prop="openid">
          {{produceUSerData.openId?produceUSerData.openId: '请先查询手机号'}}
        </el-form-item>
        <el-form-item label="真实姓名" prop="username">
          {{produceUSerData.realName?produceUSerData.realName: '请先查询手机号'}}
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
import pagination from '../../mixins/pagination'
import AddButton from "../../components/AddButton";

export default {
  name: 'UserList',
  mixins: [pagination],
  components: { AddButton },

  data() {
    return {
      searchForm: {
        keyword: '',
        openId: '',
        realName: '',
        hasProduceAuth: true,
        saveDate: []
      },
      produceUSerData: {
        mobile: '',
        openId: '',
        realName: ''
      },
      reporters: [],
      rules: {
        mobile: [
          this.$rules.required('请输入手机号'),
          this.$rules.phone
        ]
      },
      submitLoading: false,
      visible: false,
      userListData: [],
      columns: [
        {label: '微信昵称', prop: 'username', showOverflowTooltip: true,},
        {label: '微信唯一ID',prop: 'openId',showOverflowTooltip: true},
        {label: '员工名', prop: 'realName',showOverflowTooltip: true,},
        {label: '手机号', prop: 'addressMobile'},
        {label: '添加时间', prop: 'saveDate', sortable: true},
        { label: '操作',width: '120', render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.deleteAuth(row)}>取消授权</span>
              </div>
            )
          }},
      ],
      loading: false
    }
  },
  created() {
    this.fetchData()
    // this.getReporters()
  },
  methods: {
    searchUser(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          userApi.getUserByMobile({
            mobile: this.produceUSerData.mobile
          }).then(res=>{
            this.$message1000('查询成功')
            this.produceUSerData = res
          }).catch(err=>{
            this.$message1000('请让该员工在小程序中添加带手机号的地址', 'error', 3000)
          })
        } else {
          return false
        }
      })
    },
    add() {
      this.visible = true
    },
    close() {
      this.$refs.form.resetFields()
      this.produceUSerData = {}
      this.visible = false
      this.submitLoading = false
    },
    getReporters(){
      userApi.getUserList({
        pageIndex: 1,
        pageSize: 1000,
        hasProduceAuth: false,
      }).then(res => {
        this.reporters = res.list.filter(v=> v.realName)
      })
    },
    fetchData() {
      this.loading = true
      userApi.getUserList({
        ...this.searchForm,
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
    deleteAuth(row){
      this.$confirm(`此操作将取消该用户权限, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.removeProduceUser({
          userId: row.userId,
        }).then(() => {
          this.$message1000(`取消成功`, 'success')
          this.fetchData()
        })
      })
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.produceUSerData.userId) {
            this.$message1000('请先查询手机号信息', 'error')
          } else {
            this.submitLoading = true
            userApi.addProduceUser({
              userId: this.produceUSerData.userId
            }).then(res => {
              this.$message1000('提交成功', 'success')
              this.close()
              this.fetchData()
            }).finally(() => {
              this.submitLoading = false
            })
          }
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
  /deep/ .el-select{
    width: 100%;
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
