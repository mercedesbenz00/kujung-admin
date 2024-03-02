import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'product',
  path: 'product',
  component: RouteViewComponent,
  children: [
    {
      name: 'product-manage',
      path: 'product-manage',
      component: RouteViewComponent,
      children: [
        {
          name: 'product-list',
          path: 'list',
          component: () => import('../pages/admin/product/product-manage/List.vue'),
        },
        {
          name: 'product-create',
          path: 'create',
          component: () => import('../pages/admin/product/product-manage/Create.vue'),
        },
        {
          name: 'product-detail',
          path: 'detail/:id',
          component: () => import('../pages/admin/product/product-manage/Detail.vue'),
        },
        {
          name: 'product-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/product/product-manage/Edit.vue'),
        },
      ],
    },

    {
      name: 'product-header-fix',
      path: 'product-header-fix',
      component: () => import('../pages/admin/product/product-header-fix/List.vue'),
    },

    {
      name: 'recommended-product',
      path: 'recommended-product',
      component: () => import('../pages/admin/product/recommended-product/List.vue'),
    },
  ],
}
