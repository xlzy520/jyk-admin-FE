<template>
  <div class="company" v-loading="loading">
    <h3>生产数据填报权限</h3>
    <el-form ref="form" label-width="120px">
      <el-form-item label="授权员工" prop="partnersName">
        <el-select v-model="grantUsers" multiple placeholder="请选择" @change="addUser">
          <el-option
              v-for="item in staffData"
              :key="item.userId"
              :label="item.username"
              :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import userApi from '../../api/user'
  import staffApi from '../../api/staff'

  export default {
    name: 'Company',
    data() {
      return {
        submitLoading: false,
        loading: false,
        grantUsers: [],
        cacheGrantUsers: [],
        staffData: []
      }
    },

    created() {
      this.fetchGrantUsers();
      this.fetchStaff()
    },
    methods: {
      fetchStaff(){
        this.loading = true
        staffApi.getStaff({
          pageIndex: 1,
          pageSize: 1000
        }).then(res => {
          this.staffData = res.list
        }).finally(_ => {
          this.loading = false
        })
      },
      fetchGrantUsers() {
        this.loading = true
        userApi.getProduceUser().then(res => {
          this.grantUsers = res.map(v=> v.userId)
          this.cacheGrantUsers = this.grantUsers
        }).finally(() => {
          this.loading = false
        })
      },
      addUser(userIds) {
        const userId = userIds[userIds.length - 1]
        if (userIds.length > this.cacheGrantUsers.length){
          this.loading = true
          userApi.addProduceUser({userId}).then(res => {
            this.$message1000('添加授权成功', 'success')
            this.fetchGrantUsers()
          }).catch(() => {
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.removeUser(userId || this.cacheGrantUsers[0])
        }
      },
      removeUser(userId) {
        this.loading = true
        userApi.removeProduceUser({userId}).then(res => {
          this.$message1000('取消授权成功', 'success')
          this.fetchGrantUsers()
        }).catch(() => {
        }).finally(() => {
          this.loading = false
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .company{
    width: 80%;
    margin: 20px auto 0;
    padding: 20px 40px;
    box-shadow: #e8e8e8 5px 5px 10px 5px;
  }
  /deep/ .el-select{
    width: 100%;
  }
</style>
