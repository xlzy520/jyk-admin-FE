import baseFetch from './base/fetch'
export default {
  addProduce(data) {
    return baseFetch('/produce/add', data)
  },
  getProduceList(data) {
    return baseFetch('/produce/list', data)
  },
  updateProduce(data) {
    return baseFetch('/produce/update', data)
  },
  getProduceCount(data) {
    return baseFetch('/produce/count', data)
  }
}
