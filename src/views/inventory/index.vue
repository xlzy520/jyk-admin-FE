<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="staff">
          <el-input v-model="searchForm.staff" maxLength="11" placeholder="收款人"/>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="searchForm.mobile" maxLength="11" placeholder="手机号"/>
        </el-form-item>
        <el-form-item prop="payer">
          <el-input v-model="searchForm.payer" maxLength="20" placeholder="商家名称"/>
        </el-form-item>
        <el-form-item prop="amount">
          <el-input v-model="searchForm.amount" maxLength="11" placeholder="金额"/>
        </el-form-item>
        <el-form-item prop="payTime">
          <el-date-picker
            v-model="searchForm.payTime"
            type="daterange"
            align="center"
            start-placeholder="支付时间起"
            end-placeholder="支付时间止"
          />
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
    <xl-table
      ref="inventoryTable"
      v-loading="loading"
      :index="true"
      :table-data="inventoryData"
      :table-columns="columns"
      :total="total"
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
import { deepClone } from '../../utils'
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
        staff: ''
      },
      inventoryData: [],
      columns: [
        {
          label: '地址',
          prop: 'address',
          align: 'left'
        },
        {
          label: '日期',
          prop: 'saveDate',
          align: 'left'
        },
        {
          label: '餐具类型',
          prop: 'inventoryType',
          render: (h, { props: { row }}) => {
            const inventoryMap = {
              '幼儿园': 'danger',
              '小学': 'warning'
            }
            return (
              <el-tag type={inventoryMap[row.inventoryType]}><i class='el-icon-inventory' />{row.inventoryType }</el-tag>
            )
          }
        },
        {
          label: '添加时间',
          prop: 'saveDate',
          sortable: true
        },
        {
          label: '更新时间',
          prop: 'modifyDate',
          sortable: true
        },
        {
          label: '操作',
          prop: 'region',
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

      loading: false,
      isAdd: false,
      visible: false,
    }
  },

  methods: {
    fetchData(data) {
      this.loading = true
      inventoryApi.list({
        ...data,
        ...this.pageOption
      }).then(res => {
        this.inventoryData = res.list
        this.total = res.total
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
      this.inventoryForm = deepClone(row)
      this.visible = true
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
    },
    resetForm(){
      this.$refs.searchForm.resetFields()
    }
  },
  created() {
    this.fetchData()
  },
}
</script>

<style lang="scss" scoped>
  /deep/ .el-tag{
    font-size: 16px;
  }
</style>
