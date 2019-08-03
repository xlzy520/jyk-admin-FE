<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="username">
          <el-input v-model="searchForm.username" maxLength="11" placeholder="昵称" />
        </el-form-item>
        <el-form-item prop="consignee">
          <el-input v-model="searchForm.consignee" maxLength="11" placeholder="联系人" />
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="searchForm.mobile" maxLength="11" placeholder="手机号" />
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="searchForm.type" placeholder="请选择用户类型">
            <el-option label="全部" value="all" />
            <el-option label="餐厅" value="restaurant" />
            <el-option label="学校" value="school" />
          </el-select>
        </el-form-item>
        <el-form-item prop="isDefault">
          <el-select v-model="searchForm.isDefault" placeholder="是否默认地址">
            <el-option label="全部" value="all" />
            <el-option label="默认" value="1" />
            <el-option label="非默认" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="saveDate">
          <el-date-picker
            v-model="searchForm.saveDate"
            type="daterange"
            align="center"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item prop="modifyDate">
          <el-date-picker
            v-model="searchForm.modifyDate"
            type="daterange"
            align="center"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="fetchData"
          >查询</el-button>
          <el-button type="info" @click="resetForm('searchForm')">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <xl-table
      ref="addressTable"
      v-loading="loading"
      :index="true"
      :table-data="addressData"
      :table-columns="columns"
      :total="total"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      @change-page="pageChange"
      @size-change="sizeChange"
    />
    <el-dialog
      width="40%"
      title="地址信息编辑"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
      <el-form ref="dialogForm" :model="addressForm" label-width="80px" :rules="rules">
        <el-form-item label="联系人" prop="consignee">
          <el-input v-model="addressForm.consignee" suffix-icon="el-icon-user" maxLength="15" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addressForm.mobile" suffix-icon="el-icon-mobile" maxLength="11" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input
            v-model="addressForm.address"
            suffix-icon="el-icon-location"
            maxLength="40"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
        <el-form-item label="地址类型" prop="addressType">
          <el-radio-group v-model.number="addressForm.addressType">
            <el-radio label="1" border>餐厅</el-radio>
            <el-radio label="0" border>学校</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm('dialogForm')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addressApi from '../../api/address'
import { deepClone } from '../../utils/index'
import pagination from '../../mixins/pagination'

export default {
  consignee: 'Address',
  mixins: [pagination],
  data() {
    return {
      addressData: [],
      columns: [
        {
          label: '昵称',
          prop: 'username',
          align: 'center',
          width: 180,
          showOverflowTooltip: true
        },
        { label: '联系人', prop: 'consignee', align: 'center', width: 100 },
        { label: '手机号', prop: 'mobile', align: 'center', width: 110 },
        { label: '类型', prop: 'addressType', align: 'center', width: 80,
          render: (h, { props: { row }}) => {
            if (row.addressType === 0) {
              return (
                <el-tag type={'danger'}>学校</el-tag>
              )
            }
            return (
              <el-tag type={'primary'}>餐厅</el-tag>
            )
          }
        },
        { label: '详细地址 / 学校', prop: 'address', align: 'center', width: 160,
          formatter: row => row.address || row.schoolName },
        { label: '是否默认', prop: 'isDefault', align: 'center', width: 80,
          render: (h, { props: { row }}) => {
            return (
              <div class='is-default-icon'>
                <i class={'el-icon-' + (row.isDefault ? 'success' : 'error')}/>
              </div>
            )
          }
        },
        { label: '添加时间', prop: 'saveDate', align: 'center' },
        { label: '更新时间', prop: 'modifyDate', align: 'center' },
        { label: '操作', prop: 'region', align: 'center', minWidth: 100,
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.edit(row)}>编辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delete(row.id)}>删除</span>
              </div>
            )
          }
        }
      ],
      loading: false,

      editVisible: false,
      searchForm: {
        username: '',
        consignee: '',
        mobile: '',
        addressType: '',
        isDefault: '',
        saveDate: '',
        modifyDate: ''
      },
      addressForm: {
        consignee: '',
        addressType: '',
        mobile: '',
        address: ''
      },
      rules: {
        consignee: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        addressType: [
          { required: true, message: '请选择一个类型', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请填写符合要求的11位手机号', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请填写地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      addressApi.getAddress({
        ...this.searchForm,
        ...this.pageOption
      }).then(res => {
        this.addressData = res.list
        this.total = res.total
      }).finally(_ => {
        this.loading = false
      })
    },
    edit(row) {
      this.addressForm = deepClone(row)
      this.editVisible = true
    },
    delete(id) {
      this.$confirm('此操作将删除该地址信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addressApi.deleteAddress(id).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    },
    close() {
      this.editVisible = false
      this.resetForm('dialogForm')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addressApi.updateAddress(this.addressForm).then(res => {
            this.$message1000('提交成功', 'success')
            this.close()
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-tag{
    font-size: 16px;
  }
</style>
