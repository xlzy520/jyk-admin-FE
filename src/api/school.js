import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/school/' + url, ...arg)
export default {
  getSchool(data) {
    return fetch('list', data)
  },
  addSchool(data) {
    return fetch('add', data)
  },
  updateSchool(data) {
    return fetch('update', data)
  },
  deleteSchool(id) {
    return fetch('delete', id)
  }
}
