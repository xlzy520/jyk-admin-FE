import baseRequest from './base'

export default {
  getPartner(data) {
    return baseRequest('/partner/list', data)
  },
  deletePartner(id) {
    return baseRequest('/partner/delete', id)
  },
  addPartner(data) {
    return baseRequest('/partner/add', id)
  },
  updatePartner(data) {
    return baseRequest('/partner/update', id)
  },
}
