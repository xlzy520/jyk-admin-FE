import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { resetRouter } from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: 'https://www.easy-mock.com/mock/5cdb6b1c196b3a1793f9fcad/jyk-admin',
  withCredentials: true,
  timeout: 10 * 1000
})

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.success) {
      Message({
        message: res.message || 'error',
        type: 'error',
        duration: 1.5 * 1000
      })
      // token已过期
      if (res.code === 1027) {
        MessageBox.confirm('Token 过期了，您可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetRouter()
          router.push('/login')
          location.reload()
        })
      }
      return Promise.reject(res)
    } else {
      return res.data
    }
  },
  error => {
    error.message = error.message === 'timeout of 10000ms exceeded' ? '连接服务器超时！' : error.message;
    Message({
      message: error.message,
      type: 'error',
      duration: 1.5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
