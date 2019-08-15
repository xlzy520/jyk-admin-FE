import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('staff/' + url, ...arg)
export default {
  getStaff(data) {
    return fetch('list', data)
  },
  addStaff(data) {
    return fetch('add', data)
  },
  updateStaff(data) {
    return fetch('update', data)
  },
  deleteStaff(id) {
    return fetch('delete', id)
  }
}
