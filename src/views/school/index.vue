<template>
  <div class="app-container">
    <xl-table
      ref="schoolTable"
      :index="true"
      :loading="loading"
      :table-data="schoolData"
      :table-columns="columns"
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
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="schoolForm.name" suffix-icon="el-icon-school" maxLength="30" />
        </el-form-item>
        <el-form-item label="学校类型" prop="type">
          <el-select v-model="schoolForm.type" placeholder="请选择学校类型">
            <el-option label="幼儿园" value="0" />
            <el-option label="小学" value="1" />
            <el-option label="中学" value="2" />
          </el-select>
          <el-input v-model="schoolForm.name" />
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

export default {
  name: 'School',
  components: { AddButton },
  data() {
    return {
      schoolData: [],
      columns: [
        {
          label: '学校名称',
          prop: 'name',
          align: 'center'
        },
        {
          label: '学校类型',
          prop: 'type',
          align: 'center',
          render: (h, { props: { row }}) => {
            const map = ['幼儿园', '小学', '中学']
            const typeName = map[row.type]
            return (
              <el-tag type='success' style='background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);'><i class='el-icon-school' />{typeName }</el-tag>
            )
          }
        },
        {
          label: '添加时间',
          prop: 'addTime',
          align: 'center'
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          align: 'center'
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
                <span onClick={() => this.delete(row.id)}>删除</span>
              </div>
            )
          }
        }
      ],
      loading: false,
      isAdd: false,
      editVisible: false,
      schoolForm: {
        name: '',
        type: '2'
      },
      pageOption: {
        pageIndex: 1,
        pageSize: 100
      },
      rules: {
        name: [
          { required: true, message: '请输入学校名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择一个学校类型', trigger: 'change' }
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
      // resetFields()会将form中的数据更改
      this.editVisible = true
    },
    delete(id) {
      this.$confirm('此操作将删除该学校信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        schoolApi.deleteSchool(id).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    },
    close() {
      this.editVisible = false
      this.schoolForm = {
        name: ''
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          schoolApi.updateSchool(this.schoolForm).then(res => {
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
