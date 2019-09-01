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
          <el-select v-model="searchForm.addressType" placeholder="用户类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="餐厅" value="1" />
            <el-option label="学校" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="isDefault" clearable>
          <el-select v-model="searchForm.isDefault" placeholder="是否默认地址">
            <el-option label="全部" value="" />
            <el-option label="默认" value="1" />
            <el-option label="非默认" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="saveDate">
          <el-date-picker
            v-model="searchForm.saveDate"
            type="daterange"
            align="center"
            start-placeholder="添加日期起"
            end-placeholder="添加日期止"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
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
      :count="count"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      @change-page="pageChange"
      @size-change="sizeChange"
    />
    <el-dialog
      width="600px"
      title="地址信息编辑"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
      <el-form ref="addressForm" :model="addressForm" label-width="120px" :rules="rules">
        <el-form-item :label="addressForm.addressType?'联系人':'班级'" prop="consignee">
          <el-input v-model="addressForm.consignee" suffix-icon="el-icon-user" maxLength="15" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addressForm.mobile" suffix-icon="el-icon-mobile" maxLength="11" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address" v-if="addressForm.addressType">
          <el-input v-model="addressForm.address" suffix-icon="el-icon-location" maxLength="40"
                    type="textarea" :rows="2"/>
        </el-form-item>
        <el-form-item label="学校" prop="schoolId" v-else>
          <el-select v-model="addressForm.schoolId" suffix-icon="el-icon-location">
            <el-option
              v-for="option in schoolOptions"
              :key="option.schoolId"
              :value="option.schoolId"
              :label="option.schoolName+'————'+option.address"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="submitForm">提交</el-button>
        <el-button @click="resetForm('addressForm')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addressApi from '../../api/address'
import schoolApi from '../../api/school'
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
          width: 180,
          showOverflowTooltip: true
        },
        { label: '联系人/班级', prop: 'consignee', width: 120 },
        { label: '手机号', prop: 'mobile', width: 150 },
        { label: '类型', prop: 'addressType', width: 100,
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
        { label: '详细地址 / 学校', prop: 'address', align: 'left', width: 160,
          formatter: row => row.schoolName || row.address },
        { label: '是否默认', prop: 'isDefault',
          render: (h, { props: { row }}) => {
            return (
              <div class='is-default-icon'>
                <i class={'el-icon-' + (row.isDefault ? 'success' : 'error')}/>
              </div>
            )
          }
        },
        { label: '添加时间', prop: 'saveDate', sortable: true, width: 180 },
        { label: '操作', prop: 'region', minWidth: 100,
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.edit(row)}>编辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delete(row)}>删除</span>
              </div>
            )
          }
        }
      ],
      loading: false,
      submitLoading: false,
      editVisible: false,
      searchForm: {
        username: '',
        consignee: '',
        mobile: '',
        addressType: null,
        isDefault: null,
        saveDate: ''
      },
      addressForm: {
        consignee: '',
        addressType: '',
        mobile: '',
        address: ''
      },
      rules: {
        consignee: [
          { required: true, message: '请输入姓名' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符' }
        ],
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^(1[0-9])\d{9}$/,
            message: '请输入符合要求的11位手机号' }
        ],
        address: [
          { required: true, message: '请输入地址' }
        ],
        schoolId: [
          { required: true, message: '请选择学校' }
        ]
      },
      schoolOptions: []
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.getSchool()
  },
  methods: {
    fetchData() {
      let seachParams = {}
      const { saveDate } = this.searchForm
      if (saveDate.length === 2) {
        const [startDate, endDate] = this.searchForm.saveDate
        seachParams = {
          startDate: startDate,
          endDate: endDate
        }
      }
      this.loading = true
      addressApi.getAddress({
        ...seachParams,
        ...this.searchForm,
        ...this.pageOption
      }).then(res => {
        this.addressData = res.list
        this.count = res.count
      }).finally(_ => {
        this.loading = false
      })
    },
    edit(row) {
      this.addressForm = deepClone(row)
      this.editVisible = true
    },
    getSchool() {
      schoolApi.getSchool({
        pageIndex: 1,
        pageSize: 300
      }).then(res => {
        this.schoolOptions = res.list
      })
    },
    delete(row) {
      this.$confirm('此操作将删除该地址信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        addressApi.deleteAddress({
          addressId: row.addressId
        }).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    close() {
      this.editVisible = false
      this.resetForm('addressForm')
    },
    submitForm() {
      this.$refs.addressForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          addressApi.updateAddress(this.addressForm).then(res => {
            this.$message1000('提交成功', 'success')
            this.close()
            this.fetchData()
          }).finally(() => {
            this.submitLoading = false
          })
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
  /deep/ .el-select{
    width: 100%;
  }
</style>
