import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/payProcess/' + url, ...arg)
export default {
  getPayProcess(data) {
    return fetch('list', data)
  },
  addPayProcess(data) {
    return fetch('add', data)
  },
  updatePayProcess(data) {
    return fetch('update', data)
  },
  deletePayProcess(data) {
    return fetch('delete', data)
  }
}
