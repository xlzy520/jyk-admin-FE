import request from '@/utils/request'

export default function baseService(url, value, method = 'post', options = {}) {
  if (method === 'post') {
    return request.post(url, value, options)
  } else if (method === 'get') {
    return request.get(url, { params: value }, options)
  } else if (method === 'formdata') {
    return request({
      method: 'post',
      url: url,
      data: value,
      // 转换数据的方法
      transformRequest: [
        function(data) {
          let ret = ''
          for (const it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          ret = ret.substring(0, ret.length - 1)
          return ret
        }
      ],
      // 设置请求头
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
}
