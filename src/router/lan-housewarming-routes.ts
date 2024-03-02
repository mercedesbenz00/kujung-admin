import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'lan-housewarming',
  path: 'lan-housewarming',
  component: RouteViewComponent,
  children: [
    {
      name: 'lan-housewarming-list',
      path: 'list',
      component: () => import('../pages/admin/housewarming/List.vue'),
    },

    {
      name: 'lan-housewarming-pending-list',
      path: 'pending-list',
      component: () => import('../pages/admin/housewarming/PendingList.vue'),
    },

    {
      name: 'lan-housewarming-rejected-list',
      path: 'rejected-list',
      component: () => import('../pages/admin/housewarming/RejectedList.vue'),
    },

    {
      name: 'lan-housewarming-detail',
      path: 'detail/:id',
      component: () => import('../pages/admin/housewarming/Detail.vue'),
    },

    {
      name: 'lan-housewarming-edit',
      path: 'edit/:id',
      component: () => import('../pages/admin/housewarming/Edit.vue'),
    },
  ],
}
