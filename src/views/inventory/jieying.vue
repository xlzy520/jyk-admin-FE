<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="saveDate">
          <el-date-picker
              v-model="searchForm.saveDate"
              type="daterange"
              align="center"
              start-placeholder="添加日期起"
              end-placeholder="添加日期止"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              icon="el-icon-search"
              @click="()=>fetchData(true)"
          >查询</el-button>
          <el-button type="info" @click="resetForm">清空</el-button>
<!--          <el-button type="success" @click="downloadExcel">导出记录</el-button>-->

        </el-form-item>
      </el-form>
    </div>
    <xl-table
        ref="jieyingTable"
        v-loading="loading"
        :index="true"
        border
        :table-data="jieyingList"
        :table-columns="columns"
        :count="count"
        :pageSize="pageOption.pageSize"
        :pageNo="pageOption.pageIndex"
        @change-page="pageChange"
        @size-change="sizeChange"
    />
    <el-dialog
        width="90%"
        title="今日结营详情"
        :close-on-click-modal="true"
        :visible.sync="visible"
        @close="close"
    >
      <xl-table
          ref="jieyingDetailTable"
          border
          show-summary
          :summary-method="getSummaries"
          :table-data="jieyingDetailData"
          :table-columns="jieyingDetailColumns"
          :span-method="objectSpanMethod"
          :row-class-name="tableRowClassName"
      />
    </el-dialog>
  </div>
</template>

