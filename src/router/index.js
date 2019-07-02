import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/staff',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '员工管理',
        component: () => import('@/views/staff/index'),
        meta: { title: '员工管理', icon: 'staff' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: '用户管理',
    meta: { title: '用户管理', icon: 'peoples' },
    children: [
      {
        path: 'list',
        name: '用户列表',
        component: () => import('@/views/user/list'),
        meta: { title: '用户列表', icon: 'user' }
      },
      {
        path: 'address',
        name: '地址列表',
        component: () => import('@/views/user/address'),
        meta: { title: '地址列表', icon: 'address' }
      }
    ]
  },
  {
    path: '/school',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '学校管理',
        component: () => import('@/views/school/index'),
        meta: { title: '学校管理', icon: 'school' }
      }
    ]
  },
  {
    path: '/partner',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '合作伙伴',
        component: () => import('@/views/partner/index'),
        meta: { title: '合作伙伴', icon: 'partner' }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '商品管理',
        component: () => import('@/views/goods/index'),
        meta: { title: '商品管理', icon: 'goods' }
      }
    ]
  },
  {
    path: '/orders',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '订单管理',
        component: () => import('@/views/orders/index'),
        meta: { title: '订单管理', icon: 'orders' }
      }
    ]
  },
  {
    path: '/pay-record',
    component: Layout,
    redirect: '/pay-record/list',
    name: '支付记录',
    meta: { title: '支付记录', icon: 'pay-record' },
    children: [
      {
        path: 'online',
        name: '线上支付',
        component: () => import('@/views/pay-record/online'),
        meta: { title: '线上支付', icon: 'online' }
      },
      {
        path: 'offline',
        name: '线下支付',
        component: () => import('@/views/pay-record/offline'),
        meta: { title: '线下支付', icon: 'offline' }
      }
    ]
  },
  {
    path: '/company',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '公司信息',
        component: () => import('@/views/company/index'),
        meta: { title: '公司信息', icon: 'company' }
      }
    ]
  },
  {
    path: '/file',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '图片管理',
        component: () => import('@/views/file/index'),
        meta: { title: '图片管理', icon: 'img' }
      }
    ]
  },
  {
    path: '/stores',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '进销存管理',
        component: () => import('@/views/stores/index'),
        meta: { title: '进销存管理', icon: 'stores' }
      }
    ]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/nested',
    name: '测试页',
    component: Layout,
    children: [{
      path: 'dashboard',
      name: '动态路由测试页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '动态路由测试页', icon: 'nested' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
