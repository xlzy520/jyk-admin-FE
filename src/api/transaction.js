import fetch from './base/fetch'

export default {
  transactionList() {
    return fetch('/transaction/list')
  }
}
