import baseRequest from './base'

export default {
  transactionList() {
    return baseRequest('/transaction/list')
  }
}
