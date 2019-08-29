<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div class="info-container">
        <span class="display_name"> 您的角色:{{ format(userData.roleCode) }}</span>
        <span class="display_name"> 您的姓名:{{ userData.username }}</span>
        <span style="font-size:36px;padding-top:20px;display:inline-block;">欢迎</span>
      </div>
    </div>
    <div>
      <img :src="emptyGif" class="emptyGif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardEditor',
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  methods: {
    format(role) {
      const roleMap = {
        'staff': '员工',
        'admin': '管理员',
        'super': '超级管理员',
      }
      return roleMap[role]
    }
  },
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      display: flex;
      flex-direction: column;
      position: relative;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 36px;
        line-height: 48px;
        color: #212121;
      }
    }
  }
</style>
