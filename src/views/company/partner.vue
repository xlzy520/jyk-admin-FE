<template>
  <div class="app-container">
    <add-button @add="add" />
    <xl-table
      ref="partnerTable"
      v-loading="loading"
      :index="true"
      :table-data="partnerData"
      :table-columns="columns"
      :total="total"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      @change-page="pageChange"
      @size-change="sizeChange"
    />
    <el-dialog
      width="40%"
      :title="isAdd?'新增合作伙伴' : '合作伙伴信息更新'"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="名称：" prop="partnersName">
          <el-input v-model="form.partnersName" />
        </el-form-item>
        <el-form-item label="宣传图" prop="fileUrl">
          <el-upload
            v-loading="uploadLoading"
            list-type="picture-card"
            class="img-uploader"
            action="market/file/add"
            :on-error="onError"
            :on-preview="handlePreview"
            accept="['.png','.jpg']"
            :before-upload="beforeUpload"
            :on-success="uploadOk"
          >
            <img
              v-if="form.fileUrl"
              :src="'https://axjieyakang.com/assets/'+form.fileUrl"
              class="img"
              fit="cover"
            >
            <i v-else class="el-icon-plus img-uploader-icon" />
          </el-upload>
          <el-dialog :visible.sync="imgVisible" append-to-body>
            <el-image :src="'https://axjieyakang.com/assets/'+form.fileUrl" alt="" fit="fit" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="是否展示：" prop="display">
          <el-switch
            v-model="form.display"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="展示"
            inactive-text="隐藏"
            active-value="1"
            inactive-value="0"
          />
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
import partnerApi from '../../api/partner'
import { deepClone } from '../../utils'
import pagination from '../../mixins/pagination'

export default {
  name: 'Partner',
  components: { AddButton },
  mixins: [pagination],
  data() {
    return {
      partnerData: [],
      columns: [
        { label: '名称', prop: 'partnersName' },
        { label: '宣传图', prop: 'fileUrl', render: (h, { props: { row }}) => {
          return (
            <div class='table-img'>
              <el-image src={'https://axjieyakang.com/assets/' + row.fileUrl} fit='fit'/>
            </div>
          )
        } },
        { label: '是否展示', prop: 'show', render: (h, { props: { row }}) => {
          return (
            <div class='is-default-icon'>
              <i class={'el-icon-' + (row.show ? 'success' : 'error')}/>
            </div>
          )
        } },
        { label: '添加时间', prop: 'saveDate' },
        { label: '更新时间', prop: 'modifyDate' },
        { label: '操作', prop: 'operation', render: (h, { props: { row }}) => {
          return (
            <div class='table-action'>
              <span onClick={() => this.update(row)}>编 辑</span>
              <el-divider direction={'vertical'}/>
              <span onClick={() => this.delete(row.partnersId)}>删 除</span>
            </div>
          )
        } }
      ],
      loading: false,
      uploadLoading: false,

      isAdd: false,
      editVisible: false,
      imgVisible: false,
      form: {
        partnersName: '',
        show: '',
        fileUrl: ''
      },
      rules: {
        partnersName: [
          { required: true, message: '请输入名称' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符' }
        ],
        fileUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    url() {
      return this.add ? 'add' : 'update'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    beforeUpload(file) {
      this.uploadLoading = true
    },
    onError(err, file, fileList) {
      this.uploadLoading = false
      this.$message1000('文件上传出错：网络错误', 'error')
    },
    uploadOk(res) {
      const { success, msg, data } = res
      if (success) {
        this.$message1000('图片上传成功', 'success')
        this.form.fileUrl = data
      } else {
        this.$message1000(msg, 'error')
      }
      this.uploadLoading = false
    },
    handlePreview(file) {
      this.imgVisible = true
    },
    fetchData() {
      this.loading = true
      partnerApi.getPartner(this.pageOption).then(res => {
        this.partnerData = res.list
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
      this.form = deepClone(row)
      this.editVisible = true
    },
    delete(id) {
      this.$confirm('此操作将删除该合作伙伴, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        partnerApi.deletePartner({
          partnersId: id
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
          this.loading = true
          const service = this.isAdd ? partnerApi.addPartner : partnerApi.updatePartner
          service(this.form).then(() => {
            this.loading = false
            this.close()
            this.fetchData()
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.form.fileUrl = ''
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .img-uploader{
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
  }
  .img-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .img-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .img {
    width: 178px;
    height: 178px;
    display: block;
  }
  /deep/ .table-img{
    width: 100px;
  }
</style>
