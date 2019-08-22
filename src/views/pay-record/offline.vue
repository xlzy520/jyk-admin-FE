<template>
  <div class="app-container">
    <add-button @add="add" />
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="staff">
          <el-input v-model="searchForm.staff" maxLength="11" placeholder="收款人"/>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="searchForm.mobile" maxLength="11" placeholder="手机号"/>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="searchForm.name" maxLength="20" placeholder="商家名称"/>
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
      ref="payTable"
      :index="true"
      :loading="loading"
      :table-data="payData"
      :table-columns="columns"
    />
    <el-dialog
      width="40%"
      :title="isAdd?'新增线下支付信息' : '线下支付信息更新'"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="商家名称:" prop="name">
          <el-input v-model="form.name" maxLength="11" />
        </el-form-item>
        <el-form-item label="商家地址:" prop="address">
          <el-input v-model="form.address" maxLength="11" />
        </el-form-item>
        <el-form-item label="金额:" prop="amount">
          <el-input v-model="form.amount" maxLength="11" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddButton from '../../components/AddButton'
import payApi from '../../api/pay'
import { deepClone } from '../../utils/index'
import pagination from '../../mixins/pagination'

export default {
  name: 'Offline',
  components: { AddButton },
  mixins: [pagination],
  data() {
    return {
      payData: [],
      columns: [
        { label: '商家名称', prop: 'name' },
        { label: '商家地址', prop: 'address' },
        { label: '金额', prop: 'amount', sortable: true },
        { label: '收款人', prop: 'staffName' },
        { label: '支付时间', prop: 'payTime', sortable: true },
        { label: '更新时间', prop: 'saveDate', sortable: true },
        { label: '操作',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.update(row)}>编辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delete(row.id)}>删除</span>
              </div>
            )
          } }
      ],
      loading: false,
      editVisible: false,
      searchForm: {
        name: '',
        mobile: '',
        amount: '',
        payTime: '',
        staff: ''
      },
      form: {
        name: '',
        address: '',
        amount: '',
        payTime: '',
        saveDate: '',
        staff: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(data) {
      this.loading = true
      payApi.getPayOffline({
        ...data,
        ...this.pageOption
      }).then(res => {
        this.payData = res.list
      }).finally(_ => {
        this.loading = false
      })
    },
    add() {
      this.isAdd = true
      this.editVisible = true
    },
    update(row) {
      this.isAdd = false
      this.form = deepClone(row)
      this.editVisible = true
    },
    delete(id) {
      this.$confirm('此操作将删除该支付记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        payApi.deletePartner(id).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    },
    close() {
      this.form = {
        name: '',
        address: '',
        amount: '',
        payTime: '',
        saveDate: ''
      }
    },
    submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.fetchData(this.searchForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
