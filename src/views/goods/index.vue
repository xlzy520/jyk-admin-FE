<template>
  <div class="app-container">
    <add-button @add="add" />
    <xl-table
      ref="goodsTable"
      :index="true"
      :selection="true"
      :loading="loading"
      :table-data="goodsData"
      :table-columns="columns"
      @selection-change="handleSelectionChange"
    />
    <div v-if="goodsData.length>0" class="footer">
      <el-button type="success" @click="changeStatus(1)">上架</el-button>
      <el-button type="danger" @click="changeStatus(0)">下架</el-button>
    </div>
    <el-dialog
      width="40%"
      :title="isAdd?'新增商品' : '编辑商品'"
      :close-on-click-modal="true"
      :visible.sync="editVisible"
      @close="close"
    >
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="名称：" prop="goodsName">
          <el-input v-model.trim="form.goodsName" maxLength="20" />
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
            <i class="el-icon-plus" />
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
            >{{ item.specsName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="form.type!==3" label="价格：" prop="price">
          <el-input v-model.number="form.price" maxLength="10" />
        </el-form-item>
        <el-form-item v-if="form.type===3" label="规格A价格：" prop="price">
          <el-input v-model.number="form.price" maxLength="10" />
          <label>规格B价格：</label>
          <el-input v-model.number="form.price" maxLength="10" />
        </el-form-item>

      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddButton from '../../components/AddButton'
import goodsApi from '../../api/goods'
import guigeApi from '../../api/guige'
import { deepClone } from '../../utils/index'
import pagination from '../../mixins/pagination'

const initFormData = {
  goodsName: '',
  status: '',
  price: '',
  fileUrls: [],
  specsList: [],
  useTypeId: ''
}

export default {
  name: 'GoodsList',
  components: { AddButton },
  mixins: [pagination],
  data() {
    const validateImg = (rule, value, callback) => {
      if (this.form.fileUrls.length === 0) {
        callback(new Error('请上传一张图片'))
      } else {
        callback()
      }
    }
    return {
      goodsData: [],
      columns: [
        { label: '名称', prop: 'goodsName', align: 'left' },
        { label: '图片', prop: 'pic',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-img'>
                <img src={'http://49.234.212.216:8080/market/file/preview?fileUrl=' + row.fileUrls[0]} fit='fit'/>
              </div>
            )
          }
        },
        { label: '状态',
          render: (h, { props: { row }}) => {
            return (
              <div>
                <el-tag size={'medium'} type={row.sale ? 'success' : 'danger'}>{row.sale ? '上架' : '下架'}</el-tag>
              </div>
            )
          }
        },
        { label: '价格', prop: 'priceStr' },
        { label: '销量', prop: 'numberSells' },
        { label: '添加时间', width: '240', prop: 'saveDate' },
        { label: '操作', prop: 'region',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.update(row)}>编 辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delete(row.goodsId)}>删 除</span>
              </div>
            )
          }
        }
      ],

      loading: false,
      submitLoading: false,

      isAdd: false,
      editVisible: false,
      imgUrl: '',
      form: initFormData,
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名称' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符' }
        ],
        price: [
          { required: true, message: '请输入商品价格' },
          { type: 'number', min: 0, message: '不能小于0' }
        ],
        useTypeId: [
          { required: true, message: '请输入商品类型' },
          { type: 'number', min: 0, message: '不能小于0' }
        ],
        img: [
          { validator: validateImg, trigger: 'blur' }
        ]
      },
      fileList: [],
      selected: [],
      dialogVisible: false,
      useType: [],
      specsList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    typeChange(val) {
      const index = this.useType.findIndex(v => v.useTypeId === val)
      if (index > 0) {
        this.specsList = this.useType[index].specsList
      }
    },
    handleSuccess(res, file, fileList) {
      console.log(res)
      this.form.fileUrls.push(res.data)
    },
    handlePictureCardPreview(file) {
      this.imgUrl = file.url
      this.dialogVisible = true
    },
    changeStatus(status) {
      goodsApi.changeStatusGoods({ goodsId: this.selected, sale: status }).then(res => {
        this.$message1000('成功', 'success')
        this.fetchData()
      })
    },
    handleSelectionChange(rows) {
      this.selected = rows.map(v => v.goodsId)
    },
    onError() {
      this.$message1000('文件上传出错：网络错误', 'error')
    },
    removeImg() {
      this.form.img = []
    },
    uploadOk(res) {
      console.log(res);
      const { success, msg, data } = res
      if (success) {
        this.$message1000('图片上传成功', 'success')
        this.form.img = data.imgUrl
      } else {
        this.$message1000(msg, 'error')
        this.fileList = []
      }
    },
    fetchData(data) {
      this.loading = true
      goodsApi.getGoods({ ...this.pageOption, ...this.form }).then(res => {
        this.goodsData = res.list
      }).finally(_ => {
        this.loading = false
      })
    },
    getUseTypeList() {
      guigeApi.getUseTypeList().then(res => {
        this.useType = res
      })
    },
    add() {
      this.isAdd = true
      this.editVisible = true
      this.getUseTypeList()
    },
    hideUpload(display) {
      setTimeout(() => {
        this.$refs.upload.$refs['upload-inner'].$el.style.display = display ? '' : 'none'
      }, 0)
    },
    update(row) {
      this.isAdd = false
      this.form = deepClone(row)
      this.fileList = [{ goodsName: row.goodsName, url: row.pic }]
      this.editVisible = true
    },
    delete(id) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        goodsApi.deleteGoods({
          goodsId: id
        }).then(_ => {
          this.loading = false
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    },
    close() {
      this.fileList = []
      this.form = initFormData
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const baseRequest = this.isAdd ? goodsApi.addGoods : goodsApi.updateGoods
          baseRequest(this.form).then(_ => {
            this.editVisible = false
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
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/.stores{
    font-size: 20px;
    margin-bottom: 10px;
  }
  /deep/.table-img{
    img{
      width: 75%;
    }
  }
  .footer{
    margin: 20px auto;
  }
</style>
