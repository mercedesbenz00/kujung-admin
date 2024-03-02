import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'category',
  path: 'category',
  component: RouteViewComponent,
  children: [
    {
      name: 'product-category',
      path: 'product-category',
      component: RouteViewComponent,
      children: [
        {
          name: 'product-category-list',
          path: 'list',
          component: () => import('../pages/admin/category/product-category/List.vue'),
        },
      ],
    },

    {
      name: 'label',
      path: 'label',
      component: RouteViewComponent,
      children: [
        {
          name: 'label-list',
          path: 'list',
          component: () => import('../pages/admin/category/label/List.vue'),
        },
        {
          name: 'label-create',
          path: 'create',
          component: () => import('../pages/admin/category/label/Create.vue'),
        },
        {
          name: 'label-edit',
          path: 'edit',
          component: () => import('../pages/admin/category/label/Edit.vue'),
        },
      ],
    },

    {
      name: 'recommended-keyword',
      path: 'recommended-keyword',
      component: RouteViewComponent,
      children: [
        {
          name: 'recommended-keyword-list',
          path: 'list',
          component: () => import('../pages/admin/category/recommended-keyword/List.vue'),
        },
      ],
    },

    {
      name: 'popular-keyword',
      path: 'popular-keyword',
      component: RouteViewComponent,
      children: [
        {
          name: 'popular-keyword-list',
          path: 'list',
          component: () => import('../pages/admin/category/popular-keyword/List.vue'),
        },
      ],
    },

    {
      name: 'search-keyword',
      path: 'search-keyword',
      component: RouteViewComponent,
      children: [
        {
          name: 'search-keyword-list',
          path: 'list',
          component: () => import('../pages/admin/category/search-keyword/List.vue'),
        },
      ],
    },

    {
      name: 'tag',
      path: 'tag',
      component: RouteViewComponent,
      children: [
        {
          name: 'tag-list',
          path: 'list',
          component: () => import('../pages/admin/category/tag/List.vue'),
        },
      ],
    },

    {
      name: 'common-constant',
      path: 'common-constant',
      component: RouteViewComponent,
      children: [
        {
          name: 'common-constant-list',
          path: 'list',
          component: () => import('../pages/admin/category/common-constant/List.vue'),
        },
      ],
    },
  ],
}
