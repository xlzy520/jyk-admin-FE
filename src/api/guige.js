import fetch from './base/fetch'

export default {
  getUseTypeList(data) {
    return fetch('/use/type/list', data)
  }
}
