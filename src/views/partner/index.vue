<template>
  <div class="app-container">
    <add-button @add="add" />
    <base-table
      ref="partnerTable"
      :index="true"
      :loading="loading"
      :table-data="partnerData"
      :table-columns="columns"
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
          <el-image :src="form.img"></el-image>
          <el-upload
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            list-type="picture-card">
          </el-upload>
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
import BaseTable from '../../components/baseTable'
import AddButton from '../../components/AddButton'
import partnerApi from '../../api/partner'
import { deepClone } from '../../utils/index'

export default {
  name: 'Partner',
  components: { BaseTable, AddButton },
  data() {
    return {
      partnerData: [],
      columns: [
        {
          label: '名称',
          prop: 'name',
          align: 'center'
        },
        {
          label: '宣传图',
          prop: 'img',
          align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-img'>
                <el-image src={row.img} fit='fit'/>
              </div>
            )
          }
        },
        { label: '是否展示', prop: 'display', align: 'center',
          render: (h, { props: { row }}) => {
            return (
              <div class='is-default-icon'>
                <i class={'el-icon-' + (row.display ? 'success' : 'error')}/>
              </div>
            )
          }
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
      form: {
        name: '',
        img: '',
        display: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传一张图片', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.form.img = file.url;
    },
    fetchData() {
      this.loading = true
      partnerApi.getPartner().then(res => {
        this.partnerData = res.list
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
      // resetFields()会将form中的数据更改
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
      this.editVisible = false
      this.form = {
        name: '',
        img: '',
        phone: '',
        password: '',
        region: ''
      }
    },
    submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const result = await this.isAdd ? partnerApi.addPartner(this.form) : partnerApi.updatePartner(this.form)
          result.then(_ => {
            this.$message1000('提交成功', 'success')
            this.close()
            this.fetchData()
          })
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
