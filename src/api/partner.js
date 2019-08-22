import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/partner/' + url, ...arg)
export default {
  getPartner(data) {
    return fetch('list', data)
  },
  deletePartner(id) {
    return fetch('delete', id)
  },
  addPartner(data) {
    return fetch('add', data)
  },
  updatePartner(data) {
    return fetch('update', data)
  }
}
