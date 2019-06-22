import baseRequest from './base'
import axios from 'axios'

export default {
  login(data) {
    return axios({
      method: 'post',
      url: '/market/login',
      data: data,
      // 转换数据的方法
      transformRequest: [
        function(data) {
          let ret = ''
          for (const it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          ret = ret.substring(0, ret.length - 1)
          return ret
        }
      ],
      // 设置请求头
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  getInfo() {
    return baseRequest('/info')
  },
  logout() {
    return baseRequest('/logout')
  }
}
