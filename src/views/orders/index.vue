<template>
  <div class="app-container">
    <add-button @add="add" />
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="searchForm.name" maxLength="11" />
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="searchForm.phone" maxLength="11" />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="searchForm.status">
            <el-option label="全部" value="" />
            <el-option label="订单关闭" value="1" />
            <el-option label="待支付" value="2" />
            <el-option label="待发货" value="3" />
            <el-option label="已发货" value="4" />
            <el-option label="交易完成" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号:" prop="orderNumber">
          <el-input v-model="searchForm.orderNumber" maxLength="11" />
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
      ref="orderTable"
      :index="true"
      :selection="true"
      :loading="loading"
      :table-data="orderData"
      :table-columns="columns"
      @selection-change="handleSelectionChange"
    />
    <div class="footer">
      <el-button type="danger" @click="orderDelete(false)">批量删除</el-button>
    </div>
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
import orderApi from '../../api/order'
import { deepClone } from '../../utils/index'

export default {
  name: 'OrderList',
  components: { AddButton },
  data() {
    return {
      orderData: [],
      columns: [
        { label: '用户', prop: 'name', align: 'left', width: '80' },
        { label: '数量', prop: 'goodsAmount', align: 'center',width: '60' },
        { label: '订单号', prop: 'orderNumber', align: 'center',},
        { label: '状态', prop: 'statusStr',align: 'center',},
        { label: '金额', prop: 'money', align: 'center' },
        { label: '交易/更新时间', align: 'center', width: '240',
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
                <span onClick={() => this.detail(row)}>详 情</span>
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
        phone: '',
        status: '',
        orderNumber: '',
        status: '',
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
        ]
      },
      selected: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    orderDelete() {

    },
    handleSelectionChange(rows) {
      this.selected = rows.map(v => v.id)
    },
    fetchData(data) {
      this.loading = true
      orderApi.getOrder(data).then(res => {
        this.orderData = res.list
      }).finally(_ => {
        this.loading = false
      })
    },
    detail(row){

    },
    delete(id) {
      this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orderApi.deleteOrder(id).then(_ => {
          this.$message1000('删除成功', 'success')
          this.fetchData()
        })
      })
    },
    close() {
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
          orderApi.updateOrder(this.form).then(_ => {
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
  .footer{
    margin: 20px auto;
  }
</style>
