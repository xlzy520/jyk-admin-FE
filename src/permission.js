import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasRoles = store.getters.userData.roleCode
  console.log(to.path);// todo 登录页弹登录已过期
  if (!hasRoles) {
    if (!whiteList.includes(to.path)) {
      try {
        const { roleCode } = await store.dispatch('user/getInfo')
        const accessRoutes = await store.dispatch('permission/generateRoutes', roleCode)
        router.addRoutes(accessRoutes)
        next({ ...to, replace: true })
      } catch (error) {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
  next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
