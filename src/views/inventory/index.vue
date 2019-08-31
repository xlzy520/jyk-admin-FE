<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="userId">
          <el-select v-model="searchForm.userId" placeholder="请选择用户" filterable @change="userChange" clearable>
            <el-option v-for="user in userList" :key="user.userId" :label="user.username" :value="user.userId"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.schoolId" placeholder="请选择学校" filterable clearable>
            <el-option v-for="school in schoolList" :key="school.schoolId"
                       :label="school.schoolName" :value="school.schoolId"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.inventoryType" placeholder="请选择记录类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="回收" :value="1" />
            <el-option label="进货" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.useTypeId" placeholder="请选择餐具类型" clearable>
            <el-option v-for="tableware in tablewareList" :key="tableware.useTypeId"
                       :label="tableware.useType" :value="tableware.useTypeId"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="searchForm.mobile" maxLength="11" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item prop="payTime">
          <el-date-picker
            v-model="searchForm.payTime"
            type="daterange"
            align="center"
            unlink-panels
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            start-placeholder="记录时间起"
            end-placeholder="记录时间止"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="fetchData(searchForm)">查询</el-button>
          <el-button type="info" @click="resetForm">清空</el-button>
          <el-button type="success" @click="downloadExcel">导出记录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <xl-table
      ref="inventoryTable"
      v-loading="loading"
      :index="true"
      :table-data="inventoryData"
      :table-columns="columns"
      :count="count"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      @change-page="pageChange"
      @size-change="sizeChange"
    />
    <add-button @add="add" />

    <inventory-dialog ref="dialog" v-if="visible" :is-add="isAdd" @close="close"></inventory-dialog>
  </div>
</template>

<script>
import AddButton from '../../components/AddButton'
import inventoryApi from '../../api/inventory'
import schoolApi from '../../api/school'
import { deepClone } from '../../utils'
import axios from 'axios'
import { downloadFile} from '../../utils/index'
import pagination from '../../mixins/pagination'
import InventoryDialog from "./inventoryDialog";

export default {
  name: 'Inventory',
  components: {InventoryDialog, AddButton },
  mixins: [pagination],
  data() {
    return {
      searchForm: {
        payer: '',
        mobile: '',
        amount: '',
        payTime: '',
        userId: '',
        school: '',
        inventoryType: null,
        useTypeId: null
      },
      inventoryData: [],
      columns: [
        {label: '用户', prop: 'username'},
        {label: '手机号', prop: 'mobile',width: 100},
        {label: '学校', prop: 'schoolName',width: 100,showOverflowTooltip: true},
        {label: '记录类型', prop: 'recordType',width: 80,
          render: (h, { props: { row }}) => {
            const recordTypeMap = ['#EA3F33', '#007BFB']
            return (
              <el-tag effect="dark" color={recordTypeMap[row.inventoryType]}>
                {row.inventoryType?'回收':'进货'}
              </el-tag>
            )
          }
        },
        {label: '餐具类型', prop: 'useType',},
        {label: '餐具详情', prop: 'detail',width: 270,showOverflowTooltip: false, render: (h, { props: { row }}) => {
            return (
              <div>
                {row.inventoryDetailList.map(v=>{
                  return (
                    <div class="detail-row">
                      <div class="title">{row.inventoryType?v.inventoryName: '进货'}</div>
                      <div class="detail-content">{v.inventoryDetail.map(d=>d.tablewareName+':'+d.quantity+' ')}</div>
                    </div>
                  )
                })}
              </div>
            )
          }},
        {label: '添加时间', prop: 'saveDate', sortable: true,width: 100},
        {label: '更新时间', prop: 'modifyDate', sortable: true,width: 100},
        {
          label: '操作', prop: 'region',width: 100,
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.update(row)}>编辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delete(row.inventoryId)}>删除</span>
              </div>
            )
          }
        }
      ],
      schoolList: [],
      userList: [],

      pickerOptions: {
        shortcuts: [
          {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      loading: false,
      isAdd: false,
      visible: false,

      // 默认50条， 差不多一个月的订单量
      pageOption: {
        pageIndex: 1,
        pageSize: 50
      },
      count: 0,
      tablewareList: []
    }
  },

  methods: {
    getTablewareList(){
      inventoryApi.tablewareList().then(res => {
        this.tablewareList = res
      })
    },
    fetchData(data) {
      this.loading = true
      if (data&&data.payTime&&data.payTime.length>0) {
        data.startDate = data.payTime[0]
        data.endDate = data.payTime[1]
      }
      inventoryApi.list({
        ...data,
        ...this.pageOption
      }).then(res => {
        this.inventoryData = res.list
        this.count = res.count
      }).finally(_ => {
        this.loading = false
      })
    },
    add() {
      this.isAdd = true
      this.visible = true
    },
    update(row) {
      this.isAdd = false
      this.visible = true
      this.$nextTick(()=>{
        if (row.schoolId) {
          this.$refs.dialog.userType = 1
        }
        let cloneRow = deepClone(row)
        let tablewareData= {
          recoveryDetail: [],
          lossyDetail: []
        }
        cloneRow.inventoryDetailList.map(v=>{
          if (v.inventoryName === '回收') {
            v.inventoryDetail.map((d,index)=>{
              tablewareData.recoveryDetail[index] = d.quantity
            })
          } else {
            v.inventoryDetail.map((d,index)=>{
              tablewareData.lossyDetail[index] = d.quantity
            })
          }
        })
        console.log(row);
        this.$refs.dialog.formData = cloneRow
        this.$refs.dialog.tablewareData = tablewareData
        this.$refs.dialog.getspecsDetail()
        this.$refs.dialog.tablewareChange(row.useTypeId)
        if (row.userId) {
          this.$refs.dialog.getDefaultAddress()
        }
      })

    },
    downloadExcel(){
      axios.post('/market/inventory/list/export', this.searchForm, {
        responseType: 'blob'
      }).then(res=>{
        const url = URL.createObjectURL(res.data)
        downloadFile(url, '进销存记录.xlsx')
      })
    },
    userChange (){
      this.getDefaultAddress()
    },
    getSchoolList(){
      schoolApi.getSchool({
        pageIndex: 1,
        pageSize: 100
      }).then(res => {
        this.schoolList = res.list
      })
    },
    getUserList(){
      inventoryApi.userList().then(res => {
        this.userList = res
      })
    },
    delete(id) {
      this.$confirm('此操作将删除该进销存记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        inventoryApi.deleteSchool({
          inventoryId: id
        }).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    close() {
      this.visible = false
      this.fetchData()
    },
    resetForm(){
      this.$refs.searchForm.resetFields()
    }
  },
  created() {
    this.fetchData()
    this.getUserList()
    this.getSchoolList()
    this.getTablewareList()
  },
}
</script>

<style lang="scss" scoped>
  /deep/ .el-tag{
    font-size: 16px;
    border-color: unset;
  }
  /deep/ .detail-row{
    display: flex;
    justify-content: space-between;
    .detail-content{
      color: #787878;
      font-size: 12px;
    }
  }
</style>
<style lang="scss">
  .view-container{
    border-left: 1px solid #cbcbcb;
    width: 280px;
    height: 180px;
  }
</style>
