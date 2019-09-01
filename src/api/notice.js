import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/notice/mobile/' + url, ...arg)
export default {
  getNotice(data) {
    return fetch('list', data)
  },
  deleteNotice(data) {
    return fetch('delete', data)
  },
  addNotice(data) {
    return fetch('save', data)
  },
  updateNotice(data) {
    return fetch('update', data)
  }
}
