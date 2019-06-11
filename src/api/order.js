import baseRequest from './base'

export default {
  getOrder(data) {
    return baseRequest('/order/list', data)
  },
  updateOrder(data) {
    return baseRequest('/order/update', data)
  },
  deleteOrder(id) {
    return baseRequest('/order/delete', id)
  },
  orderDetail(id) {
    return baseRequest('/order/detail', id)
  },
  fahuo(id) {
    return baseRequest('/order/setFaHuo', id)
  },
  orderClose(id) {
    return baseRequest('/order/close', id)
  }
}
