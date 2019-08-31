<template>
  <div class="app-container">
    <add-button @add="add" />
    <xl-table
      ref="partnerTable"
      v-loading="loading"
      :index="true"
      :table-data="partnerData"
      :table-columns="columns"
      :count="count"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      @change-page="pageChange"
      @size-change="sizeChange"
    />
    <el-dialog
      width="40%"
      :title="isAdd?'新增合作伙伴' : '更新合作伙伴信息'"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
      <div v-loading="dialogLoading">
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
              accept="['.png','.jpg']"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="uploadOk"
            >
              <img v-if="form.fileUrl" :src="$baseImgUrl+form.fileUrl" class="img" fit="cover">
              <i v-else class="el-icon-plus img-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="是否展示：" prop="show">
            <el-switch
              v-model="form.show"
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
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddButton from '../../components/AddButton'
import partnerApi from '../../api/partner'
import { deepClone } from '../../utils'
import pagination from '../../mixins/pagination'
const initForm = {
  partnersName: '',
  show: '',
  fileUrl: ''
}
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
            <el-image src={this.$baseImgUrl + row.fileUrl} fit='fit'
                      previewSrcList={[this.$baseImgUrl + row.fileUrl]}>
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
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
      dialogLoading: false,
      uploadLoading: false,

      isAdd: false,
      editVisible: false,
      form: initForm,
      rules: {
        partnersName: [
          { required: true, message: '请输入名称' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符' }
        ],
        fileUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ]
      },
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ]
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
    fetchData() {
      this.loading = true
      partnerApi.getPartner(this.pageOption).then(res => {
        this.partnerData = res.list
        this.count = res.count
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
      this.form = initForm
      this.resetForm()
    },
    submitForm() {
      console.log(this.form);
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogLoading = true
          const service = this.isAdd ? partnerApi.addPartner : partnerApi.updatePartner
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
    .el-upload--picture-card{
      width: 200px;
      height: 150px;
    }
  }
  .img-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .img {
    width: 200px;
    height: 150px;
    display: block;
  }
</style>
