import fetch from './base/fetch'

export default {
  getPayOnline(data) {
    return fetch('/pay-online/list', data)
  },
  getPayOffline(data) {
    return fetch('/pay-offline/list', data)
  },
  updatePayOffline(data) {
    return fetch('/pay-offline/update', data)
  },
  addPayOffline(data) {
    return fetch('/pay-offline/add', data)
  }
}
