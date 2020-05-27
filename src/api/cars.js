import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/car/' + url, ...arg)
export default {
  getCar(data) {
    return fetch('list', data)
  },
  deleteCar(id) {
    return fetch('delete', id)
  },
  addCar(data) {
    return fetch('save', data)
  },
  updateCar(data) {
    return fetch('update', data)
  }
}
