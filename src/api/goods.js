import baseRequest from './base'

export default {
  getGoods(data) {
    return baseRequest('/goods/list', data)
  },
  addGoods(data) {
    return baseRequest('/goods/add', data)
  },
  updateGoods(data) {
    return baseRequest('/goods/update', data)
  },
  deleteGoods(id) {
    return baseRequest('/goods/delete', id)
  },
  changeStatusGoods(ids) {
    return baseRequest('/goods/changeStatus', ids)
  }
}
