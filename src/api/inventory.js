import baseFetch from './base/fetch'

export default {
  list(data) {
    return baseFetch('/inventory/list', data)
  },
  update(data) {
    return baseFetch('/inventory/update', data)
  },
  delete(id) {
    return baseFetch('/inventory/delete', id)
  },
  save(ids) {
    return baseFetch('/inventory/save', ids)
  }
}
