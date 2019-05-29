import loginApi from '../../api/user-admin'
import md5 from 'md5'
import { resetRouter } from '@/router'

const state = {
  userData: {}
}

const mutations = {
  SET_USER_DATA: (state, userData) => {
    state.userData = userData
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const username = userInfo.username.trim()
    const password = md5(userInfo.password)
    return new Promise((resolve, reject) => {
      loginApi.login(username, password).then(response => {
        commit('SET_USER_DATA', response)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      loginApi.getInfo().then(response => {
        commit('SET_USER_DATA', response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      loginApi.logout().then(() => {
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      }).finally(() => {
        commit('SET_USER_DATA', {})
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

