<template>
  <div class="app-container">
    <add-button @add="add" />
    <xl-table
      ref="partnerTable"
      v-loading="loading"
      :index="true"
      :table-data="partnerData"
      :table-columns="columns"
    />
    <el-dialog
      width="40%"
      :title="isAdd?'新增短信通知人' : '更新短信通知人'"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
      <div v-loading="dialogLoading">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
          <el-form-item label="备注：" prop="mark">
            <el-input v-model="form.mark" />
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input v-model="form.mobile" maxLength="11" />
          </el-form-item>
          <el-form-item label="是否通知：" prop="open">
            <el-switch
              v-model="form.open"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              :active-value="true"
              :inactive-value="false"
            />
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
import noticeApi from '../../api/notice'
import { deepClone } from '../../utils'
const initForm = {
  mark: '',
  open: '',
  mobile: ''
}
export default {
  name: 'Partner',
  components: { AddButton },
  data() {
    return {
      partnerData: [],
      columns: [
        { label: '备注', prop: 'mark' },
        { label: '手机号', prop: 'mobile' },
        { label: '是否通知', prop: 'open', render: (h, { props: { row }}) => {
          return (
            <div class='is-default-icon'>
              <i class={'el-icon-' + (row.show ? 'success' : 'error')}/>
            </div>
          )
        } },
        { label: '操作', prop: 'operation', render: (h, { props: { row }}) => {
          return (
            <div class='table-action'>
              <span onClick={() => this.update(row)}>编 辑</span>
              <el-divider direction={'vertical'}/>
              <span onClick={() => this.delete(row)}>删 除</span>
            </div>
          )
        } }
      ],
      loading: false,
      dialogLoading: false,

      isAdd: false,
      editVisible: false,
      form: initForm,
      rules: {
        mark: [
          { required: true, message: '请输入名称' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符' }
        ],
        mobile: [
          this.$rules.required('请输入手机号'),
          this.$rules.phone
        ],
      }
    }
  },
  computed: {

  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      noticeApi.getNotice().then(res => {
        this.partnerData = res
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
    delete(row) {
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        noticeApi.deleteNotice({
          noticeMobileId: row.noticeMobileId
        }).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    },
    close() {
      this.editVisible = false
      this.form = initForm
      this.resetForm()
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogLoading = true
          const service = this.isAdd ? noticeApi.addNotice : noticeApi.updateNotice
          service(this.form).then(() => {
            this.dialogLoading = false
            this.close()
            this.fetchData()
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
