<template>
  <div class="app-container">
    <add-button @add="add" />
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="searchForm.name" maxLength="11" />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="searchForm.status">
            <el-option label="全部" value="" />
            <el-option label="上架" value="true" />
            <el-option label="下架" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="fetchData(searchForm)"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <xl-table
      ref="goodsTable"
      :index="true"
      :loading="loading"
      :table-data="goodsData"
      :table-columns="columns"
    />
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
        <el-form-item label="状态：" prop="status">
          <el-switch
            v-model="form.status"
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
  </div>
</template>

<script>
import AddButton from '../../components/AddButton'
import goodsApi from '../../api/goods'
import { deepClone } from '../../utils/index'

export default {
  name: 'GoodsList',
  components: { AddButton },
  data() {
    const validateImg = (rule, value, callback) => {
      if (this.fileList.length === 0) {
        callback(new Error('请上传一张图片'))
      } else {
        callback()
      }
    }
    return {
      goodsData: [],
      columns: [
        { label: '名称', prop: 'name', align: 'left' },
        { label: '图片', prop: 'pic', align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-img'>
                <el-image src={row.pic} fit='fit'/>
              </div>
            )
          }
        },
        { label: '库存/状态', align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div>
                <div class={'stores'}>{row.stores}</div>
                <el-tag size={'medium'} type={row.status ? 'success' : 'danger'}>{row.status ? '上架' : '下架'}</el-tag>
              </div>
            )
          }
        },
        { label: '价格', prop: 'price', align: 'center' },
        { label: '销量', prop: 'numberSells', align: 'center' },
        { label: '添加/更新时间', align: 'center', width: '240',
          render: (h, { props: { row }}) => {
            return (
              <div>
                <p>{row.addTime}</p>
                <p>{row.updateTime}</p>
              </div>
            )
          } },
        { label: '操作', prop: 'region', align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.update(row)}>编 辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.delete(row.id)}>删 除</span>
              </div>
            )
          }
        }
      ],
      loading: false,
      isAdd: false,
      editVisible: false,
      imgUrl: '',
      form: {
        name: '',
        stores: '',
        status: '',
        price: '',
        img: ''
      },
      searchForm: {
        name: '',
        status: ''
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        stores: [
          { required: true, message: '库存不能为空', trigger: 'blur' },
          { type: 'number', min: 0, message: '不能小于0', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '价格不能为空', trigger: 'blur' },
          { type: 'number', min: 0, message: '不能小于0', trigger: 'blur' }
        ],
        img: [
          { validator: validateImg, trigger: 'blur' }
        ]
      },
      fileList: []
    }
  },
  computed: {
    url() {
      return this.add ? 'add' : 'update'
    }
  },
  watch: {
    fileList(val) {
      this.hideUpload(val.length === 0)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    onError() {
      this.$message1000('文件上传出错：网络错误', 'error')
    },
    removeImg() {
      this.fileList = []
    },
    uploadOk(res) {
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
      goodsApi.getGoods(data).then(res => {
        this.goodsData = res.list
      }).finally(_ => {
        this.loading = false
      })
    },
    add() {
      this.isAdd = true
      this.editVisible = true
    },
    hideUpload(display) {
      setTimeout(() => {
        this.$refs.upload.$refs['upload-inner'].$el.style.display = display ? '' : 'none'
      }, 0)
    },
    update(row) {
      this.isAdd = false
      this.form = deepClone(row)
      this.fileList = [{ name: row.name, url: row.pic }]
      this.editVisible = true
    },
    delete(id) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        goodsApi.deleteGoods(id).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    },
    close() {
      this.fileList = []
      this.form = {
        name: '',
        stores: '',
        status: '',
        price: ''
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          goodsApi.updateGoods(this.form).then(_ => {
            this.editVisible = false
            this.$message1000('提交成功', 'success')
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
</style>
