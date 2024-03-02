import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'point-mall',
  path: 'point-mall',
  component: RouteViewComponent,
  children: [
    {
      name: 'point-mall-product',
      path: 'point-mall-product',
      component: RouteViewComponent,
      children: [
        {
          name: 'point-mall-product-list',
          path: 'list',
          component: () => import('../pages/admin/point-mall/point-mall-product/List.vue'),
        },
        {
          name: 'point-mall-product-create',
          path: 'create',
          component: () => import('../pages/admin/point-mall/point-mall-product/Create.vue'),
        },
        {
          name: 'point-mall-product-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/point-mall/point-mall-product/Edit.vue'),
        },
      ],
    },

    {
      name: 'bee-pick',
      path: 'bee-pick',
      component: () => import('../pages/admin/point-mall/bee-pick/List.vue'),
    },

    {
      name: 'product-order-history',
      path: 'product-order-history',
      component: RouteViewComponent,
      children: [
        {
          name: 'product-order-history-list',
          path: 'list',
          component: () => import('../pages/admin/point-mall/product-order-history/List.vue'),
        },
        {
          name: 'product-order-history-detail',
          path: 'detail/:id',
          component: () => import('../pages/admin/point-mall/product-order-history/Detail.vue'),
        },
      ],
    },
  ],
}
