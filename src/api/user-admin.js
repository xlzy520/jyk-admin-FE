import fetch from './base/fetch'

export default {
  login(data) {
    return Promise.resolve(
      {"isFirst":false,"appToken":"F7E123409A5E683C39C791D5631CAA6A"}
    )
    return fetch('/login', data, 'formdata')
  },
  getInfo() {
    return Promise.resolve(
      {"saveDate":null,"modifyDate":null,"operatorId":null,"modifierId":null,"roleCode":"super","realName":"fcx","openId":null,"userId":1,"username":"fcx","mobile":"13867481724","password":null,"addRoleCode":null,"area":null,"fileUrl":null,"city":null,"newPassword":null,"mark":null,"address":null,"addressType":null,"schoolName":null,"addressMobile":null,"consignee":null,"white":true,"deleted":null}
    )
    return fetch('/info')
  },
  logout() {
    return fetch('/logout')
  }
}
