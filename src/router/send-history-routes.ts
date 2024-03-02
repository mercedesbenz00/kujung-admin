import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'send-history',
  path: 'send-history',
  component: RouteViewComponent,
  children: [
    {
      name: 'sms-send-history',
      path: 'sms-send-history',
      component: () => import('../pages/admin/send-history/SmsList.vue'),
    },
    {
      name: 'mms-send-history',
      path: 'mms-send-history',
      component: () => import('../pages/admin/send-history/MmsList.vue'),
    },
  ],
}
