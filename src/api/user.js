import fetch from './base/fetch'

export default {
  getUserList(data) {
    return fetch('/user/list', data)
  },
  markUser(data) {
    return fetch('/user/mark/update', data)
  },
  blackUser(data) {
    return fetch('/user/white/update', data)
  },
  visitTrend(data) {
    return fetch('/user/visit/trend', data)
  },
  getProduceUser(data) {
    return fetch('/user/produce/list', data)
  },
  addProduceUser(data) {
    return fetch('/user/produce/add', data)
  },
  removeProduceUser(data) {
    return fetch('/user/produce/remove', data)
  }
}
