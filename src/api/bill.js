import fetch from './base/fetch'

export default {
  getBill(data) {
    return fetch('/bill/list', data)
  },
  offlineOrderList(data) {
    return fetch('/bill/offline/order/list', data)
  },
  billStatistics(data) {
    return fetch('/bill/statistics', data)
  },
  getSalesStatistics(data) {
    return fetch('/sales/statistics', data)
  }

}
