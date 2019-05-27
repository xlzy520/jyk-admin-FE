import baseRequest from './base'

export default {
  logout() {
    return baseRequest('/transaction/list')
  }
}
