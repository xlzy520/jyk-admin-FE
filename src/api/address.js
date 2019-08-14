import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/address/' + url, ...arg)
export default {
  getAddress(data) {
    return fetch('list', data)
  },
  updateAddress(data) {
    return fetch('update', data)
  },
  deleteAddress(data) {
    return fetch('delete', data)
  }
}
