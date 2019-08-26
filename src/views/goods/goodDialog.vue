<template>
  <el-dialog
    width="40%"
    :title="isAdd?'新增商品' : '编辑商品'"
    :close-on-click-modal="true"
    :visible="true"
    @close="close"
  >
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="名称：" prop="goodsName">
        <el-input v-model.trim="form.goodsName" maxLength="20"/>
      </el-form-item>
      <el-form-item label="宣传图" prop="img">
        <el-upload
          ref="upload"
          action="/market/file/add"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="removeImg"
          :on-success="handleSuccess"
          :auto-upload="true"
          accept="['.png','.jpg']"
        >
          <i class="el-icon-plus"/>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="imgUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-switch
          v-model="form.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="上架"
          inactive-text="下架"
        />
      </el-form-item>
      <el-form-item label="商品类型：" prop="useTypeId">
        <el-select v-model="form.useTypeId" @change="typeChange">
          <el-option
            v-for="option in useType"
            :key="option.useType"
            :value="option.useTypeId"
            :label="option.useType"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="specsList.length>0" label="规格详情">
        <el-checkbox-group v-model="form.specsList">
          <el-checkbox
            v-for="item in specsList"
            :key="item.specsName"
            border
            :label="item.specsName"
          >{{ item.specsName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="form.type!==3" label="价格：" prop="priceStr">
        <el-input v-model="form.priceStr" maxLength="10"/>
      </el-form-item>
      <el-form-item v-if="form.type===3" label="规格A价格：" prop="priceStr">
        <el-input v-model="form.priceStr" maxLength="10"/>
        <label>规格B价格：</label>
        <el-input v-model="form.priceStr" maxLength="10"/>
      </el-form-item>

    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" :loading="submitLoading" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import guigeApi from '../../api/guige'
import goodsApi from '../../api/goods'

const initFormData = {
  goodsName: '',
  status: '',
  priceStr: '',
  fileUrls: [],
  specsList: [],
  useTypeId: ''
}

export default {
  name: 'GoodDialog',
  props: {
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const validateImg = (rule, value, callback) => {
      if (this.form.fileUrls.length === 0) {
        callback(new Error('请上传一张图片'))
      } else {
        callback()
      }
    }
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
      this.imgUrl = 'https://axjieyakang.com/assets/' + file.url
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
