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
      meta: { title: '首页', icon: 'dashboard',roles: ['staff','admin', 'super'] }
    }]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    name: '进销存管理',
    path: '/inventory',
    component: Layout,
    meta: { title: '进销存管理', icon: 'stores', roles: ['admin', 'super'] },
    children: [
      {
        path: 'index',
        name: '总览',
        component: () => import('@/views/inventory/index'),
        meta: { title: '总览', icon: 'stores',roles: ['admin', 'super'] }
      },
      {
        path: 'staff',
        name: '授权人员',
        component: () => import('@/views/productData/staff'),
        meta: { title: '授权人员', icon: 'staff',roles: ['admin', 'super'] }
      },
      {
        path: 'jieying',
        name: '每日结营',
        component: () => import('@/views/inventory/jieying'),
        meta: { title: '每日结营', icon: 'goods',roles: ['admin', 'super'] }
      },
      {
        path: 'produce',
        name: '生产数据',
        component: () => import('@/views/productData/list'),
        meta: { title: '生产数据', icon: 'goods',roles: ['admin', 'super'] }
      },
      // {
      //   path: 'send',
      //   name: '发货与回收',
      //   component: () => import('@/views/inventory/sendAndRecycle'),
      //   meta: { title: '发货与回收', icon: 'goods',roles: ['admin', 'super'] }
      // },
    ]
  },
  {
    name: '公司管理',
    path: '/company',
    component: Layout,
    meta: { title: '公司管理', icon: 'company', roles: ['admin', 'super'] },
    children: [
      {
        path: 'staff',
        name: '员工管理',
        component: () => import('@/views/company/staff'),
        meta: { title: '员工管理', icon: 'staff' }
      },
      {
        path: 'info',
        name: '公司信息',
        component: () => import('@/views/company/company'),
        meta: { title: '公司信息', icon: 'company' }
      },
      {
        path: 'cars',
        name: '车辆管理',
        component: () => import('@/views/company/cars'),
        meta: { title: '车辆管理', icon: 'cars' }
      },
      {
        path: 'partner',
        name: '合作伙伴',
        component: () => import('@/views/company/partner'),
        meta: { title: '合作伙伴', icon: 'partner' }
      },
      {
        path: 'school',
        name: '学校管理',
        component: () => import('@/views/company/school'),
        meta: { title: '学校管理', icon: 'school' }
      },
      {
        path: 'notice',
        name: '下单短信通知',
        component: () => import('@/views/company/notice'),
        meta: { title: '下单短信通知', icon: 'example' }
      },
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: '用户管理',
    meta: { title: '用户管理', icon: 'peoples',roles: ['admin', 'super'] },
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
    path: '/goods',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '商品管理',
        component: () => import('@/views/goods/index'),
        meta: { title: '商品管理', icon: 'goods',roles: ['admin', 'super'] }
      }
    ]
  },
  {
    path: '/payProcessAndNotify',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '收费流程与公告',
        component: () => import('@/views/payProcess/basePayProcess'),
        meta: { title: '收费流程与公告', icon: 'peoples',roles: ['admin', 'super'] },
      },
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
        meta: { title: '订单管理', icon: 'orders',roles: ['admin', 'super'] }
      },
      {
        path: 'detail',
        name: '订单详情',
        hidden: true,
        component: () => import('@/views/orders/detail'),
        meta: { title: '订单详情',roles: ['admin', 'super'] }
      }
    ]
  },
  {
    path: '/bill',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '支付记录',
        component: () => import('@/views/bill/index'),
        meta: { title: '支付记录', icon: 'pay-record',roles: ['admin', 'super'] },
      }
    ]
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
