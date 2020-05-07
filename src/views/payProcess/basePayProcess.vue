<template>
  <div class="app-container">
    <add-button @add="add" />
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item label="所属地址" prop="schoolId">
          <el-select v-model="searchForm.schoolId">
            <el-option label="全部" value="" />
            <el-option label="商家" :value="-9999" />
            <el-option
                v-for="school in schools"
                :key="school.schoolId"
                :value="school.schoolId"
                :label="school.schoolName"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="()=>fetchData(true)"
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
      :table-data="tableData"
      :table-columns="columns"
      @change-page="pageChange"
      @size-change="sizeChange"
    />
    <el-dialog
        :title="isAdd?'新增收费流程与公告' : '更新收费流程与公告'"
        :close-on-click-modal="true"
        :visible.sync="visible"
        @close="close"
    >
      <el-form ref="form" :model="payProcessData" label-width="80px" :rules="rules">
        <el-form-item label="所属地址" prop="schoolId">
          <el-select v-model="payProcessData.schoolId">
            <el-option label="商家" :value="-9999" />
            <el-option
                v-for="school in schools"
                :key="school.schoolId"
                :value="school.schoolId"
                :label="school.schoolName"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="收费流程" prop="payProcessContent">
          <el-input type="textarea"   :autosize="{ minRows: 2, maxRows: 4}" v-model="payProcessData.payProcessContent" />
        </el-form-item>
        <el-form-item label="收费公告" prop="payNotifyContent">
          <el-input type="textarea"   :autosize="{ minRows: 2, maxRows: 4}" v-model="payProcessData.payNotifyContent" />
        </el-form-item>
        <el-form-item label="是否展示" prop="show">
          <el-switch
              v-model="payProcessData.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="展示"
              inactive-text="隐藏"
              :active-value="true"
              :inactive-value="false"
          />
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
import payProcessApi from '../../api/payProcess'
import pagination from '@/mixins/pagination'
import AddButton from "@/components/AddButton";
import {mapGetters} from "vuex";
import schoolApi from "../../api/school";
import { deepClone } from '../../utils/index'


export default {
  name: 'BasePayProcess',
  mixins: [pagination],
  components: { AddButton },
  props: ['type'],
  data() {
    return {
      isAdd: true,
      searchForm: {
        schoolId: ''
      },
      rules: {
        payProcessContent: [
          this.$rules.required('请输入收费流程'),
        ],
        payNotifyContent: [
          this.$rules.required('请输入收费公告'),
        ],
        schoolId: [
          this.$rules.required('请选择学校'),
        ],
      },
      submitLoading: false,
      visible: false,
      schools: [],
      tableData: [],
      payProcessData: {
        show: true
      },

      columns: [
        { label: '所属地址', prop: 'schoolName', render: (h, { props: { row }}) => {
            return (
              <div>
                <el-tag size={'medium'} type={row.schoolId === -9999 ? 'danger' : ''}>
                  {row.schoolId === -9999? '商家' : row.schoolName}</el-tag>
              </div>
            )
          } },

        // {label: '规格种类', prop: 'produceTypeId', formatter: row=> {
        //   return this.typeOptions.find(option => option.value === row.produceTypeId).label
        //   }},
        {label: '收费流程', prop: 'payProcessContent', showOverflowTooltip: true},
        {label: '收费公告', prop: 'payNotifyContent', showOverflowTooltip: true},
        {label: '添加时间', prop: 'saveDate'},
        { label: '是否展示', prop: 'show', render: (h, { props: { row }}) => {
            return (
              <div class='is-default-icon'>
                <i class={'el-icon-' + (row.show ? 'success' : 'error')}/>
              </div>
            )
          } },
        {label: '操作', prop: 'region', minWidth: 100,
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.edit(row)}>编辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.deleteRow(row)}>删除</span>
              </div>
            )
          }
        }
      ],
      loading: false
    }
  },
  created() {
    this.fetchData()
    this.fetchSchoolData()
  },
  computed: {
    ...mapGetters([
      'userData'
    ]),
    hasAuth() {
      return ['super', 'admin'].includes(this.userData.roleCode)
    }
  },
  methods: {
    fetchSchoolData() {
      schoolApi.getSchool({
        pageSize: 1000,
        pageIndex: 1
      }).then(res => {
        this.schools = res.list
      })
    },
    add() {
      this.isAdd = true
      this.visible = true
    },
    close() {
      this.$refs.form.resetFields()
      this.payProcessData = {
        show: true
      }
      this.visible = false
      this.submitLoading = false
    },
    fetchData(search) {
      this.loading = true
      const params = {
        ...this.searchForm,
        ...this.pageOption
      }
      payProcessApi.getPayProcess(params).then(res => {
        if (search) {
          this.$message1000('请求成功')
        }
        this.tableData = res.list
        this.count = res.count
      }).finally(_ => {
        this.loading = false
      })
    },
    edit(row){
      this.isAdd = false
      this.payProcessData = deepClone(row)
      this.visible = true
    },
    deleteRow(row){
      this.$confirm(`此操作将删除该条数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        payProcessApi.deletePayProcess({
          payProcessId: row.payProcessId,
        }).then(() => {
          this.$message1000(`删除成功`, 'success')
          this.fetchData()
        })
      })
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const result = this.isAdd ? payProcessApi.addPayProcess : payProcessApi.updatePayProcess
          const text = this.isAdd ? '新增成功': '更新成功'
          result(this.payProcessData).then(res => {
            this.$message1000(text, 'success')
            this.close()
            this.fetchData()
          }).finally(() => {
            this.submitLoading = false
          })
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
  .table-ext-header{
    display: flex;
    margin-bottom: 10px;
    padding: 0 40px;
    &-item{
      font-weight: bold;
      padding-right: 80px;
      span:last-child{
        margin-right: 20px;
        color: coral;
      }
      &:last-child{
        border: none;
      }
    }
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
