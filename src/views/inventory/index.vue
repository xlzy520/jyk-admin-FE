<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="userId" label="用户">
          <el-select v-model="searchForm.userId" placeholder="请选择用户" filterable clearable>
            <el-option v-for="user in userList" :key="user.userId" :label="user.username" :value="user.userId"/>
          </el-select>
        </el-form-item>

        <el-form-item label="学校" prop="schoolId">
          <el-select v-model="searchForm.schoolId" placeholder="请选择学校" filterable clearable>
            <el-option v-for="school in schoolList" :key="school.schoolId"
                       :label="school.schoolName" :value="school.schoolId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="记录类型" prop="inventoryType">
          <el-select v-model="searchForm.inventoryType" placeholder="请选择记录类型" clearable>
            <el-option label="生产" :value="3" />
            <el-option label="发货" :value="4" />
            <el-option label="回收" :value="1" />
            <el-option label="购买" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="餐具类型" prop="useTypeId">
          <el-select v-model="searchForm.useTypeId" placeholder="请选择餐具类型" clearable>
            <el-option v-for="tableware in tablewareList" :key="tableware.useTypeId"
                       :label="tableware.useType" :value="tableware.useTypeId"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="vehicle" label="所属车辆">
          <el-select v-model="searchForm.vehicle" placeholder="所属车辆" clearable>
            <el-option v-for="car in cars" :label="car.carNum+'---'+car.mark" :value="car.carId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="searchForm.mobile" maxLength="11" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item prop="payTime" label="记录时间">
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
          <el-button type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
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

    <inventory-dialog ref="dialog" v-if="visible" :is-add="isAdd" :user-list="userList"
                      :school-list="schoolList" :tableware-list="tablewareList" @close="close"></inventory-dialog>
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
import carApi from "../../api/cars";

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
        schoolId: '',
        inventoryType: '',
        useTypeId: '',
        vehicle: ''
      },
      cars: [],
      inventoryData: [],
      columns: [
        {label: '用户', prop: 'username', width: 100,showOverflowTooltip: true,},
        {label: '手机号', prop: 'mobile',minWidth: 110},
        {label: '学校/地址', prop: 'schoolName',minWidth: 100,showOverflowTooltip: true,formatter: row=>{
          return row.schoolName || row.address
          }},
        {label: '记录类型', prop: 'recordType',width: 80,
          render: (h, { props: { row }}) => {
            const recordTypeMap = ['#EA3F33', '#007BFB', '', '#00CC33', '#6633FF']
            const typeMap = ['进货', '回收', '', '生产', '发货']
            return (
              <el-tag effect="dark" color={recordTypeMap[row.inventoryType]}>
                {typeMap[Number(row.inventoryType)]}
              </el-tag>
            )
          }
        },
        {label: '所属车辆', prop: 'vehicleText'},
        {label: '餐具类型', prop: 'useType', width: 100},
        {label: '餐具详情', prop: 'detail',width: 360, render: (h, { props: { row }}) => {
            return (
              <div class="detail">
                {row.inventoryDetailList.map(v=>{
                  return (
                    <div class="detail-row">
                      <div class="title">{v.inventoryName}</div>
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

        // {label: '餐具详情', prop: 'detail',minWidth: 360, render: (h, { props: { row }}) => {
        //     return (
        //       <div class="detail">
        //         {row.inventoryDetailList.map(v=>{
        //           return (
        //             <div class="detail-row">
        //               <div class="title">{row.inventoryType?v.inventoryName: '购买'}</div>
        //               <div class="detail-content">{v.inventoryDetail.map(d=>d.tablewareName+':'+d.quantity+' ')}</div>
        //             </div>
        //           )
        //         })}
        //       </div>
        //     )
        //   }},
        {label: '中转箱', prop: 'boxNum', width: 100},
        {label: '添加时间', prop: 'saveDate', sortable: true,minWidth: 180},
        {label: '更新时间', prop: 'modifyDate', sortable: true,minWidth: 180},
        {
          label: '操作', prop: 'region',minWidth: 100, fixed: 'right',
          render: (h, { props: { row }}) => {
            const update = (
              <span>
                <span onClick={() => this.update(row)}>编辑</span>
                <el-divider direction={'vertical'}/>
              </span>
            )
            return (
              <div class='table-action'>
                {row.inventoryType ? update : null}
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
          {text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().setHours(0, 0, 0, 0));
              picker.$emit('pick', [start, end]);
            }
          },
          {text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        },
          {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        },
          {
            text: '最近三个月',
            onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }
        ]
      },
      loading: false,
      isAdd: false,
      visible: false,

      // 默认50条， 差不多一个月的订单量
      pageOption: {
        pageIndex: 1,
        pageSize: 20
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
    getCars(){
      carApi.getCar().then(res=>{
        this.cars = res
        this.fetchData()
      })
    },
    fetchData() {
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
        ...this.pageOption
      }).then(res => {
        this.inventoryData = res.list.map(v=>{
          const item= this.cars.find(f=> f.carId == v.vehicle)
          if (item) {
            v.vehicleText = item.carNum+ '---' + item.mark
          }
          return v
        })
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
        this.$refs.dialog.updateType = row.inventoryType
        this.$refs.dialog.activeName = row.inventoryType.toString()
        let cloneRow = deepClone(row)
        this.$refs.dialog.edit(cloneRow)
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
      // this.getDefaultAddress()
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
        inventoryApi.delete({
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
    this.getCars()
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
</style>
<style lang="scss">

  .view-container{
    border-left: 1px solid #cbcbcb;
    width: 280px;
    height: 180px;
  }
</style>
