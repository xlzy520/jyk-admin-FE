<template>
  <div class="app-container">
    <div class="header">
      <el-button type="primary" @click="add">新增</el-button>
    </div>
    <base-table
      ref="staffTable"
      :index="true"
      :loading="loading"
      :table-data="staffData"
      :table-columns="columns"
      header-row-class-name="ant-style-header-row"
    />
    <dialog
      width="80%"
      title="增加人员"
    >
      <el-form>
        <el-form-item></el-form-item>
      </el-form>
    </dialog>
  </div>
</template>

<script>
import BaseTable from '../../components/baseTable'
import staffApi from '../../api/staff'

export default {
  name: 'Staff',
  components: { BaseTable },
  data() {
    return {
      staffData: [],
      columns: [
        {
          label: '姓名',
          prop: 'name',
          align: 'center'
        },
        {
          label: '手机号',
          prop: 'phone',
          align: 'center'
        },
        {
          label: '角色',
          prop: 'roles',
          align: 'center',
          render: (h, { props: { row }}) => {
            const roles = this.statusFilter(row.roles)
            return (
              <el-tag type={roles.type}>{ roles.text }</el-tag>
            )
          }
        },
        {
          label: '负责区域',
          prop: 'region',
          align: 'center'
        },
        {
          label: '操作',
          prop: 'region',
          align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.update(row)}>编辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delete(row.id)}>删除</span>
              </div>
            )
          }
        }
      ],
      loading: false,
      type: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    statusFilter(status) {
      const statusMap = {
        'super': 'danger',
        'admin': 'warning',
        'staff': 'success'
      }
      const statusTextMap = {
        'super': '超级管理员',
        'admin': '管理员',
        'staff': '员工'
      }
      return {
        text: statusTextMap[status],
        type: statusMap[status]
      }
    },
    fetchData() {
      this.loading = true
      staffApi.getStaff().then(res => {
        this.staffData = res.list
      }).finally(_ => {
        this.loading = false
      })
    },
    add() {

    },
    update(row) {

    },
    delete(id) {
      staffApi.deleteStaff(id).then(_ => {
        this.$message1000('删除成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .header{
    padding: 0 0 20px 0;
  }
  .line{
    text-align: center;
  }
  /deep/ .ant-style-header-row th{
    background-color: #fafafa;
    color: rgba(0,0,0,.85);
    font-weight: 500;
  }
  /deep/ .table-action span{
    color: #1890ff;
    cursor: pointer;
  }
</style>
