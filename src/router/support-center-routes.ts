import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'support-center',
  path: 'support-center',
  component: RouteViewComponent,
  children: [
    {
      name: 'detail-quote',
      path: 'detail-quote',
      component: RouteViewComponent,
      children: [
        {
          name: 'detail-quote-list',
          path: 'list',
          component: () => import('../pages/admin/support-center/detail-quote/List.vue'),
        },
        {
          name: 'detail-quote-detail',
          path: 'detail/:id',
          component: () => import('../pages/admin/support-center/detail-quote/Detail.vue'),
        },
      ],
    },

    {
      name: 'ask',
      path: 'ask',
      component: RouteViewComponent,
      children: [
        {
          name: 'ask-list',
          path: 'list',
          component: () => import('../pages/admin/support-center/ask/List.vue'),
        },
        {
          name: 'ask-detail',
          path: 'detail/:id',
          component: () => import('../pages/admin/support-center/ask/Detail.vue'),
        },
      ],
    },
  ],
}
