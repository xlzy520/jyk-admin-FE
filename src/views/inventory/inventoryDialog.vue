<template>
  <el-dialog
    :width="width"
    :title="isAdd?'增加进销存记录' : '更新进销存记录'"
    :close-on-click-modal="true"
    :visible="true"
    @close="close"
  >
    <div v-loading="loading">
      <el-form v-if="!isSmallScreen" ref="form" :model="formData" label-width="80px" :rules="rules">
        <el-row>
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
        <el-form-item label="默认地址" v-if="formData.userId">
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
        <div class="write-container">
          <el-row>
            <el-col :span="spanHeader" class="table-cell-title">类型/餐具</el-col>
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
      <el-form v-else ref="form" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="用户类型" prop="userType">
          <el-radio-group v-model="userType" @change="userTypeChange">
            <el-radio-button :label="0">餐馆</el-radio-button>
            <el-radio-button :label="1">学校</el-radio-button>
          </el-radio-group>
        </el-form-item>
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
        <el-form-item label="默认地址" v-if="formData.userId">
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
  import schoolApi from '../../api/school'
  const initForm = {
    userId: '',
    specsId: '',
    schoolId: '',
    useTypeId: '',
  }
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
        userType: 0,
        tableware: [],
        tablewareData: {
          recoveryDetail: ['', '', '', ''],
          lossyDetail: ['', '', '', '']
        },
        schoolList: [],
        userList: [],
        tablewareList: [],
        specsList: [],
        curTableWare: {
          useType: ''
        },
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
      }
    },
    methods: {
      myFilter(list){
        let arr = ['餐馆餐具','宴席餐具']
        if (!this.userType) {
          return list.filter(v=>arr.includes(v.useType))
        }
        return list.filter(v=>!arr.includes(v.useType))
      },
      getSchoolList(){
        this.loading = true
        schoolApi.getSchool({
          pageIndex: 1,
          pageSize: 100
        }).then(res => {
          this.schoolList = res.list
        }).finally(() => {
          this.loading = false
        })
      },
      userTypeChange(){
        this.formData.useTypeId = ''
      },
      userChange (){
        this.getDefaultAddress()
      },
      specChange(val){
        this.specsId = val
        this.getspecsDetail()
      },
      tablewareChange(val){
        if (!this.isAdd) {
          this.formData.specsId = ''
        }
        this.curTableWare = this.tablewareList.find(v=>v.useTypeId === val)
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
      getUserList(){
        inventoryApi.userList().then(res => {
          this.userList = res
        })
      },
      getTablewareList(){
        inventoryApi.tablewareList().then(res => {
          this.tablewareList = res
        })
      },
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
            let tablewareData = JSON.parse(JSON.stringify(this.tablewareData))
            this.tableware.map((v,index)=>{
              for (const item in this.tablewareData) {
                tablewareData[item][index] = {
                  tablewareId: v.tablewareId,//餐具Id
                  quantity:  this.tablewareData[item][index]||0//数量
                }
              }
            })
            const param = {
              ...this.formData,
              ...tablewareData,
              inventoryType: 1
            }
            console.log(this.tablewareData);
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
      }
    },
    mounted() {
      this.getUserList()
      this.getTablewareList()
      this.getSchoolList()
      if (!this.isAdd) {
        this.getDefaultAddress()
      }
    }
  }
</script>

<style lang="scss" scoped>
   .write-container {
    border-left: 1px solid #cbcbcb;
  }
   @media screen and (min-width: 960px){
     /deep/ .el-select{
       width: 300px;
     }
   }
</style>
