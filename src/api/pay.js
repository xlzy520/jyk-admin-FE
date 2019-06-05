import baseRequest from './base'

export default {
  getPayOnline(data) {
    return baseRequest('/pay-online/list', data)
  },
  getPayOffline(data) {
    return baseRequest('/pay-offline/list', data)
  },
  updatePayOffline(data) {
    return baseRequest('/pay-offline/update', data)
  },
  addPayOffline(id) {
    return baseRequest('/pay-offline/add', id)
  }
}
