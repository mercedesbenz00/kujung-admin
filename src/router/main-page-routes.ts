import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'main-page',
  path: 'main-page',
  component: RouteViewComponent,
  children: [
    {
      name: 'main-banner',
      path: 'main-banner',
      component: RouteViewComponent,
      children: [
        {
          name: 'main-banner-list',
          path: 'list',
          component: () => import('../pages/admin/main-page/main-banner/List.vue'),
        },
        {
          name: 'main-banner-create',
          path: 'create',
          component: () => import('../pages/admin/main-page/main-banner/Create.vue'),
        },
        {
          name: 'main-banner-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/main-page/main-banner/Edit.vue'),
        },
      ],
    },

    {
      name: 'main-recommended-product',
      path: 'main-recommended-product',
      component: RouteViewComponent,
      children: [
        {
          name: 'main-recommended-product-list',
          path: 'list',
          component: () => import('../pages/admin/main-page/main-recommended-product/List.vue'),
        },
      ],
    },

    {
      name: 'main-lan-housewarming',
      path: 'main-lan-housewarming',
      component: RouteViewComponent,
      children: [
        {
          name: 'main-lan-housewarming-list',
          path: 'list',
          component: () => import('../pages/admin/main-page/main-lan-housewarming/List.vue'),
        },
      ],
    },

    {
      name: 'main-recommended-keyword',
      path: 'main-recommended-keyword',
      component: RouteViewComponent,
      children: [
        {
          name: 'main-recommended-keyword-list',
          path: 'list',
          component: () => import('../pages/admin/main-page/main-recommended-keyword/List.vue'),
        },
      ],
    },

    {
      name: 'main-tag',
      path: 'main-tag',
      component: RouteViewComponent,
      children: [
        {
          name: 'main-tag-list',
          path: 'list',
          component: () => import('../pages/admin/main-page/main-tag/List.vue'),
        },
      ],
    },

    {
      name: 'main-best-product',
      path: 'main-best-product',
      component: RouteViewComponent,
      children: [
        {
          name: 'main-best-product-list',
          path: 'list',
          component: () => import('../pages/admin/main-page/main-best-product/List.vue'),
        },
      ],
    },

    {
      name: 'main-youtube',
      path: 'main-youtube',
      component: RouteViewComponent,
      children: [
        {
          name: 'main-youtube-list',
          path: 'list',
          component: () => import('../pages/admin/main-page/main-youtube/List.vue'),
        },
        {
          name: 'main-youtube-create',
          path: 'create',
          component: () => import('../pages/admin/main-page/main-youtube/Create.vue'),
        },
        {
          name: 'main-youtube-edit',
          path: 'edit',
          component: () => import('../pages/admin/main-page/main-youtube/Edit.vue'),
        },
      ],
    },

    {
      name: 'main-construction-example',
      path: 'main-construction-example',
      component: RouteViewComponent,
      children: [
        {
          name: 'main-construction-example-list',
          path: 'list',
          component: () => import('../pages/admin/main-page/main-construction-example/List.vue'),
        },
        {
          name: 'main-construction-example-create',
          path: 'create',
          component: () => import('../pages/admin/main-page/main-construction-example/Create.vue'),
        },
        {
          name: 'main-construction-example-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/main-page/main-construction-example/Edit.vue'),
        },
      ],
    },

    {
      name: 'main-instagram',
      path: 'main-instagram',
      component: RouteViewComponent,
      children: [
        {
          name: 'main-instagram-list',
          path: 'list',
          component: () => import('../pages/admin/main-page/main-instagram/List.vue'),
        },
        {
          name: 'main-instagram-create',
          path: 'create',
          component: () => import('../pages/admin/main-page/main-instagram/Create.vue'),
        },
        {
          name: 'main-instagram-edit',
          path: 'edit',
          component: () => import('../pages/admin/main-page/main-instagram/Edit.vue'),
        },
      ],
    },
  ],
}
