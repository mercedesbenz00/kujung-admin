import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'manager',
  path: 'manager',
  component: RouteViewComponent,
  children: [
    {
      name: 'manager-list',
      path: 'list',
      component: () => import('../pages/admin/manager/List.vue'),
    },
    {
      name: 'manager-create',
      path: 'create',
      component: () => import('../pages/admin/manager/Create.vue'),
    },
    {
      name: 'manager-edit',
      path: 'edit/:id',
      component: () => import('../pages/admin/manager/Edit.vue'),
    },
  ],
}
