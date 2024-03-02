import RouteViewComponent from '../layouts/RouterBypass.vue'

export default {
  name: 'home-page',
  path: 'home-page',
  component: RouteViewComponent,
  children: [
    {
      name: 'intro-banner',
      path: 'intro-banner',
      component: () => import('../pages/admin/home-page/intro-banner/Edit.vue'),
    },

    {
      name: 'brand-showroom',
      path: 'brand-showroom',
      component: RouteViewComponent,
      children: [
        {
          name: 'brand-showroom-list',
          path: 'list',
          component: () => import('../pages/admin/home-page/brand-showroom/List.vue'),
        },
        {
          name: 'brand-showroom-create',
          path: 'create',
          component: () => import('../pages/admin/home-page/brand-showroom/Create.vue'),
        },
        {
          name: 'brand-showroom-detail',
          path: 'detail/:id',
          component: () => import('../pages/admin/home-page/brand-showroom/Detail.vue'),
        },
        {
          name: 'brand-showroom-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/home-page/brand-showroom/Edit.vue'),
        },
      ],
    },
    {
      name: 'showroom-banner',
      path: 'showroom-banner',
      component: RouteViewComponent,
      children: [
        {
          name: 'showroom-banner-list',
          path: 'list',
          component: () => import('../pages/admin/home-page/showroom-banner/List.vue'),
        },
        {
          name: 'showroom-banner-create',
          path: 'create',
          component: () => import('../pages/admin/home-page/showroom-banner/Create.vue'),
        },
        {
          name: 'showroom-banner-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/home-page/showroom-banner/Edit.vue'),
        },
      ],
    },

    {
      name: 'portfolio',
      path: 'portfolio',
      component: RouteViewComponent,
      children: [
        {
          name: 'portfolio-list',
          path: 'list',
          component: () => import('../pages/admin/home-page/portfolio/List.vue'),
        },
        {
          name: 'portfolio-create',
          path: 'create',
          component: () => import('../pages/admin/home-page/portfolio/Create.vue'),
        },
        {
          name: 'portfolio-detail',
          path: 'detail/:id',
          component: () => import('../pages/admin/home-page/portfolio/Detail.vue'),
        },
        {
          name: 'portfolio-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/home-page/portfolio/Edit.vue'),
        },
      ],
    },

    {
      name: 'catalog-samplebook',
      path: 'catalog-samplebook',
      component: RouteViewComponent,
      children: [
        {
          name: 'catalog-samplebook-list',
          path: 'list',
          component: () => import('../pages/admin/home-page/catalog-samplebook/List.vue'),
        },
        {
          name: 'catalog-samplebook-create',
          path: 'create',
          component: () => import('../pages/admin/home-page/catalog-samplebook/Create.vue'),
        },
        {
          name: 'catalog-samplebook-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/home-page/catalog-samplebook/Edit.vue'),
        },
      ],
    },

    {
      name: 'product-manage-method',
      path: 'product-manage-method',
      component: RouteViewComponent,
      children: [
        {
          name: 'product-manage-method-list',
          path: 'list',
          component: () => import('../pages/admin/home-page/product-manage-method/List.vue'),
        },
        {
          name: 'product-manage-method-create',
          path: 'create',
          component: () => import('../pages/admin/home-page/product-manage-method/Create.vue'),
        },
        {
          name: 'product-manage-method-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/home-page/product-manage-method/Edit.vue'),
        },
      ],
    },

    {
      name: 'interior-trend',
      path: 'interior-trend',
      component: RouteViewComponent,
      children: [
        {
          name: 'interior-trend-list',
          path: 'list',
          component: () => import('../pages/admin/home-page/interior-trend/List.vue'),
        },
        {
          name: 'interior-trend-create',
          path: 'create',
          component: () => import('../pages/admin/home-page/interior-trend/Create.vue'),
        },
        {
          name: 'interior-trend-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/home-page/interior-trend/Edit.vue'),
        },
      ],
    },

    {
      name: 'certificate',
      path: 'certificate',
      component: RouteViewComponent,
      children: [
        {
          name: 'certificate-list',
          path: 'list',
          component: () => import('../pages/admin/home-page/certificate/List.vue'),
        },
        {
          name: 'certificate-create',
          path: 'create',
          component: () => import('../pages/admin/home-page/certificate/Create.vue'),
        },
        {
          name: 'certificate-edit',
          path: 'edit:/id',
          component: () => import('../pages/admin/home-page/certificate/Edit.vue'),
        },
      ],
    },

    {
      name: 'smartcare-construction-example',
      path: 'smartcare-construction-example',
      component: RouteViewComponent,
      children: [
        {
          name: 'smartcare-construction-example-list',
          path: 'list',
          component: () => import('../pages/admin/home-page/smartcare-construction-example/List.vue'),
        },
        {
          name: 'smartcare-construction-example-create',
          path: 'create',
          component: () => import('../pages/admin/home-page/smartcare-construction-example/Create.vue'),
        },
        {
          name: 'smartcare-construction-example-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/home-page/smartcare-construction-example/Edit.vue'),
        },
      ],
    },

    {
      name: 'notice',
      path: 'notice',
      component: RouteViewComponent,
      children: [
        {
          name: 'notice-list',
          path: 'list',
          component: () => import('../pages/admin/home-page/notice/List.vue'),
        },
        {
          name: 'notice-create',
          path: 'create',
          component: () => import('../pages/admin/home-page/notice/Create.vue'),
        },
        {
          name: 'notice-detail',
          path: 'detail/:id',
          component: () => import('../pages/admin/home-page/notice/Detail.vue'),
        },
        {
          name: 'notice-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/home-page/notice/Edit.vue'),
        },
      ],
    },

    {
      name: 'event',
      path: 'event',
      component: RouteViewComponent,
      children: [
        {
          name: 'event-list',
          path: 'list',
          component: () => import('../pages/admin/home-page/event/List.vue'),
        },
        {
          name: 'event-create',
          path: 'create',
          component: () => import('../pages/admin/home-page/event/Create.vue'),
        },
        {
          name: 'event-detail',
          path: 'detail/:id',
          component: () => import('../pages/admin/home-page/event/Detail.vue'),
        },
        {
          name: 'event-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/home-page/event/Edit.vue'),
        },
      ],
    },

    {
      name: 'faq',
      path: 'faq',
      component: RouteViewComponent,
      children: [
        {
          name: 'faq-list',
          path: 'list',
          component: () => import('../pages/admin/home-page/faq/List.vue'),
        },
        {
          name: 'faq-create',
          path: 'create',
          component: () => import('../pages/admin/home-page/faq/Create.vue'),
        },
        {
          name: 'faq-detail',
          path: 'detail/:id',
          component: () => import('../pages/admin/home-page/faq/Detail.vue'),
        },
        {
          name: 'faq-edit',
          path: 'edit/:id',
          component: () => import('../pages/admin/home-page/faq/Edit.vue'),
        },
      ],
    },
  ],
}
