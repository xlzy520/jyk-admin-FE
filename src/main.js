import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import * as filters from './filters' // global filters
// register global utility filters
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })
import formRules from './utils/formRules'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/components' // icon
import '@/permission' // permission control

Vue.use(ElementUI)
Vue.prototype.$rules = formRules
Vue.prototype.$message1000 = (message, type) => { // 默认消息提示持续1S
  ElementUI.Message({
    message: message,
    type: type,
    duration: 1000
  })
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
