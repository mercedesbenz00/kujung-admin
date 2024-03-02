import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'expert-housewarming',
  path: 'expert-housewarming',
  component: RouteViewComponent,
  children: [
    {
      name: 'expert-housewarming-list',
      path: 'list',
      component: () => import('../pages/admin/housewarming/List.vue'),
    },

    {
      name: 'expert-housewarming-pending-list',
      path: 'pending-list',
      component: () => import('../pages/admin/housewarming/PendingList.vue'),
    },

    {
      name: 'expert-housewarming-rejected-list',
      path: 'rejected-list',
      component: () => import('../pages/admin/housewarming/RejectedList.vue'),
    },

    {
      name: 'expert-housewarming-detail',
      path: 'detail/:id',
      component: () => import('../pages/admin/housewarming/Detail.vue'),
    },

    {
      name: 'expert-housewarming-edit',
      path: 'edit/:id',
      component: () => import('../pages/admin/housewarming/Edit.vue'),
    },
  ],
}
