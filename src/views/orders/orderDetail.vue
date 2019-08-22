<template>
  <el-dialog
    width="40%"
    :title="isAdd?'新增商品' : '编辑商品'"
    :close-on-click-modal="true"
    :visible.sync="editVisible"
    @close="close"
  >
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="名称：" prop="name">
        <el-input v-model.trim="form.name" maxLength="20" />
      </el-form-item>
      <el-form-item label="宣传图" prop="img">
        <el-upload
          ref="upload"
          action="/file/add"
          :on-remove="removeImg"
          :on-success="uploadOk"
          :on-error="onError"
          :file-list="fileList"
          :auto-upload="true"
          list-type="picture-card"
          accept="['.png','.jpg']"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item label="库存：" prop="stores">
        <el-input v-model.number="form.stores" maxLength="10" />
      </el-form-item>
      <el-form-item label="状态：" prop="statusName">
        <el-switch
          v-model="form.statusName"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="上架"
          inactive-text="下架"
        />
      </el-form-item>
      <el-form-item label="价格：" prop="price">
        <el-input v-model="form.price" maxLength="10" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import guigeApi from '../../api/guige'
import goodsApi from '../../api/goods'


export default {
  name: 'orderDetail',
  props: {
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  data() {

    return {
      submitLoading: false,
      form: initFormData,
      dialogVisible: false,
      rules: {
        goodsName: [
          this.$rules.required('请输入商品名称'),
          this.$rules.word_number_chinese
        ],
        priceStr: [
          this.$rules.required('请输入商品价格'),
          this.$rules.float,
          this.$rules.float5
        ],
        useTypeId: [
          this.$rules.required('请输入商品类型')
        ],
        img: [
          { validator: validateImg }
        ]
      },
      specsList: [],
      fileList: [],
      imgUrl: '',
      useType: []
    }
  },
  mounted() {
    if (this.isAdd) {
      this.getUseTypeList()
    }
  },
  methods: {
    typeChange(val) {
      const index = this.useType.findIndex(v => v.useTypeId === val)
      if (index > 0) {
        this.specsList = this.useType[index].specsList
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        console.log(2)
        if (valid) {
          this.submitLoading = true
          const baseRequest = this.isAdd ? goodsApi.addGoods : goodsApi.updateGoods
          baseRequest(this.form).then(_ => {
            this.$message1000(this.isAdd ? '新增成功' : '更新成功', 'success')
            this.fetchData()
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          return false
        }
      })
    },
    hideUpload(display) {
      setTimeout(() => {
        this.$refs.upload.$refs['upload-inner'].$el.style.display = display ? '' : 'none'
      }, 0)
    },
    uploadOk(res) {
      console.log(res)
      const { success, msg, data } = res
      if (success) {
        this.$message1000('图片上传成功', 'success')
        this.form.img = data.imgUrl
      } else {
        this.$message1000(msg, 'error')
        this.fileList = []
      }
    },
    onError() {
      this.$message1000('文件上传出错：网络错误', 'error')
    },
    removeImg() {
      this.form.img = []
    },
    handleSuccess(res, file, fileList) {
      console.log(res)
      this.form.fileUrls.push(res.data)
    },
    handlePictureCardPreview(file) {
      this.imgUrl = file.url
      this.dialogVisible = true
    },
    close() {
      this.fileList = []
      this.form = initFormData
      this.$emit('close')
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    getUseTypeList() {
      guigeApi.getUseTypeList().then(res => {
        this.useType = res
      })
    }
  }
}
</script>

<style scoped>

</style>
