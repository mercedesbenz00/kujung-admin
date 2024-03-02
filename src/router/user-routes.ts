import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'user',
  path: 'user',
  component: RouteViewComponent,
  children: [
    {
      name: 'send-email',
      path: 'send-email',
      component: () => import('../pages/admin/user/SendEmail.vue'),
    },
    {
      name: 'normal-user',
      path: 'normal-user',
      component: RouteViewComponent,
      children: [
        {
          name: 'normal-user-list',
          path: 'list',
          component: () => import('../pages/admin/user/normal-user/List.vue'),
        },
        {
          name: 'normal-user-detail',
          path: 'normal-user-detail/:user_id',
          component: () => import('../pages/admin/user/normal-user/Detail.vue'),
        },
      ],
    },

    {
      name: 'business-user',
      path: 'business-user',
      component: RouteViewComponent,
      children: [
        {
          name: 'business-user-list',
          path: 'list',
          component: () => import('../pages/admin/user/business-user/List.vue'),
        },
        {
          name: 'business-user-detail',
          path: 'detail/:user_id',
          component: () => import('../pages/admin/user/business-user/Detail.vue'),
        },
        {
          name: 'business-user-edit',
          path: 'edit',
          component: () => import('../pages/admin/user/business-user/Edit.vue'),
        },
        {
          name: 'business-user-pending-list',
          path: 'pending-list',
          component: () => import('../pages/admin/user/business-user/PendingList.vue'),
        },
      ],
    },

    {
      name: 'dormant-user',
      path: 'dormant-user',
      component: RouteViewComponent,
      children: [
        {
          name: 'dormant-user-list',
          path: 'list',
          component: () => import('../pages/admin/user/dormant-user/List.vue'),
        },
      ],
    },

    {
      name: 'leaved-user',
      path: 'leaved-user',
      component: RouteViewComponent,
      children: [
        {
          name: 'leaved-user-list',
          path: 'list',
          component: () => import('../pages/admin/user/leaved-user/List.vue'),
        },
      ],
    },
  ],
}
