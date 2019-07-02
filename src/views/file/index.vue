<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="type">
          <el-select v-model="searchForm.type" placeholder="类型">
            <el-option label="图片" value="image" />
            <el-option label="音频" value="audio" />
            <el-option label="视频" value="video" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="fetchData(searchForm)">查询</el-button>
          <el-button type="danger" @click="deleteFile">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <xl-table
      ref="fileTable"
      :index="true"
      :selection="true"
      :loading="loading"
      :table-data="fileData"
      :table-columns="columns"
      :total="pagination.total"
      :page-no="pagination.currentPage"
      :page-size="pagination.size"
      @change-page="changePage"
      @selection-change="selectChange"
    />
    <add-button @add="add" />
    <el-dialog
      width="40%"
      title="文件上传"
      :close-on-click-modal="true"
      :visible.sync="uploadVisible"
      @close="close"
    >
      <el-upload
        ref="upload"
        drag
        action="/file/add"
        :on-success="uploadOk"
        :data="uploadData"
        :on-change="onFileChange"
        :auto-upload="false"
        :on-remove="onRemove"
        :show-file-list="true"
        :on-error="onError"
        :on-progress="onProgress"
        multiple
      >
        <i class="el-icon-upload" />
        <p v-show="speed" class="upload-speed">{{ speed }}</p>
        <div class="el-upload__text">将文件拖到此处或点击上传</div>
      </el-upload>
      <div class="remark">
        <span>备注：</span>
        <el-input v-model="uploadData.remark"></el-input>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" :disabled="btDisable" @click="submitUpload">开始上传</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddButton from '../../components/AddButton'
import fileApi from '../../api/file'
import { formatSize } from '../../utils/index'

export default {
  name: 'File',
  components: { AddButton },
  data() {
    return {
      searchForm: {
        type: ''
      },
      fileData: [],
      columns: [
        {
          label: '文件类型',
          prop: 'fileTypeStr',
          align: 'center'
        },
        {
          label: '缩略图',
          prop: 'img',
          align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-img'>
                <el-image src={row.urlFull} fit='fit'/>
              </div>
            )
          }
        },
        {
          label: '文件后缀',
          prop: 'suffix',
          align: 'center'
        },
        {
          label: 'URL地址',
          prop: 'urlFull',
          align: 'center',
          width: '240'
        },
        {
          label: '备注',
          prop: 'remark',
          align: 'center'
        },
        {
          label: '大小',
          prop: 'size',
          align: 'center',
          formatter: row => formatSize(row.size)
        },
        {
          label: '上传时间',
          prop: 'addTime',
          align: 'center',
          width: '180'
        },
        {
          label: '操作',
          prop: 'operation',
          align: 'center',
          width: '80',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <el-button type='danger' size='small' onClick={() => this.deleteFile(false, row.id)}>删 除</el-button>
              </div>
            )
          }
        }
      ],
      loading: false,
      uploadVisible: false,
      fileList: [],
      uploadData: {
        remark: ''
      },
      btDisable: true,
      currentFile: null,
      speed: '',
      time: '',
      loaded: 0,
      pagination: {
        currentPage: 1,
        total: 0,
        size: 20
      },
      fileIds: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    add() {
      this.uploadVisible = true
    },
    onProgress(event) {
      const interval = new Date().getTime() - this.time
      this.time = new Date().getTime()
      const size = event.loaded - this.loaded
      this.speed = formatSize((size / (interval / 1000)).toFixed(0)) + '/s'
      this.loaded = event.loaded
    },
    onError() {
      this.$message1000('文件上传出错：网络错误', 'error')
      this.uploadVisible = false
      this.$refs.upload.clearFiles()
      this.speed = ''
    },
    onRemove(file, filelist) {
      this.speed = ''
      this.fileList = filelist
      if (filelist.length === 0) {
        this.btDisable = true
      }
    },
    submitUpload() {
      if (this.currentFile == null) {
        return
      }
      this.$refs.upload.submit()
      this.time = new Date().getTime()
      this.btDisable = true
    },
    uploadOk(res) {
      this.speed = ''
      if (res.success) {
        this.$message('文件上传成功', 'success')
        this.$refs.upload.clearFiles()
        this.uploadVisible = false
      } else {
        let msg = res.msg
        if (msg == null || msg === '') {
          msg = '服务器错误'
        }
        msg = '文件上传出错：' + msg
        this.$message(msg, 'error')
        this.$refs.upload.clearFiles()
        this.fileList = []
        this.uploadVisible = false
      }
    },
    onFileChange(file, fileList) {
      if (fileList.length > 0) {
        this.btDisable = false
      }
      if (fileList.length > 1) {
        for (let i = 0; i < fileList.length - 1; i++) { // 此时fileList里面已经包含file了，所以需要长度减一再判断
          if (fileList[i].name === file.name) {
            fileList.pop()
            this.$message1000('上传失败！文件上传列表中存在同名文件', 'error')
          }
        }
      }
      this.fileList = fileList
      if (file.status === 'ready') {
        this.btDisable = false
        this.currentFile = file
      }
    },
    close() {
      const uploadingFiles = []
      for (const item of this.fileList) {
        if (item.status === 'uploading') {
          uploadingFiles.push(item)
        }
      }
      if (this.fileList.length > 0) {
        if (confirm('文件正在上传中，关闭后上传被中止, 是否继续?')) {
          for (let v = 0; v < uploadingFiles.length; ++v) {
            this.$refs.upload.abort(uploadingFiles[v])
          }
          this.speed = ''
          this.$refs.upload.clearFiles()
          this.fileList = []
          this.uploadVisible = false
        } else {
          return
        }
        this.$message1000('文件上传被中止', 'warning')
      }
      this.$refs.upload.clearFiles()
      this.fileList = []
      this.uploadVisible = false
    },
    changePage(val) {
      this.pagination.currentPage = val
      this.fetchData()
    },
    selectChange(select) {
      this.fileIds = select.map(item => item.id)
    },
    fetchData() {
      this.loading = true
      fileApi.getFiles().then(res => {
        this.fileData = res.list
        this.pagination.total = res.total
        this.pagination.size = res.pageSize
      }).finally(_ => {
        this.loading = false
      })
    },
    deleteFile(batch = true, id) {
      if (batch && this.fileIds.length < 1) {
        this.$message1000('请先选择文件', 'error')
        return
      }
      this.$confirm('此操作将删除文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fileApi.deleteFiles({
          ids: id
        }).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-tag{
    font-size: 16px;
  }
  /deep/ .el-upload{
    display: block;
    &-list__item{
      outline: none;
    }
    &-dragger {
      width: 100%;
      height: 22vh;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .el-icon-upload {
        margin: 0;
      }
    }
  }
  .upload-speed{
    color: forestgreen;
  }
  .remark{
    display: flex;
    align-items: center;
    margin: 30px 0;
    span{
      width: 60px;
    }
  }
</style>
