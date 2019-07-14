import baseRequest from './base'

export default {
  getUseTypeList(data) {
    return baseRequest('/use/type/list', data)
  }
}
