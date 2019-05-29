import baseRequest from './base'

export default {
  login(data) {
    return baseRequest('/user-admin/login', data)
  },
  getInfo() {
    return baseRequest('/user-admin/info', {}, 'get')
  },
  logout() {
    return baseRequest('/user-admin/logout')
  }
}
