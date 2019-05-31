<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item label="昵称:" prop="nickname">
          <el-input v-model="searchForm.nickname" maxLength="11" />
        </el-form-item>
        <el-form-item label="联系人:" prop="name">
          <el-input v-model="searchForm.name" maxLength="11" />
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="searchForm.phone" maxLength="11" />
        </el-form-item>
        <el-form-item label="用户类型:" prop="type">
          <el-select v-model="addressForm.type" placeholder="请选择用户类型">
            <el-option label="全部" value="" />
            <el-option label="餐厅" value="restaurant" />
            <el-option label="学校" value="school" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否默认:" prop="isDefault">
          <el-switch v-model="searchForm.isDefault" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="添加时间:" prop="addTime">
          <el-date-picker
            v-model="searchForm.addTime"
            type="daterange"
            align="center"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="更新时间:" prop="updateTime">
          <el-date-picker
            v-model="searchForm.updateTime"
            type="daterange"
            align="center"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
    <base-table
      ref="addressTable"
      :index="true"
      :loading="loading"
      :table-data="addressData"
      :table-columns="columns"
    />
    <el-dialog
      width="40%"
      title="地址信息编辑"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
      <el-form ref="form" :model="addressForm" label-width="80px" :rules="rules">
        <el-form-item label="联系人" prop="name">
          <el-input v-model="addressForm.name" suffix-icon="el-icon-user" maxLength="15" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addressForm.phone" suffix-icon="el-icon-phone" maxLength="11" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addressForm.address" suffix-icon="el-icon-location" maxLength="40" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="用户类型" prop="type">
          <el-radio-group v-model="addressForm.type">
            <el-radio label="restaurant" border>餐厅</el-radio>
            <el-radio label="school" border>学校</el-radio>
          </el-radio-group>
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
import BaseTable from '../../components/baseTable'
import addressApi from '../../api/address'
import { deepClone } from '../../utils/index'

export default {
  name: 'Address',
  components: { BaseTable },
  data() {
    return {
      addressData: [],
      columns: [
        {
          label: '昵称',
          prop: 'nickname',
          align: 'center',
          width: 120
        },
        { label: '联系人', prop: 'name', align: 'center', width: 100 },
        { label: '手机号', prop: 'phone', align: 'center', width: 110, formatter: (row) => row.phone.toString() },
        { label: '类型', prop: 'type', align: 'center', width: 80,
          filters: [{ text: '学校', value: 'school' }, { text: '餐厅', value: 'restaurant' }],
          filterMethod: (value, row) => row.type === value,
          filterPlacement: 'bottom-end',
          render: (h, { props: { row }}) => {
            if (row.type === 'school') {
              return (
                <el-tag type={'danger'}>学校</el-tag>
              )
            }
            return (
              <el-tag type={'primary'}>餐厅</el-tag>
            )
          }
        },
        { label: '详细地址', prop: 'address', align: 'center', minWidth: 180 },
        { label: '是否默认', prop: 'isDefault', align: 'center', width: 80,
          render: (h, { props: { row }}) => {
            return (
              <div class='is-default-icon'>
                <i class={'el-icon-' + (row.isDefault ? 'success' : 'error')}/>
              </div>
            )
          }
        },
        { label: '添加时间', prop: 'addTime', align: 'center', minWidth: 80 },
        { label: '更新时间', prop: 'updateTime', align: 'center', minWidth: 80 },
        { label: '操作', prop: 'region', align: 'center', minWidth: 120,
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
      editVisible: false,
      searchForm: {
        nickname: '',
        name: '',
        phone: '',
        type: '',
        isDefault: '',
        addTime: '',
        updateTime: ''
        // TODO 格式化时间
      },
      addressForm: {
        name: '',
        type: '',
        phone: '',
        address: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择一个类型', trigger: 'change' }
        ],
        phone: [
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
    fetchData(data) {
      this.loading = true
      addressApi.getAddress(data).then(res => {
        this.addressData = res.list
      }).finally(_ => {
        this.loading = false
      })
    },
    update(row) {
      this.addressForm = deepClone(row)
      // resetFields()会将form中的数据更改
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
      this.addressForm = {
        name: '',
        roles: '',
        phone: '',
        password: '',
        region: ''
      }
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
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-tag{
    font-size: 16px;
  }
</style>
