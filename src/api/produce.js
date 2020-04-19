import baseFetch from './base/fetch'
export default {
  getProduceAuthUser(data) {
    return baseFetch('/produce/authUserList', data)
  },
  updateCompanyInfo(data) {
    return baseFetch('/partner/update', data)
  }
}
