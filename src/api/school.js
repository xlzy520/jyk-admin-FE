import baseRequest from './base'

export default {
  getSchool(data) {
    return baseRequest('/school/list', data)
  },
  addSchool(data) {
    return baseRequest('/school/add', data)
  },
  updateSchool(data) {
    return baseRequest('/school/update', data)
  },
  deleteSchool(id) {
    return baseRequest('/school/delete', id)
  }
}
