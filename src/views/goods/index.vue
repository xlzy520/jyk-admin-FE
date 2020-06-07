<template>
  <div v-loading="loading" class="app-container">
    <add-button @add="add"/>
    <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
<!--      <el-form-item prop="keyword" label="餐具类型">-->
<!--        <el-input v-model="searchForm.keyword" max-length="11" placeholder="餐具类型" />-->
<!--      </el-form-item>-->
      <el-form-item label="商品类型：" prop="useTypeId">
        <el-select v-model="searchForm.useTypeId">
          <el-option label="全部" value="" />

          <el-option
              v-for="option in useType"
              :key="option.useType"
              :value="option.useTypeId"
              :label="option.useType"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="所属学校" prop="schoolId">
        <el-select v-model="searchForm.schoolId">
          <el-option label="全部" value="" />
          <el-option
              v-for="school in schools"
              :key="school.schoolId"
              :value="school.schoolId"
              :label="school.schoolName"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
            type="primary"
            icon="el-icon-search"
            @click="fetchData"
        >查询</el-button>
        <el-button type="info" @click="resetForm">清空</el-button>
      </el-form-item>
    </el-form>
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
    <good-dialog v-if="visible" ref="dialog" :schools="schools" :useType="useType" :is-add="isAdd" @close="close" @fetchData="fetchData"/>
  </div>
</template>

<script>
import AddButton from '../../components/AddButton'
import goodsApi from '../../api/goods'
import { deepClone } from '../../utils/index'
import pagination from '../../mixins/pagination'
import GoodDialog from './goodDialog'
import schoolApi from "../../api/school";
import guigeApi from "../../api/guige";

export default {
  name: 'GoodsList',
  components: { GoodDialog, AddButton },
  mixins: [pagination],
  data() {
    return {
      searchForm: {
        useTypeId: '',
        schoolId: ''
      },
      useType: [],
      schools: [],
      goodsData: [],
      columns: [
        { label: '名称', prop: 'goodsName', align: 'left' },
        {
          label: '图片', prop: 'pic',
          render: (h, { props: { row }}) => {
            return (
              <el-image src={this.$baseImgUrl + row.littleUrl} fit='fit'>
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
        { label: '地址类型', prop: 'schoolName',render: (h, { props: { row }}) => {
            return (
              <div>
                <el-tag size={'medium'} type={row.schoolId === -9999 ? 'danger' : ''}>
                  {row.schoolId === -9999? '商家' : row.schoolName}</el-tag>
              </div>
            )
          } },
        { label: '添加时间', width: '240', prop: 'saveDate' },
        {
          label: '操作', prop: 'region', width: 240,
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <span onClick={() => this.update(row)}>编 辑</span>
                <el-divider direction={'vertical'}/>
                <span onClick={() => this.copy(row)}>复 制</span>
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
    this.fetchSchoolData()
    this.getUseTypeList()
  },
  methods: {
    getUseTypeList() {
      this.dialogLoading = true
      guigeApi.getUseTypeList().then(res => {
        this.useType = res||[]
      }).finally(() => {
        this.dialogLoading = false
      })
    },

    fetchSchoolData() {
      schoolApi.getSchool({
        pageSize: 1000,
        pageIndex: 1
      }).then(res => {
        this.schools = res.list
      })
    },

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
            v.sale = status
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
      goodsApi.getGoods({ ...this.pageOption,pageSize: 100, ...this.searchForm }).then(res => {
        this.goodsData = res.list
      }).finally(_ => {
        this.loading = false
      })
    },
    add() {
      this.isAdd = true
      this.visible = true
    },
    copy(row) {
      this.isAdd = true
      this.visible = true
      this.$nextTick(() => {
        if (row.priceStr.includes('~')) {
          const priceStrMap = row.priceStr.split('~')
          row.priceStr1 = priceStrMap[0]
          row.priceStr2 = priceStrMap[1]
        }
        if (row.goodsId) {
          delete row.goodsId
        }
        if (!row.schoolId) {
          row.schoolId = ''
        }
        this.$refs.dialog.form = Object.assign(this.$refs.dialog.form, deepClone(row))
        this.$refs.dialog.fileList = row.fileUrls.map(v=>{
          return { name: row.goodsName, url: 'https://axjieyakang.com/assets/'+v }
        })
      })
    },

    update(row) {
      this.isAdd = false
      this.visible = true
      this.$nextTick(() => {
        if (row.priceStr.includes('~')) {
          const priceStrMap = row.priceStr.split('~')
          row.priceStr1 = priceStrMap[0]
          row.priceStr2 = priceStrMap[1]
        }
        row.schoolId = row.schoolId === 0? '': row.schoolId
        this.$refs.dialog.form = Object.assign(this.$refs.dialog.form, deepClone(row))
        this.$refs.dialog.fileList = row.fileUrls.map(v=>{
          return { name: row.goodsName, url: 'https://axjieyakang.com/assets/'+v }
        })
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
    },
    resetForm() {
      this.$refs.searchForm.resetFields()
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
