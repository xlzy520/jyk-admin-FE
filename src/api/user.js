import baseRequest from './base'

export default {
  getUserList(data) {
    return baseRequest('/user/list', data)
  },
  deleteUser(id) {
    return baseRequest('/user/delete', id)
  }
}
