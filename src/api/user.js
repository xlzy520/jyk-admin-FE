import baseRequest from './base'

export default {
  login(data) {
    return baseRequest('/user/login', data)
  },
  getInfo() {
    return baseRequest('/user/info', {}, 'get')
  },
  logout() {
    return baseRequest('/user/logout')
  }
}
