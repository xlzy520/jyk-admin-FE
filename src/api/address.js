import baseRequest from './base'

export default {
  getAddress(data) {
    return baseRequest('/address/list', data)
  },
  updateAddress(data) {
    return baseRequest('/address/update', data)
  },
  deleteAddress(id) {
    return baseRequest('/address/delete', id)
  }
}
