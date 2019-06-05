<template>
  <div class="app-container">
    <add-button @add="add" />
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
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="宣传图" prop="img">
          <el-upload
            ref="upload"
            :action="'/goods/'+url"
            :on-preview="handlePreview"
            :on-remove="controlHideUpload"
            :on-success="uploadOk"
            :on-error="onError"
            :data="form"
            :on-change="controlHideUpload"
            :file-list="fileList"
            :auto-upload="false"
            list-type="picture-card"
            accept="['.png','.jpg']"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="imgVisible" append-to-body>
            <el-image :src="dialogImageUrl" alt="" fit="fill" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="是否展示：" prop="display">
          <el-switch
            v-model="form.display"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="展示"
            inactive-text="隐藏"
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
import goodsApi from '../../api/goods'
import { deepClone } from '../../utils/index'

export default {
  name: 'GoodsList',
  components: { AddButton },
  data() {
    return {
      goodsData: [],
      columns: [
        {
          label: '名称',
          prop: 'name',
          align: 'center'
        },
        {
          label: '图片',
          prop: 'pic',
          align: 'center',
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
              <div class='is-default-icon'>
                {row.stores}
                <i class={'el-icon-' + (row.status ? 'success' : 'error')}/>
              </div>
            )
          }
        },
        {
          label: '价格',
          prop: 'price',
          align: 'center'
        },
        {
          label: '销量',
          prop: 'numberSells',
          align: 'center'
        },
        {
          label: '添加时间',
          prop: 'addTime',
          align: 'center'
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          align: 'center'
        },
        {
          label: '操作',
          prop: 'region',
          align: 'center',
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
      imgVisible: false,
      dialogImageUrl: '',
      form: {
        name: '',
        display: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
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
  created() {
    this.fetchData()
  },
  methods: {
    controlHideUpload(file, fileList) {
      if (fileList.length > 0) {
        this.hideUpload()
      } else {
        this.hideUpload('')
      }
    },
    onError() {
      this.$message1000('文件上传出错：网络错误', 'error')
      this.editVisible = false
    },
    uploadOk(res) {
      if (res.success) {
        this.$message1000('文件上传成功', 'success')
        this.close()
        this.fetchData()
        this.editVisible = false
      } else {
        let msg = res.msg
        msg = '文件上传出错：' + msg
        this.$message1000(msg, 'error')
        this.fileList = []
        this.editVisible = false
      }
    },
    handlePreview(file) {
      this.imgVisible = true
      this.dialogImageUrl = file.url
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
      this.hideUpload('')
      this.isAdd = true
      this.editVisible = true
    },
    hideUpload(display = 'none') {
      this.$nextTick(() => {
        this.$refs.upload.$refs['upload-inner'].$el.style.display = display
      })
    },
    update(row) {
      this.hideUpload()
      this.isAdd = false
      this.form = deepClone(row)
      this.fileList = [{ name: 'food.jpg', url: 'https://img-bcy-qn.pstatp.com/user/213091/item/c0r3z/45a1ac2a95a54db08c6a5f1e5c31aa6b.jpg?imageMogr2/auto-orient/strip|watermark/2/text/wqnms73mnIgK5Y2K5qyh5YWDIC0gQUNH54ix5aW96ICF56S-5Yy6/fontsize/1824/fill/I2NjY2NjYw==/dx/59/dy/44/font/5b6u6L2v6ZuF6buR' }]

      this.editVisible = true
    },
    delete(id) {
      this.$confirm('此操作将删除该合作伙伴, 是否继续?', '提示', {
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
        display: ''
      }
    },
    submitForm() {
      if (this.fileList.length < 1) {
        this.$message1000('请上传图片', 'warning')
        return
      }
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.$refs.upload.submit()
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
