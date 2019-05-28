import baseRequest from './base'

export default {
  getStaff(data) {
    return baseRequest('/staff/list', data)
  },
  addStaff(data) {
    return baseRequest('/staff/add', data)
  },
  updateStaff(data) {
    return baseRequest('/staff/update', data)
  },
  deleteStaff(id) {
    return baseRequest('/staff/delete', id)
  }
}
