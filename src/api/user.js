import fetch from './base/fetch'

export default {
  getUserList(data) {
    return fetch('/user/list', data)
  }
}
