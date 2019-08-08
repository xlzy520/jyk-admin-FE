import baseRequest from './base'

export default {
  getAddress(data) {
    return baseRequest('/address/list', data)
  },
  updateAddress(data) {
    return baseRequest('/address/update', data)
  },
  deleteAddress(data) {
    return baseRequest('/address/delete', data)
  }
}
