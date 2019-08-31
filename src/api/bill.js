import fetch from './base/fetch'

export default {
  getBill(data) {
    return fetch('/bill/list', data)
  },
}
