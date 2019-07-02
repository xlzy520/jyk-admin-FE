import baseRequest from './base'

export default {
  getFiles(data) {
    return baseRequest('/file/list', data)
  },
  updateFiles(data) {
    return baseRequest('/file/update', data)
  },
  deleteFiles(id) {
    return baseRequest('/file/delete', id)
  }
}
