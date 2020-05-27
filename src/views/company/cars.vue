<template>
  <div class="app-container">
    <add-button @add="add" />
    <xl-table
      ref="userListTable"
      v-loading="loading"
      :index="true"
      :table-data="carData"
      :table-columns="columns"
    />
    <el-dialog
        :title="isAdd?'新增车辆信息' : '车辆信息更新'"
        :close-on-click-modal="true"
        :visible.sync="visible"
        @close="close"
    >
      <el-form ref="form" :model="carFormData" label-width="80px" :rules="rules">
        <el-form-item label="车牌号" prop="carNum">
          <el-input v-model="carFormData.carNum" />
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input v-model="carFormData.mark" />
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
import carApi from '../../api/cars'
import pagination from '../../mixins/pagination'
import AddButton from "../../components/AddButton";
import {deepClone} from "../../utils";

export default {
  name: 'UserList',
  mixins: [pagination],
  components: { AddButton },
  data() {
    return {
      isAdd: true,
      carFormData: {
        carNum: '',
        mark: '',
      },
      rules: {
        carNum: [
          this.$rules.required('请输入车牌号'),
        ],
      },
      submitLoading: false,
      visible: false,
      carData: [],
      columns: [
        {label: '车牌号', prop: 'carNum'},
        {label: '备注', prop: 'mark'},
        {label: '操作', render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.edit(row)} >编辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delete(row.carId)}>删除</span>
              </div>
            )
          }},
      ],
      loading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    add() {
      this.isAdd = true
      this.visible = true
    },
    close() {
      this.$refs.form.resetFields()
      this.carFormData = {}
      this.visible = false
      this.submitLoading = false
    },
    delete(id) {
      this.$confirm('此操作将删除该学校信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        carApi.deleteCar({
          carId: id
        }).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        }).catch(() => {
          this.loading = false
        })
      })
    },

    fetchData(search) {
      this.loading = true
      carApi.getCar().then(res => {
        if (search) {
          this.$message1000('请求成功')
        }
        this.carData = res
      }).finally(_ => {
        this.loading = false
      })
    },
    edit(row){
      this.isAdd = false
      this.carFormData = deepClone(row)
      this.visible = true
    },
    deleteRow(row){
      this.$confirm(`此操作将删除该条数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        carApi.deleteCar({
          carId: row.carId,
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
          const result = this.isAdd ? carApi.addCar : carApi.updateCar
          const text = this.isAdd ? '新增成功': '更新成功'
          result(this.carFormData).then(res => {
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
