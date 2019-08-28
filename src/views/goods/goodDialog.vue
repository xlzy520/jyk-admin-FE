<template>
  <el-dialog
    width="900px"
    :title="isAdd?'新增商品' : '编辑商品'"
    :close-on-click-modal="true"
    :visible="true"
    @close="close"
  >
    <div v-loading="dialogLoading">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="名称：" prop="goodsName">
          <el-input v-model.trim="form.goodsName" maxLength="20"/>
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
        <el-form-item label="规格详情：" v-if="form.useTypeId">
          <div class="box-card-warp">
            <el-card class="box-card" v-for="item in specsList" :key="item.specsId">
              <div slot="header" class="clearfix">
                <span>{{item.specsName}}</span>
              </div>
              <div class="text">
                {{item.specsStr}}
              </div>
            </el-card>
          </div>
        </el-form-item>
        <el-form-item v-if="form.useTypeId!==3" label="价格：" prop="priceStr">
          <el-input v-model="form.priceStr" maxLength="10"/>
        </el-form-item>
        <el-row v-if="form.useTypeId===3">
          <el-col :span="12">
            <el-form-item label="规格A价格：" prop="priceStr0">
              <el-input v-model="form.priceStr0" maxLength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格B价格：" prop="priceStr1">
              <el-input v-model="form.priceStr1" maxLength="10"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="缩略图：" prop="smallImg">
              <el-upload
                v-loading="uploadLoadingSmallImg"
                class="avatar-uploader"
                :show-file-list="false"
                action="/market/file/add"
                :on-success="res=>handleSuccess(res, 'littleUrl')"
                :auto-upload="true"
                accept="['.png','.jpg']"
              >
                <img v-if="form.littleUrl" :src="$baseImgUrl+form.littleUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="高清图：" prop="bigImg">
              <el-upload
                v-loading="uploadLoadingBigImg"
                ref="upload"
                class="avatar-uploader"
                action="/market/file/add"
                list-type="picture-card"
                :limit="2"
                :on-remove="handleRemove"
                :file-list="fileList"
                :on-success="res=>handleSuccess(res, 'fileUrls')"
                :auto-upload="true"
                accept="['.png','.jpg']"
              >
                <i class="el-icon-plus"/>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态：" prop="sale">
          <el-switch
            v-model="form.sale"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="上架"
            inactive-text="下架"
          />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import guigeApi from '../../api/guige'
import goodsApi from '../../api/goods'

const initFormData = {
  goodsName: '',
  sale: '',
  priceStr: '',
  littleUrl: '',
  fileUrls: [],
  specsList: [],
  useTypeId: '',
  priceStr1: '',
  priceStr2: '',
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
    const priceRule = [
      this.$rules.required('请输入商品价格'),
      this.$rules.float,
      this.$rules.float5
    ]
    const validateBigImg = (rule, value, callback) => {
      if (this.form.fileUrls.length === 0) {
        callback(new Error('请上传一张商品缩略图'))
      } else {
        callback()
      }
    }
    const validateSmallImg = (rule, value, callback) => {
      if (this.form.littleUrl === '') {
        callback(new Error('请上传一张商品高清图'))
      } else {
        callback()
      }
    }
    return {
      uploadLoadingSmallImg: false,
      uploadLoadingBigImg: false,
      dialogLoading: false,
      submitLoading: false,
      form: initFormData,
      dialogVisible: false,
      specData: [],
      rules: {
        goodsName: [
          this.$rules.required('请输入商品名称'),
          this.$rules.word_number_chinese
        ],
        priceStr: priceRule,
        priceStr0: priceRule,
        priceStr1: priceRule,
        useTypeId: [
          this.$rules.required('请输入商品类型')
        ],
        bigImg: [
          { validator: validateBigImg }
        ],
        smallImg: [
          { validator: validateSmallImg }
        ],
      },
      specsList: [],
      useType: [],
      fileList: []
    }
  },
  methods: {
    typeChange(val) {
      const index = this.useType.findIndex(v => v.useTypeId === val)
      if (index > -1) {
        this.specsList = this.useType[index].specsList
        this.form.specsList = this.useType[index].specsList.map((v,index)=>{
          if (this.form.useTypeId === 3) {
            return {
              "specsId": v.specsId
            }
          }
          return {
            "specsId": v.specsId,
            "price":this.form.priceStr
          }
        })
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.form.priceStr) {
            this.form.specsList.map(v=>{
              v.price = this.form.priceStr
            })
          }
          if (this.form.useTypeId === 3) {
            this.form.specsList.map((v,index)=>{
              v.price = this.form['priceStr'+index]
            })
          }
          const baseRequest = this.isAdd ? goodsApi.addGoods : goodsApi.updateGoods
          baseRequest(this.form).then(_ => {
            this.submitLoading = false
            this.close()
            this.$message1000(this.isAdd ? '新增成功' : '更新成功', 'success')
            this.$emit('fetchData')
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          return false
        }
      })
    },
    onError(res) {
      this.$message1000('文件上传出错：'+ res.msg, 'error')
    },
    handleSuccess(res, name) {
      const { success, msg, data } = res
      if (success) {
        this.$message1000('图片上传成功', 'success')
        if (name === 'littleUrl') {
          this.form[name] = data
        } else {
          if (this.form[name]===null) {
            this.form[name] = []
          }
          this.fileList.push({
            name: res.data,
            url: 'https://axjieyakang.com/assets/' + res.data
          })
          this.form[name].push(data)
        }
      } else {
        this.$message1000(msg, 'error')
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      const urlIndex = this.form.fileUrls.findIndex(v => file.url.includes(v))
      if (urlIndex> -1) {
        this.form.fileUrls.splice(urlIndex, 1)
      }
    },
    close() {
      this.form = initFormData
      this.fileList = []
      this.$emit('close')
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    getUseTypeList() {
      this.dialogLoading = true
      guigeApi.getUseTypeList().then(res => {
        this.useType = res||[]
        this.typeChange(this.form.useTypeId)
      }).finally(() => {
        this.dialogLoading = false
      })
    }
  },
  mounted() {
    this.getUseTypeList()
  },
}
</script>

<style lang="scss" scoped>
  /deep/ .avatar-uploader{
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409EFF;
      }
    }
    &-icon {
      font-size: 28px;
      color: #8c939d;
      width: 146px;
      height: 146px;
      line-height: 146px;
      text-align: center;
    }
    .avatar {
      width: 146px;
      display: block;
    }
  }
  /deep/ .el-card__header{
    font-size: 16px;
    padding: 0 10px;
    background: #17c686;
    color: #fff;
  }
  .box-card {
    width: 270px;
    &-warp{
      display: flex;
      justify-content: space-between;
    }
  }
  .text {
    font-size: 14px;
  }
  .clearfix{
    &:before,&:after{
      display: table;
      content: "";
    }
    &:after {
      clear: both
    }
  }
</style>
