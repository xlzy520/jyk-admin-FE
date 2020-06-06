import baseFetch from './base/fetch'

export default {
  list(data) {
    return baseFetch('/inventory/list/admin', data)
  },
  update(data) {
    return baseFetch('/inventory/update', data)
  },
  delete(id) {
    return baseFetch('/inventory/delete', id)
  },
  save(ids) {
    return baseFetch('/inventory/save', ids)
  },
  userList() {
    return baseFetch('/user/simple/info')
  },
  tablewareList() {
    return baseFetch('/use/type/list')
  },
  tablewareDetail(data) {
    return baseFetch('/tableware/list', data)
  },
  settlementList(data) {
    return baseFetch('/inventory/settlement/list', data)
  },
  defaultAddress(data) {
    return baseFetch('/address/user/default/get', data)
  },
  defaultAddressByMobile(data) {
    return baseFetch('/address/user/default/getByMobile', data)
  },
  settlementDetail(data) {
    return baseFetch('/inventory/settlement/detail', data)
  }
}
