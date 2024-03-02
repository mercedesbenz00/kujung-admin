import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'popup',
  path: 'popup',
  component: RouteViewComponent,
  children: [
    {
      name: 'popup-list',
      path: 'list',
      component: () => import('../pages/admin/popup/List.vue'),
    },

    {
      name: 'popup-create',
      path: 'create',
      component: () => import('../pages/admin/popup/Create.vue'),
    },

    {
      name: 'popup-edit',
      path: 'edit/:id',
      component: () => import('../pages/admin/popup/Edit.vue'),
    },
  ],
}
