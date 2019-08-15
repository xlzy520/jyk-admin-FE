import baseFetch from './base/fetch'
export default {
  getCompanyInfo(data) {
    return baseFetch('/company/getInfo', data)
  },
  updateCompanyInfo(data) {
    return baseFetch('/partner/update', data)
  }
}
