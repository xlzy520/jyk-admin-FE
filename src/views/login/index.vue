<template>
  <div class="login-container">
    <div class="bg-animation" v-if="canvas">
      <canvas id="cvs_bg" width="1443" height="596" />
      <canvas id="cvs_key" />
    </div>
    <el-form
      ref="loginForm"
      class="login-form"
      auto-complete="on"
      status-icon
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
    >
      <h3 class="title">洁雅康后台管理</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model.trim="loginForm.username"
          name="username"
          type="text"
          spellcheck="false"
          auto-complete="on"
          maxlength="30"
          clearable
          placeholder="请输入账号"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model.trim="loginForm.password"
          name="password"
          :type="pwdType"
          spellcheck="false"
          maxlength="30"
          clearable
          auto-complete="on"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-button" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { autoRun } from '@/utils/animation/keyDown'
import { CanvasAnimate } from '@/utils/animation/canvasLogin'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: process.env.VUE_APP_USERNAME,
        password: process.env.VUE_APP_USER_PASSWORD
      },
      loginRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码',trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'change' }
        ]
      },
      loading: false,
      eye: 'fa-eye-slash',
      pwdType: 'password',
      canvas: true
    }
  },
  mounted() {
    const canvasAnimate = new CanvasAnimate(document.getElementById('cvs_bg'),
      { length: 100, clicked: true, moveon: true })
    canvasAnimate.Run()
    autoRun()
    // todo 优化登录动画内存释放
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
        this.eye = 'fa-eye'
      } else {
        this.pwdType = 'password'
        this.eye = 'fa-eye-slash'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
            this.$message1000('登录成功', 'success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  beforeDestroy() {
    this.canvas = false
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    /*background: url("../../assets/bg.jpg");*/
    @media screen and (max-width: 960px){
      .login-form{
        width: auto!important;
      }
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 90px auto;
      z-index: 3;
      .login-button{
        width: 100%;
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      user-select: none;
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    #cvs_bg,#cvs_key{
      position: absolute;
    }
    #cvs_bg{
      z-index: 1
    }
  }
</style>
