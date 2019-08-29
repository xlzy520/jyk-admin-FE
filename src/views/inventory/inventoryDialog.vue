<template>
  <el-dialog
    width="70%"
    :title="isAdd?'增加进销存记录' : '更新进销存记录'"
    :close-on-click-modal="true"
    :visible="true"
    @close="close"
  >
    <div v-loading="loading">
      <el-form ref="form" :model="inventoryForm" label-width="80px" :rules="rules">
        <el-form-item label="地址" filterable prop="address">
          <el-select v-model="inventoryForm.address" placeholder="请选择地址">
            <el-option label="安乡五中" value="安乡五中"/>
            <el-option label="某某餐馆" value="某某餐馆"/>
          </el-select>
        </el-form-item>
        <el-form-item label="餐具类型" prop="inventoryType">
          <el-select v-model="inventoryForm.inventoryType" placeholder="请选择类型">
            <el-option label="宴席" value="幼儿园"/>
            <el-option label="餐馆" value="小学"/>
          </el-select>
        </el-form-item>
        <div class="write-container">
          <el-row>
            <el-col :span="spanHeader" class="table-cell-title">类型/餐具</el-col>
            <el-col v-for="tablewareItem in tableware" :span="span" class="table-cell-title">
              {{tablewareItem.label}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="spanHeader" class="table-cell">回收</el-col>
            <el-col :span="span" class="table-cell" v-for="(tablewareItem, index) in tableware"
                    :key="tablewareItem.label">
              <el-input v-model="tablewareData.recoveryDetail[index]"></el-input>
              {{tablewareData.recoveryDetail}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="spanHeader" class="table-cell">损耗</el-col>
            <el-col :span="span" class="table-cell" v-for="(tablewareItem, index) in tableware"
                    :key="tablewareItem.label">
              <el-input v-model="tablewareData.lossyDetail[index]"></el-input>
              {{tablewareData.recoveryDetail}}
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import inventoryApi from '../../api/inventory'

  export default {
    name: 'inventoryDialog',
    props: {
      isAdd: {
        type: Boolean,
        default: false,
        required: true
      }
    },
    data() {
      return {
        loading: false,
        tableware: [
          {label: '餐盘', id: 'a'},
          {label: '餐碗', id: 'b'},
          {label: '筷子', id: 'c'},
          {label: '钢化杯', id: 'd'},
        ],
        tablewareData: {
          recoveryDetail: ['', '', '', ''],
          lossyDetail: ['', '', '', '']
        },
        inventoryForm: {
          inventoryName: '',
          address: '',
          inventoryType: ''
        },
        rules: {
          inventoryName: [
            {required: true, message: '请输入名称'},
            {min: 2, max: 30, message: '长度在 2 到 30 个字符'}
          ],
          address: [
            {required: true, message: '请输入地址'},
            {min: 2, max: 100, message: '长度在 2 到 100 个字符'}
          ],
          inventoryType: [
            {required: true, message: '请选择一个类型'}
          ]
        }
      }
    },
    computed: {
      span() {
        let len = this.tableware.length
        if (len < 5 && len > 2) {
          return (24 - len) / len
        } else if (len === 2) {
          return 10
        } else {
          return 6
        }
      },
      spanHeader() {
        let len = this.tableware.length
        if (len < 5 && len > 2) {
          return len
        } else if (len === 2) {
          return 4
        } else {
          return 6
        }
      },
    },
    methods: {
      resetForm() {
        this.$refs.form.resetFields()
      },
      close() {
        this.$emit('close');
        this.resetForm()
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const param = {
              ...this.inventoryForm,
              ...this.pageOption
            }
            const getFn = this.isAdd ? inventoryApi.addSchool(param) : inventoryApi.updateSchool(param)
            getFn.then(res => {
              this.$message1000('提交成功', 'success')
              this.close()
              this.fetchData()
            })
          } else {
            return false
          }
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
   .write-container {
    border-left: 1px solid #cbcbcb;
    border-top: 1px solid #cbcbcb;
  }
</style>
