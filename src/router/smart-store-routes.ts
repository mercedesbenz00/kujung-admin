import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'smart-store',
  path: 'smart-store',
  component: RouteViewComponent,
  children: [
    {
      name: 'smart-store-manage',
      path: 'smart-store-manage',
      component: RouteViewComponent,
      children: [
        {
          name: 'smart-store-list',
          path: 'list',
          component: () => import('../pages/admin/smart-store/smart-store-manage/List.vue'),
        },
        {
          name: 'smart-store-recommends',
          path: 'recommends',
          component: () => import('../pages/admin/smart-store/smart-store-manage/Recommends.vue'),
        },
        {
          name: 'smart-store-create',
          path: 'create',
          component: () => import('../pages/admin/smart-store/smart-store-manage/Create.vue'),
        },
        {
          name: 'smart-store-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/smart-store/smart-store-manage/Edit.vue'),
        },
      ],
    },

    {
      name: 'smart-store-banner',
      path: 'smart-store-banner',
      component: RouteViewComponent,
      children: [
        {
          name: 'smart-store-banner-list',
          path: 'list',
          component: () => import('../pages/admin/smart-store/smart-store-banner/List.vue'),
        },
        {
          name: 'smart-store-banner-create',
          path: 'create',
          component: () => import('../pages/admin/smart-store/smart-store-banner/Create.vue'),
        },
        {
          name: 'smart-store-banner-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/smart-store/smart-store-banner/Edit.vue'),
        },
      ],
    },
  ],
}
