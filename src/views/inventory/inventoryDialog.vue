<template>
  <el-dialog
    :width="width"
    :title="isAdd?'增加进销存记录' : '更新进销存记录'"
    :close-on-click-modal="true"
    :visible="true"
    @close="close"
  >
    <div v-loading="loading">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="生产数据" name="3" v-if="isAdd || updateType == 3"></el-tab-pane>
        <el-tab-pane label="发货数据" name="4" v-if="isAdd || updateType == 4"></el-tab-pane>
        <el-tab-pane label="回收数据" name="1" v-if="isAdd || updateType == 1"></el-tab-pane>
      </el-tabs>

      <el-form v-if="!isSmallScreen" ref="form" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="所属车辆" prop="vehicle" v-if="activeName === '4' || activeName==='1'">
          <el-select v-model="formData.vehicle" placeholder="请选择所属车辆">
            <el-option v-for="car in cars" :label="car.carNum + '——'+car.mark" :value="car.carId"/>
          </el-select>
        </el-form-item>
        <el-row v-if="!isProduce">
          <el-col :span="12">
            <el-form-item label="用户类型" prop="userType">
              <el-radio-group v-model="userType" @change="userTypeChange">
                <el-radio-button :label="0">餐馆</el-radio-button>
                <el-radio-button :label="1">学校</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户" prop="userId" v-if="!userType">
              <el-select v-model="formData.userId" placeholder="请选择用户,可筛选查询" filterable @change="userChange">
                <el-option v-for="user in userList" :key="user.userId" :label="user.username" :value="user.userId"/>
              </el-select>
            </el-form-item>
            <el-form-item label="学校" prop="schoolId" v-else>
              <el-select v-model="formData.schoolId" placeholder="请选择学校" filterable>
                <el-option v-for="school in schoolList" :key="school.schoolId"
                           :label="school.schoolName" :value="school.schoolId"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="默认地址" v-if="!isProduce || formData.userId">
          姓名：{{defaultAddress.consignee}}<div style="width: 40px;display: inline-block"></div>
          手机号：{{defaultAddress.mobile}}<div style="width: 40px;display: inline-block"></div>
          地址：{{defaultAddress.address}}
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="餐具类型" prop="useTypeId">
              <el-select v-model="formData.useTypeId" placeholder="请选择餐具类型" @change="tablewareChange">
                <el-option v-for="tableware in myFilter(tablewareList)" :key="tableware.useTypeId"
                           :label="tableware.useType" :value="tableware.useTypeId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="specsId" v-if="curTableWare.useType === '幼儿园餐具'">
              <el-select v-model="formData.specsId" placeholder="请选择规格类型" @change="specChange">
                <el-option v-for="spec in specsList" :key="spec.specsId"
                           :label="spec.specsName + ':'+spec.specsStr" :value="spec.specsId"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="中转箱" prop="boxNum">
            <el-input v-model.number="formData.boxNum"></el-input>
          </el-form-item>
        </el-row>
        <div class="write-container">
          <el-row>
            <el-col :span="spanHeader" class="table-cell-title">类型/餐具</el-col>
            <el-col v-for="tablewareItem in tableware" :span="span" class="table-cell-title">
              {{tablewareItem.tablewareName}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="spanHeader" class="table-cell">{{firstCol}}</el-col>
            <el-col :span="span" class="table-cell" v-for="(tablewareItem, index) in tableware"
                    :key="tablewareItem.label">
              <el-input v-model.number="tablewareData.recoveryDetail[index]"></el-input>
            </el-col>
          </el-row>
          <el-row v-if="activeName === '1'">
            <el-col :span="spanHeader" class="table-cell">损耗</el-col>
            <el-col :span="span" class="table-cell" v-for="(tablewareItem, index) in tableware"
                    :key="tablewareItem.label">
              <el-input v-model.number="tablewareData.lossyDetail[index]"></el-input>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <el-form v-else ref="form" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="用户类型" prop="userType" v-if="!isProduce">
          <el-radio-group v-model="userType" @change="userTypeChange">
            <el-radio-button :label="0">餐馆</el-radio-button>
            <el-radio-button :label="1">学校</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户" prop="userId" v-if="!isProduce || !userType">
          <el-select v-model="formData.userId" placeholder="请选择用户,可筛选查询" filterable @change="userChange">
            <el-option v-for="user in userList" :key="user.userId" :label="user.username" :value="user.userId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="学校" prop="schoolId" v-if="!isProduce || userType">
          <el-select v-model="formData.schoolId" placeholder="请选择学校" filterable>
            <el-option v-for="school in schoolList" :key="school.schoolId"
                       :label="school.schoolName" :value="school.schoolId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="默认地址" v-if="!isProduce || formData.userId">
          姓名：{{defaultAddress.consignee}}<div style="width: 40px"></div>
          手机号：{{defaultAddress.mobile}}<div style="width: 40px"></div>
          地址：{{defaultAddress.address}}
        </el-form-item>
        <el-form-item label="餐具类型" prop="useTypeId">
          <el-select v-model="formData.useTypeId" placeholder="请选择餐具类型" @change="tablewareChange">
            <el-option v-for="tableware in myFilter(tablewareList)" :key="tableware.useTypeId"
                       :label="tableware.useType" :value="tableware.useTypeId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="specsId" v-if="curTableWare.useType === '幼儿园餐具'">
          <el-select v-model="formData.specsId" placeholder="请选择规格类型" @change="specChange">
            <el-option v-for="spec in specsList" :key="spec.specsId"
                       :label="spec.specsName + ':'+spec.specsStr" :value="spec.specsId"/>
          </el-select>
        </el-form-item>
        <div class="write-container">
          <el-row>
            <el-col :span="spanHeader" class="table-cell-title">餐具</el-col>
            <el-col v-for="tablewareItem in tableware" :span="span" class="table-cell-title">
              {{tablewareItem.tablewareName}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="spanHeader" class="table-cell">回收</el-col>
            <el-col :span="span" class="table-cell" v-for="(tablewareItem, index) in tableware"
                    :key="tablewareItem.label">
              <el-input v-model.number="tablewareData.recoveryDetail[index]"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="spanHeader" class="table-cell">损耗</el-col>
            <el-col :span="span" class="table-cell" v-for="(tablewareItem, index) in tableware"
                    :key="tablewareItem.label">
              <el-input v-model.number="tablewareData.lossyDetail[index]"></el-input>
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
  import carApi from '../../api/cars'
  import {deepClone} from "../../utils";

  const initForm = {
    userId: '',
    specsId: '',
    schoolId: '',
    useTypeId: '',
    boxNum: '',
    vehicle: ''
  }
  export default {
    name: 'inventoryDialog',
    props: {
      isAdd: {
        type: Boolean,
        default: false,
        required: true
      },
      schoolList:{
        type: Array,
        default: false,
        required: true
      },
      userList:{
        type: Array,
        default: false,
        required: true
      },
      tablewareList:{
        type: Array,
        default: false,
        required: true
      },
    },
    data() {
      return {
        activeName: '3',
        loading: false,
        userType: 0,
        tableware: [],
        tablewareData: {
          recoveryDetail: ['', '', '', ''],
          lossyDetail: ['', '', '', '']
        },
        specsList: [],
        curTableWare: {
          useType: ''
        },
        cars: [],
        updateType: '',
        defaultAddress: {},
        formData: initForm,
        rules: {
          userId: [
            this.$rules.required('请选择用户', 'change'),
          ],
          schoolId: [
            this.$rules.required('请选择学校', 'change'),
          ],
          useTypeId: [
            this.$rules.required('请选择餐具类型', 'change'),
          ],
          specsId: [
            this.$rules.required('请选择规格', 'change'),
          ],
          vehicle: [
            this.$rules.required('请选择所属车辆', 'change'),
          ],
          boxNum: [
            this.$rules.required('请输入中转箱数量', 'change'),
          ],
          num: [
            // this.$rules.required('请输入数量', 'change'),
            // {type: 'number',message: '请输入数字'}
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
      width(){
        if (window.innerWidth< 960) {
          return '98vw'
        }
        return '70%'
      },
      isSmallScreen(){
        return window.innerWidth< 960
      },
      isProduce(){
        return this.activeName === '3'
      },
      firstCol(){
        if (this.isProduce) {
          return '生产'
        } else if (this.activeName === '4') {
          return '发货'
        } else if (this.activeName === '1') {
          return '回收'
        }
      }
    },
    methods: {
      getCars(){
        carApi.getCar().then(res=>{
          this.cars = res
        })
      },
      handleTabClick(){
        this.resetForm()
      },
      myFilter(list){
        let arr = ['餐馆餐具','宴席餐具']
        // let all = ['学生餐具', '幼儿园餐具', '餐馆餐具', '宴席餐具']
        if (this.isProduce) {
          return list
        }
        if (!this.userType) {
          return list.filter(v=>arr.includes(v.useType))
        }
        return list.filter(v=>!arr.includes(v.useType))
      },
      userTypeChange(){
        this.formData.userId = null
        this.formData.specsId = ''
        this.formData.useTypeId = ''
        this.curTableWare.useType = ''
      },
      userChange (){
        this.getDefaultAddress()
      },
      specChange(val){
        this.specsId = val
        this.getspecsDetail()
      },
      tablewareChange(val){
        this.formData.specsId = ''
        this.setSpecsList(val)
      },
      setSpecsList(val){
        this.curTableWare = deepClone(this.tablewareList).find(v=>v.useTypeId === val)
        if (this.curTableWare.useType === '幼儿园餐具') {
          this.specsList = this.curTableWare.specsList
        } else {
          this.formData.specsId = this.curTableWare.specsList.find(v=>v.specsStr.includes('*1')).specsId
          this.getspecsDetail()
        }
      },
      getspecsDetail(){
        this.loading = true
        inventoryApi.tablewareDetail({
          specsId: this.formData.specsId
        }).then(res => {
          this.tableware = res
          if (this.isAdd) {
            this.tablewareData.lossyDetail = new Array(res.length).fill('')
            this.tablewareData.recoveryDetail = new Array(res.length).fill('')
          }
        }).finally(() => {
          this.loading = false
        })
      },
      resetForm() {
        this.$refs.form.resetFields()
      },
      close() {
        this.$emit('close');
        this.updateType = ''
        this.resetForm()
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let tablewareData = deepClone(this.tablewareData)
            if (this.isProduce) {
              this.tableware.map((v,index)=>{
                for (const item in this.tablewareData) {
                  tablewareData[item][index] = {
                    tablewareId: v.tablewareId,//餐具Id
                    quantity:  this.tablewareData[item][index]||0//数量
                  }
                }
              })
            } else {
              this.tableware.map((v,index)=>{
                for (const item in this.tablewareData) {
                  tablewareData[item][index] = {
                    tablewareId: v.tablewareId,//餐具Id
                    quantity:  this.tablewareData[item][index]||0//数量
                  }
                }
              })
            }
            // if (this.isProduce) {
            //   delete tablewareData.lossyDetail
            // }

            const param = {
              ...this.formData,
              ...tablewareData,
              inventoryType: this.activeName
            }
            const service = this.isAdd ? inventoryApi.save(param) : inventoryApi.update(param)
            service.then(res => {
              this.$message1000('提交成功', 'success')
              this.close()
            })
          } else {
            return false
          }
        })
      },
      getDefaultAddress(){
        inventoryApi.defaultAddress({
          userId: this.formData.userId
        }).then(res => {
          if (res) {
            this.defaultAddress = res
          }
        })
      },
      edit(cloneRow){
        let tablewareData= {
          recoveryDetail: [],
          lossyDetail: []
        }
        cloneRow.inventoryDetailList.map(v=>{
          if (v.inventoryName === '回收') {
            v.inventoryDetail.map((d,index)=>{
              tablewareData.recoveryDetail[index] = d.quantity
            })
          } else {
            v.inventoryDetail.map((d,index)=>{
              tablewareData.lossyDetail[index] = d.quantity
            })
          }
        })
        this.formData = cloneRow
        this.userType = ['餐馆餐具','宴席餐具'].includes(cloneRow.useType)? 0: 1
        this.tablewareData = tablewareData
        this.getspecsDetail()
        this.setSpecsList(cloneRow.useTypeId)
        if (cloneRow.userId) {
          this.getDefaultAddress()
        }
      }
    },
    mounted() {
      this.getCars()
    }
  }
</script>

<style lang="scss" scoped>
   .write-container {
    border-left: 1px solid #cbcbcb;
  }
   /deep/ .el-dialog__body{
     padding: 0 20px 20px;
   }
   @media screen and (min-width: 960px){
     /deep/ .el-select{
       width: 300px;
     }
     /deep/ .el-form-item__content .el-input{
       width: 300px;
     }
   }
</style>
