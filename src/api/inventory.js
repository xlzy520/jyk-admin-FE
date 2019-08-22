import baseRequest from './base'

export default {
  list(data) {
    return baseRequest('/inventory/list', data)
  },
  update(data) {
    return baseRequest('/inventory/update', data)
  },
  delete(id) {
    return baseRequest('/inventory/delete', id)
  },
  save(ids) {
    return baseRequest('/inventory/save', ids)
  }
}
