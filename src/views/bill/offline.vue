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
      ref="payTable"
      :index="true"
      :loading="loading"
      :table-data="payData"
      :table-columns="columns"
    />
    <el-dialog
      :width="width"
      :title="isAdd?'新增线下支付信息' : '线下支付信息更新'"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
     <div v-loading="dialogLoading">
       <el-form ref="form" :model="form" label-width="100px" :rules="rules">
         <el-form-item label="名称:" prop="payer">
           <el-input v-model="form.payer" maxLength="11" />
         </el-form-item>
         <el-form-item label="手机号:" prop="mobile">
           <el-input v-model="form.mobile" maxLength="11" />
         </el-form-item>
         <el-form-item label="地址:" prop="address">
           <el-input v-model="form.address" maxLength="11" />
         </el-form-item>
         <el-form-item label="数量:" prop="amount">
           <el-input v-model="form.amount" maxLength="11" />
         </el-form-item>
         <el-form-item label="金额:" prop="amount">
           <el-input v-model="form.amount" maxLength="11" />
         </el-form-item>
       </el-form>
       <div class="dialog-footer">
         <el-button type="primary" @click="submitForm">提交</el-button>
         <el-button @click="resetForm">重置</el-button>
       </div>
     </div>
    </el-dialog>
  </div>
</template>

<script>
import AddButton from '../../components/AddButton'
import payApi from '../../api/bill'
import { deepClone } from '../../utils/index'
import pagination from '../../mixins/pagination'

export default {
  payer: 'Offline',
  components: { AddButton },
  mixins: [pagination],
  data() {
    return {
      payData: [],
      columns: [
        { label: '名称', prop: 'payer' },
        { label: '手机号', prop: 'mobile' },
        { label: '地址', prop: 'address' },
        { label: '数量', prop: 'num', sortable: true },
        { label: '收款金额', prop: 'amount', sortable: true },
        { label: '支付时间', prop: 'payTime', sortable: true },
        { label: '更新时间', prop: 'saveDate', sortable: true },
        { label: '操作',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.update(row)}>编辑</span>
              </div>
            )
          } }
      ],
      dialogLoading: false,
      loading: false,
      editVisible: false,
      searchForm: {
        payer: '',
        mobile: '',
        amount: '',
        payTime: '',
        staff: ''
      },
      form: {
        payer: '',
        mobile: '',
        address: '',
        num: '',
        amount: '',
      },
      isAdd: false,
      rules: {
        payer: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        mobile: [
          this.$rules.required('请输入手机号'),
          this.$rules.phone
        ],
        address: [
          this.$rules.required('请输入地址'),
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        amount: [
          this.$rules.required('请输入金额'),
          this.$rules.float
        ]
      }
    }
  },
  computed:{
    width(){
      if (window.innerWidth< 960) {
        return '80vw'
      }
      return '40%'
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
    close() {
      this.editVisible = false
      this.resetForm()
      this.form = {
        payer: '',
        address: '',
        amount: '',
      }
    },
    submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.dialogLoading = true
          payApi.addPayOffline({
            ...this.form
          }).then(()=>{
            this.close()
            this.$message1000('新增线下支付记录成功', 'success')
            this.dialogLoading = false
            this.fetchData(this.searchForm)
          }).catch(() => {
            this.dialogLoading = false
          })
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
