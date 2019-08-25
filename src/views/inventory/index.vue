<template>
  <div class="app-container">
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
    <el-dialog
      width="40%"
      :title="isAdd?'增加学校信息' : '更新学校信息'"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
      <el-form ref="form" :model="inventoryForm" label-width="80px" :rules="rules">
        <el-form-item label="学校名称" prop="inventoryName">
          <el-input v-model="inventoryForm.inventoryName" suffix-icon="el-icon-inventory" maxLength="30" />
        </el-form-item>
        <el-form-item label="学校地址" prop="address">
          <el-input v-model="inventoryForm.address" suffix-icon="el-icon-address" maxLength="60" />
        </el-form-item>
        <el-form-item label="学校类型" prop="inventoryType">
          <el-select v-model="inventoryForm.inventoryType" placeholder="请选择学校类型">
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
import inventoryApi from '../../api/inventory'
import { deepClone } from '../../utils'
import pagination from '../../mixins/pagination'

export default {
  name: 'School',
  components: { AddButton },
  mixins: [pagination],
  data() {
    return {
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
      editVisible: false,
      inventoryForm: {
        inventoryName: '',
        address: '',
        inventoryType: ''
      },
      rules: {
        inventoryName: [
          { required: true, message: '请输入学校名称' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符' }
        ],
        address: [
          { required: true, message: '请输入学校地址' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符' }
        ],
        inventoryType: [
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
      inventoryApi.list(this.pageOption).then(res => {
        this.inventoryData = res.list
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
      this.inventoryForm = deepClone(row)
      this.editVisible = true
    },
    delete(id) {
      this.$confirm('此操作将删除该学校信息, 是否继续?', '提示', {
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
      this.editVisible = false
      this.resetForm()
    },
    submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const param = {
            ...this.inventoryForm,
            ...this.pageOption
          }
          const getFn = this.isAdd ? inventoryApi.addSchool(param) : inventoryApi.updateSchool(param)
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
