<template>
  <div class="app-container">
    <xl-table
      ref="schoolTable"
      v-loading="loading"
      :index="true"
      :table-data="schoolData"
      :table-columns="columns"
      :total="total"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      @change-page="pageChange"
      @size-change="sizeChange"
    />
    <add-button @add="add" />
    <el-dialog
      width="40%"
      :title="isAdd?'增加学校信息' : '更新学校信息'"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
      <el-form ref="form" :model="schoolForm" label-width="80px" :rules="rules">
        <el-form-item label="学校名称" prop="schoolName">
          <el-input v-model="schoolForm.schoolName" suffix-icon="el-icon-school" maxLength="30" />
        </el-form-item>
        <el-form-item label="学校地址" prop="address">
          <el-input v-model="schoolForm.address" suffix-icon="el-icon-address" maxLength="60" />
        </el-form-item>
        <el-form-item label="学校类型" prop="schoolType">
          <el-select v-model="schoolForm.schoolType" placeholder="请选择学校类型">
            <el-option label="幼儿园" value="幼儿园" />
            <el-option label="小学" value="小学" />
            <el-option label="中学" value="中学" />
          </el-select>
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
import schoolApi from '../../api/school'
import { deepClone } from '../../utils/index'
import pagination from '../../mixins/pagination'

export default {
  name: 'School',
  components: { AddButton },
  mixins: [pagination],
  data() {
    return {
      schoolData: [],
      columns: [
        {
          label: '学校名称',
          prop: 'schoolName',
          align: 'center'
        },
        {
          label: '学校地址',
          prop: 'address',
          align: 'left'
        },
        {
          label: '学校类型',
          prop: 'schoolType',
          align: 'center',
          render: (h, { props: { row }}) => {
            const schoolMap = {
              '幼儿园': 'danger',
              '小学': 'warning'
            }
            return (
              <el-tag type={schoolMap[row.schoolType]}><i class='el-icon-school' />{row.schoolType }</el-tag>
            )
          }
        },
        {
          label: '添加时间',
          prop: 'saveDate',
          align: 'center',
          sortable: true
        },
        {
          label: '更新时间',
          prop: 'modifyDate',
          align: 'center',
          sortable: true
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
                <span onClick={() => this.delete(row.schoolId)}>删除</span>
              </div>
            )
          }
        }
      ],
      loading: false,
      isAdd: false,
      editVisible: false,
      schoolForm: {
        schoolName: '',
        address: '',
        schoolType: ''
      },
      rules: {
        schoolName: [
          { required: true, message: '请输入学校名称' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符' }
        ],
        address: [
          { required: true, message: '请输入学校地址' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符' }
        ],
        schoolType: [
          { required: true, message: '请选择一个学校类型' }
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
      schoolApi.getSchool(this.pageOption).then(res => {
        this.schoolData = res.list
        this.total = res.total
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
      this.schoolForm = deepClone(row)
      this.editVisible = true
    },
    delete(id) {
      this.$confirm('此操作将删除该学校信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        schoolApi.deleteSchool({
          schoolId: id
        }).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    },
    close() {
      this.editVisible = false
      this.resetForm()
    },
    submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const param = {
            ...this.schoolForm,
            ...this.pageOption
          }
          const getFn = this.isAdd ? schoolApi.addSchool(param) : schoolApi.updateSchool(param)
          getFn.then(res => {
            this.$message1000('提交成功', 'success')
            this.close()
            this.fetchData()
          })
        } else {
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
