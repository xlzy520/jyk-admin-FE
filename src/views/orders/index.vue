<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="name">
          <el-input v-model="searchForm.name" maxLength="11" placeholder="姓名" />
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="searchForm.mobile" maxLength="11" placeholder="手机号" />
        </el-form-item>
        <el-form-item prop="orderNumber">
          <el-input v-model="searchForm.orderNumber" maxLength="11" placeholder="订单编号" />
        </el-form-item>
        <el-form-item prop="statusName">
          <el-select v-model="searchForm.statusName" placeholder="订单状态">
            <el-option label="全部" value="" />
            <el-option label="订单关闭" value="订单关闭" />
            <el-option label="待支付" value="待支付" />
            <el-option label="待发货" value="待发货" />
            <el-option label="已发货" value="已发货" />
            <el-option label="交易完成" value="交易完成" />
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
      ref="orderTable"
      :index="true"
      :selection="true"
      :table-data="orderData"
      :table-columns="columns"
      :total="total"
      :pageSize="pageOption.pageSize"
      :pageNo="pageOption.pageIndex"
      @change-page="pageChange"
      @size-change="sizeChange"
      @selection-change="handleSelectionChange"
    />
    <div class="footer">
      <el-button v-if="orderData.length>0" :disabled="selected.length>0" type="danger" @click="orderDelete('all')">批量删除</el-button>
    </div>
    <order-detail v-if="visible" ref="dialog" @close="close"/>
  </div>
</template>

<script>
import orderApi from '../../api/order'
import { deepClone } from '../../utils/index'
import pagination from '../../mixins/pagination'
import OrderDetail from "./orderDetail";

export default {
  name: 'OrderList',
  components: {OrderDetail },
  mixins: [pagination],
  data() {
    return {
      orderData: [],
      columns: [
        { label: '用户', prop: 'consignee', align: 'left' },
        { label: '手机号', prop: 'mobile', align: 'left' },
        { label: '数量', prop: 'total' },
        { label: '订单号', prop: 'orderNumber' },
        { label: '状态', prop: 'statusName' },
        { label: '金额/元', prop: 'amount', align: 'center' },
        { label: '提交时间', prop: 'saveDate' },
        { label: '操作', prop: 'operate',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.detail(row)}>详 情</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.orderDelete('one', row.id)}>删 除</span>
              </div>
            )
          }
        }
      ],
      loading: false,
      isAdd: false,
      visible: false,
      imgUrl: '',
      form: {
        name: '',
        stores: '',
        statusName: '',
        price: '',
        img: ''
      },
      searchForm: {
        name: '',
        mobile: '',
        statusName: '',
        orderNumber: ''
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
      selected: [],
      total: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    orderDelete(type, id) {
      this.$confirm('此操作将删除订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        const params = type === 'all' ? this.selected : id
        orderApi.deleteOrder({
          id: params
        }).then(res => {
          this.$message1000('删除成功', 'success')
          this.loading = false
          this.fetchData()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    handleSelectionChange(rows) {
      this.selected = rows.map(v => v.id)
    },
    fetchData(data) {
      this.loading = true
      orderApi.getOrder({
        ...data,
        ...this.pageOption
      }).then(res => {
        this.orderData = res.list
        this.total = res.count
      }).finally(_ => {
        this.loading = false
      })
    },
    detail(row) {

    },
    close() {
      this.form = {
        name: '',
        stores: '',
        statusName: '',
        price: ''
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          orderApi.updateOrder(this.form).then(_ => {
            this.visible = false
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
