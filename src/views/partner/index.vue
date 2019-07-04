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
        <el-form-item label="名称：" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="宣传图" prop="img">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="uploadOk"
            :before-upload="beforeAvatarUpload">
            <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar">
            <i v-else class="el-icon-plus img-uploader-icon" />
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
import partnerApi from '../../api/partner'
import { deepClone } from '../../utils/index'
import pagination from '../../mixins/pagination'

export default {
  name: 'Partner',
  components: { AddButton },
  mixins: [pagination],
  data() {
    return {
      partnerData: [],
      columns: [
        {
          label: '名称',
          prop: 'partnersName',
          align: 'center'
        },
        {
          label: '宣传图',
          prop: 'fileUrl',
          align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-img'>
                <el-image src={row.fileUrl} fit='fit'/>
              </div>
            )
          }
        },
        { label: '是否展示', prop: 'show', align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='is-default-icon'>
                <i class={'el-icon-' + (row.show ? 'success' : 'error')}/>
              </div>
            )
          }
        },
        {
          label: '添加时间',
          prop: 'saveDate',
          align: 'center'
        },
        {
          label: '更新时间',
          prop: 'modifyDate',
          align: 'center'
        },
        {
          label: '操作',
          prop: 'operation',
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
        partnersName: '',
        show: ''
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
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
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
    uploadOk(res, file) {
      console.log(res)
      this.dialogImageUrl = URL.createObjectURL(file.raw)
      console.log(this.dialogImageUrl);
      // if (res.success) {
      //   this.$message1000('文件上传成功', 'success')
      // } else {
      //   let msg = res.msg
      //   msg = '文件上传出错：' + msg
      //   this.$message1000(msg, 'error')
      //   this.fileList = []
      // }
      // this.editVisible = false
    },
    handlePreview(file) {
      this.imgVisible = true
      this.dialogImageUrl = file.url
    },
    fetchData() {
      this.loading = true
      partnerApi.getPartner().then(res => {
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
      this.form.partnersName = row.partnersName
      this.form.show = row.show
      this.fileList.push({
        name: row.partnersName,
        url: row.fileUrl
      })
      this.editVisible = true
    },
    delete(id) {
      this.$confirm('此操作将删除该合作伙伴, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        partnerApi.deletePartner(id).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    },
    close() {
      this.fileList = []
      this.resetForm()
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
  /deep/ .img-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