<script>
  import AddButton from '../../components/AddButton'
  import schoolApi from '../../api/school'
  import {deepClone, downloadFile} from '../../utils'
  import inventoryApi from "../../api/inventory";
  import pagination from '../../mixins/pagination'
  import axios from "axios";

  export default {
    name: 'School',
    components: { AddButton },
    mixins: [pagination],
    data() {
      return {
        searchForm: {
          saveDate: []
        },
        jieyingList: [],
        jieyingDetailData: [],
        columns: [
          {label: '日期', prop: 'saveDate', align: 'center', width: 100,},
          { label: '餐馆餐具',
            columns:[
              {label: '餐盘', prop: 'Plate',},
              {label: '餐碗', prop: 'Bowl',},
              {label: '筷子', prop: 'Chopsticks',},
              {label: '钢化杯', prop: 'SteelCup',},
            ] },
          {
            label: '学生餐具',
            columns: [
              {label: '不锈钢碗(4.5cm)', width: 160, prop: 'StainlessSteelBowl',},
              {label: '不锈钢勺', prop: 'StainlessSteelSpoon',},
              {label: '不锈钢餐盘(22cm)',width: 160, prop: 'StainlessSteelPlate',},
              {label: '餐碗(18cm)', width: 120,prop: 'Plate18',},
              {label: '餐碗(20cm)', width: 120,prop: 'Plate20',},
            ],
          },

          // {
          //   label: '学校类型',
          //   prop: 'schoolType',
          //   render: (h, { props: { row }}) => {
          //     const schoolMap = {
          //       '幼儿园': 'danger',
          //       '小学': 'warning'
          //     }
          //     return (
          //       <el-tag type={schoolMap[row.schoolType]}><i class='el-icon-school' />{row.schoolType }</el-tag>
          //     )
          //   }
          // },
          // { label: '更新时间',width: 160, prop: 'modifyDate',},
          {
            label: '操作',
            prop: 'region',
            fixed: 'right',
            render: (h, { props: { row }}) => {
              return (
                <div class='table-action'>
                  <span onClick={() => this.detail(row)}>详情</span>
                </div>
              )
            }
          }
        ],
        jieyingDetailColumns: [
          {label: '', prop: 'vehicle', align: 'center'},
          {label: '类型', prop: 'type', align: 'center'},
          {
            label: '餐馆餐具',
            columns: [
              {label: '餐盘', prop: 'Plate',},
              {label: '餐碗', prop: 'Bowl',},
              {label: '筷子', prop: 'Chopsticks',},
              {label: '钢化杯', prop: 'SteelCup',},
            ]
          },
          {
            label: '学生餐具',
            columns: [
              {label: '不锈钢碗(4.5cm)', width: 150, prop: 'StainlessSteelBowl',},
              {label: '不锈钢勺', prop: 'StainlessSteelSpoon',},
              {label: '不锈钢餐盘(22cm)',width: 150, prop: 'StainlessSteelPlate',},
              {label: '餐碗(18cm)', width: 100,prop: 'Plate18',},
              {label: '餐碗(20cm)', width: 100,prop: 'Plate20',},
            ]
          },
        ],
        loading: false,
        visible: false,
        curDetail: {}
      }
    },
    created() {
      this.fetchData()
    },
    methods: {

      fetchData() {
        inventoryApi.settlementList({
          ...this.searchForm,
          ...this.pageOption
        }).then(res=>{
          this.jieyingList = res.list
          this.count = res.count
          console.log(res);
        })
        const res = {
          list: [
            {
              id: '23123123',
              saveDate: '2020-05-13',
              Plate: 121,
              Bowl: 1231,
              Chopsticks: 1231,
              SteelCup: 1323,
              StainlessSteelBowl: 311,
              StainlessSteelSpoon: 132,
              StainlessSteelPlate: 132,
              Plate18: 1,
              modifyDate: '2020-05-13 14:46:20'
            }
          ],
          count: 5
        }
      },
      downloadExcel(){
        axios.post('/market/inventory/settlement/list/export', this.searchForm, {
          responseType: 'blob'
        }).then(res=>{
          const url = URL.createObjectURL(res.data)
          downloadFile(url, '每日结营.xlsx')
        })
      },
      detail(row){
        const startDate = row.saveDate + ' 00:00:00'
        const endDate = row.saveDate + ' 23:59:59'
        inventoryApi.settlementDetail({
          startDate,
          endDate,
          ...this.pageOption
        }).then(res=>{
          this.curDetail = row
          this.visible = true
          this.jieyingDetailData = res
        })
        this.jieyingDetailData1 = [
          {
            id: '1',
            vehicle: '今日生产总数',
            saveDate: '2020-05-13 14:46:20',
            Plate: 1211,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 3111,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },

          {
            id: '10',
            vehicle: 'A车',
            type: '发货',
            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },
          {
            id: '11',
            vehicle: 'A车',
            type: '回收',
            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },
          {
            id: '12',
            vehicle: 'A车',
            type: '结营',
            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },

          {
            id: '20',
            vehicle: 'B车',
            type: '发货',

            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },
          {
            id: '21',
            vehicle: 'B车',
            type: '回收',

            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },
          {
            id: '22',
            vehicle: 'B车',
            type: '结营',

            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },

          {
            id: '30',
            vehicle: 'C车',
            type: '发货',
            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },
          {
            id: '31',
            vehicle: 'C车',
            type: '回收',

            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },
          {
            id: '32',
            vehicle: 'C车',
            type: '结营',

            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },

          {
            id: '40',
            vehicle: 'D车',
            type: '发货',

            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },
          {
            id: '41',
            vehicle: 'D车',
            type: '回收',
            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },
          {
            id: '42',
            vehicle: 'D车',
            type: '结营',
            saveDate: '2020-05-13 14:46:20',
            Plate: 121,
            Bowl: 1231,
            Chopsticks: 1231,
            SteelCup: 1323,
            StainlessSteelBowl: 311,
            StainlessSteelSpoon: 132,
            StainlessSteelPlate: 132,
            Plate18: 1,
            modifyDate: '2020-05-13 14:46:20'
          },
        ]
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex === 0) {
            return {
              rowspan: 1,
              colspan: 1
            };
          } else {
            if (rowIndex % 3 === 1) {
              return {
                rowspan: 3,
                colspan: 1
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          }
        }
      },
      tableRowClassName({row, rowIndex}) {
        if (row.type === '结营') {
          return 'jieying-row'
        }
        return '';
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '今日累计结营';
            return;
          }
          sums[index] = this.curDetail[column.property]
          const values = data.map(item => Number(item[column.property]));
          // if (!values.every(value => isNaN(value))) {
          //   sums[index] = values.reduce((prev, curr) => {
          //     const value = Number(curr);
          //     if (!isNaN(value)) {
          //       return prev + curr;
          //     } else {
          //       return prev;
          //     }
          //   }, 0);
          //   sums[index] += ' 元';
          // } else {
          //   sums[index] = 'N/A';
          // }
        });

        return sums;
      },
      close() {
        this.visible = false
        this.curDetail = {}
        this.resetForm()
      },
      resetForm() {
        this.$refs.searchForm.resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-tag{
    font-size: 16px;
  }
  /deep/ .el-table{
    .jieying-row{
      background: #f0f9eb;
    }
  }

</style>
