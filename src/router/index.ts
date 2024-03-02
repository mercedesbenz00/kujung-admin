import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import RouteViewComponent from '../layouts/RouterBypass.vue'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import Page404Layout from '../layouts/Page404Layout.vue'

import { useGlobalStore } from '../stores/global-store'
import MainPageRoutes from './main-page-routes'
import HomePageRoutes from './home-page-routes'
import UserRoutes from './user-routes'
import ProductRoutes from './product-routes'
import LanHousewarmingRoutes from './lan-housewarming-routes'
import ExpertHousewarmingRoutes from './expert-housewarming-routes'
import SupportCenterRoutes from './support-center-routes'
import PointMallRoutes from './point-mall-routes'
import SmartStoreRoutes from './smart-store-routes'
import PopupRoutes from './popup-routes'
import CategoryRoutes from './category-routes'
import SendHistoryRoutes from './send-history-routes'
import ManagerRoutes from './manager-routes'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'admin',
    path: '/admin',
    component: AppLayout,
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      MainPageRoutes,
      HomePageRoutes,
      UserRoutes,
      ProductRoutes,
      LanHousewarmingRoutes,
      ExpertHousewarmingRoutes,
      {
        name: 'this-month-housewarming',
        path: 'this-month-housewarming',
        component: () => import('../pages/admin/this-month-housewarming/List.vue'),
      },
      {
        name: 'smartcare-request-manage',
        path: 'smartcare-request-manage',
        component: RouteViewComponent,
        children: [
          {
            name: 'smartcare-request-list',
            path: 'list',
            component: () => import('../pages/admin/smartcare-request-manage/List.vue'),
          },
          {
            name: 'smartcare-request-detail',
            path: 'detail/:id',
            component: () => import('../pages/admin/smartcare-request-manage/Detail.vue'),
          },
        ],
      },
      SupportCenterRoutes,
      PointMallRoutes,
      SmartStoreRoutes,
      PopupRoutes,
      CategoryRoutes,
      SendHistoryRoutes,
      ManagerRoutes,
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/login/Login.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    path: '/404',
    component: Page404Layout,
    children: [
      {
        name: 'not-found-advanced',
        path: 'not-found-advanced',
        component: () => import('../pages/404-pages/VaPageNotFoundSearch.vue'),
      },
      {
        name: 'not-found-simple',
        path: 'not-found-simple',
        component: () => import('../pages/404-pages/VaPageNotFoundSimple.vue'),
      },
      {
        name: 'not-found-custom',
        path: 'not-found-custom',
        component: () => import('../pages/404-pages/VaPageNotFoundCustom.vue'),
      },
      {
        name: 'not-found-large-text',
        path: '/pages/not-found-large-text',
        component: () => import('../pages/404-pages/VaPageNotFoundLargeText.vue'),
      },
    ],
  },
]

const authenticate = async () => {
  const GlobalStore = useGlobalStore()
  return GlobalStore.accessToken !== ''
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  //  mode: process.env.VUE_APP_ROUTER_MODE_HISTORY === 'true' ? 'history' : 'hash',
  routes,
})

router.beforeEach(async (to, from, next) => {
  let isAuthenticated = await authenticate()
  if (to.path.startsWith('/admin')) {
    if (isAuthenticated) {
      next()
    } else {
      next('/auth/login')
    }
  } else {
    next()
  }
})

export default router
