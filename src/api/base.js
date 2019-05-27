import request from '@/utils/request'

export default function baseService(url, value, method = 'post', options = {}) {
  if (method === 'post') {
    return request.post(url, value, options)
  } else if (method === 'get') {
    return request.get(url, { params: value }, options)
  }
}
