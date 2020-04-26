import fetch from './base/fetch'

export default {
  login(data) {
    return fetch('/login', data, 'formdata')
  },
  getInfo() {
    return fetch('/info')
  },
  logout() {
    return fetch('/logout')
  }
}
