import baseRequest from './base'

export default {
  login(data) {
    return baseRequest('/login', data, 'formdata')
  },
  getInfo() {
    return baseRequest('/info')
  },
  logout() {
    return baseRequest('/logout')
  }
}
