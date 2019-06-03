import baseRequest from './base'

export default {
  getPartner(data) {
    return baseRequest('/partner/list', data)
  },
  addPartner(data) {
    return baseRequest('/partner/add', data)
  },
  updatePartner(data) {
    return baseRequest('/partner/update', data)
  },
  deletePartner(id) {
    return baseRequest('/partner/delete', id)
  }
}
