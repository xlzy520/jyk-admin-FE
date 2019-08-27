<template>
  <div v-loading="loading" class="app-container">
    <add-button @add="add"/>
    <xl-table
      ref="goodsTable"
      :index="true"
      :selection="true"
      :table-data="goodsData"
      :table-columns="columns"
      @selection-change="handleSelectionChange"
    />
    <div v-if="goodsData.length>0" class="footer">
      <el-button type="success" :disabled="selected.length===0" @click="changeStatus(1)">上架</el-button>
      <el-button type="danger" :disabled="selected.length===0" @click="changeStatus(0)">下架</el-button>
    </div>
    <good-dialog v-if="visible" ref="dialog" :is-add="isAdd" @close="close" @fetchData="fetchData"/>
  </div>
</template>

<script>
import AddButton from '../../components/AddButton'
import goodsApi from '../../api/goods'
import { deepClone } from '../../utils/index'
import pagination from '../../mixins/pagination'
import GoodDialog from './goodDialog'

export default {
  name: 'GoodsList',
  components: { GoodDialog, AddButton },
  mixins: [pagination],
  data() {
    return {
      goodsData: [],
      columns: [
        { label: '名称', prop: 'goodsName', align: 'left' },
        {
          label: '图片', prop: 'pic',
          render: (h, { props: { row }}) => {
            return (
              <el-image src={this.$baseImgUrl + row.littleUrl} fit='fit'
                        previewSrcList={[this.$baseImgUrl + row.fileUrl]}>
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            )
          }
        },
        {
          label: '状态',
          render: (h, { props: { row }}) => {
            return (
              <div>
                <el-tag size={'medium'} type={row.sale ? 'success' : 'danger'}>{row.sale ? '上架' : '下架'}</el-tag>
              </div>
            )
          }
        },
        { label: '价格', prop: 'priceStr' },
        { label: '销量', prop: 'sales' },
        { label: '添加时间', width: '240', prop: 'saveDate' },
        {
          label: '操作', prop: 'region',
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
      isAdd: false,
      loading: false,
      visible: false,
      selected: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    changeStatus(status) {
      if (this.selected.length === 0) {
        this.$message1000('请选择商品', 'info')
        return false
      }
      const text = status ? '上架' : '下架'
      this.$confirm(`此操作将确定${text}选择的商品, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.loading = true
        const params = this.selected.map((v) => {
          return {
            goodsId: v,
            sale: status
          }
        })
        goodsApi.changeStatusGoods({ goods: params }).then(res => {
          this.$message1000(text + '成功', 'success')
          this.goodsData.filter(v => this.selected.includes(v.goodsId)).map(v => {
            v.sale = !v.sale
          })
        }).finally(() => {
          this.loading = false
        })
      })
    },
    handleSelectionChange(rows) {
      this.selected = rows.map(v => v.goodsId)
    },
    fetchData() {
      this.loading = true
      goodsApi.getGoods({ ...this.pageOption, ...this.form }).then(res => {
        this.goodsData = res.list
      }).finally(_ => {
        this.loading = false
      })
    },
    add() {
      this.isAdd = true
      this.visible = true
    },
    update(row) {
      this.isAdd = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dialog.form = deepClone(row)
        this.$refs.dialog.fileList = [{ goodsName: row.goodsName, url: row.pic }]
      })
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
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .stores {
    font-size: 20px;
    margin-bottom: 10px;
  }

  /deep/ .table-img {
    img {
      width: 75%;
    }
  }

  .footer {
    margin: 20px auto;
  }
</style>
