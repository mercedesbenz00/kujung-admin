export interface INavigationRoute {
  id: number
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export const getChildrenRouteIds = (route: INavigationRoute) => {
  return route.children!.map((it) => it.id)
}

export const isChildRoute = (parentRoute: INavigationRoute, routeId: number) => {
  if (parentRoute.children === undefined) {
    return false
  }

  let chidlRouteIndex = parentRoute.children!.findIndex((it) => it.id === routeId)
  return chidlRouteIndex > -1
}

export const getEnabledRoutes = (allRoutes: INavigationRoute[], enabledRouteIds: number[]) => {
  let enabledRoutes: INavigationRoute[] = []
  allRoutes.forEach((parentRoute) => {
    if (parentRoute.children === undefined) {
      if (enabledRouteIds.indexOf(parentRoute.id) > -1) {
        enabledRoutes = [...enabledRoutes, parentRoute]
      }
    } else {
      const enabledChildRoutes = parentRoute.children.filter((childRoute) => {
        if (enabledRouteIds.indexOf(childRoute.id) > -1) {
          return true
        } else {
          return false
        }
      })
      if (enabledChildRoutes.length > 0) {
        var routeToAdd = Object.assign({}, parentRoute)
        routeToAdd.children = enabledChildRoutes
        enabledRoutes = [...enabledRoutes, routeToAdd]
      }
    }
  })
  return enabledRoutes
}

export default {
  root: {
    name: '/',
    displayName: '대시보드',
  },
  routes: [
    {
      id: 100,
      name: 'dashboard',
      displayName: '대시보드',
    },
    {
      id: 200,
      name: 'main-page',
      displayName: '메인 페이지 관리',
      children: [
        {
          id: 201,
          name: 'main-banner-list',
          displayName: '메인 배너 관리',
        },
        {
          id: 202,
          name: 'main-recommended-product-list',
          displayName: 'all about space',
        },
        {
          id: 203,
          name: 'main-lan-housewarming-list',
          displayName: '랜선집들이 메인 노출 관리',
        },
        {
          id: 204,
          name: 'main-recommended-keyword-list',
          displayName: '추천 검색어 메인 노출 관리',
        },
        {
          id: 205,
          name: 'main-tag-list',
          displayName: '태그 메인 노출 관리',
        },
        {
          id: 206,
          name: 'main-best-product-list',
          displayName: '베스트 제품 메인 노출 관리',
        },
        {
          id: 207,
          name: 'main-youtube-list',
          displayName: '메인 유튜브 관리',
        },
        {
          id: 208,
          name: 'main-construction-example-list',
          displayName: '최신 인테리어팁',
        },
        {
          id: 209,
          name: 'main-instagram-list',
          displayName: '메인 인스타그램 관리',
        },
      ],
    },

    {
      id: 300,
      name: 'home-page',
      displayName: '홈페이지 관리',
      children: [
        // {
        //   id: 301,
        //   name: 'intro-banner',
        //   displayName: '구정마루 소개 배너 관리',
        // },
        {
          id: 302,
          name: 'brand-showroom-list',
          displayName: '브랜드 쇼룸',
        },
        {
          id: 303,
          name: 'showroom-banner-list',
          displayName: '본사 쇼룸 배너',
        },
        {
          id: 304,
          name: 'portfolio-list',
          displayName: '포트폴리오',
        },
        {
          id: 305,
          name: 'catalog-samplebook-list',
          displayName: '카탈로그 및 샘플북',
        },
        {
          id: 306,
          name: 'product-manage-method-list',
          displayName: '제품 관리법',
        },
        {
          id: 312,
          name: 'interior-trend-list',
          displayName: '인테리어 트렌드',
        },
        {
          id: 307,
          name: 'certificate-list',
          displayName: '인증서',
        },
        {
          id: 308,
          name: 'smartcare-construction-example-list',
          displayName: '스마트케어 시공사례',
        },
        {
          id: 309,
          name: 'notice-list',
          displayName: '공지사항',
        },
        {
          id: 310,
          name: 'event-list',
          displayName: '이벤트',
        },
        {
          id: 311,
          name: 'faq-list',
          displayName: '자주 묻는 질문',
        },
      ],
    },

    {
      id: 400,
      name: 'user',
      displayName: '회원 관리',
      children: [
        {
          id: 401,
          name: 'normal-user-list',
          displayName: '일반 회원',
        },
        {
          id: 402,
          name: 'business-user-list',
          displayName: '기업 회원',
        },
        {
          id: 403,
          name: 'business-user-pending-list',
          displayName: '기업 회원 승인대기',
        },
        {
          id: 404,
          name: 'dormant-user-list',
          displayName: '휴면 회원',
        },
        {
          id: 405,
          name: 'leaved-user-list',
          displayName: '탈퇴 회원',
        },
      ],
    },

    {
      id: 500,
      name: 'product',
      displayName: '제품 관리',
      children: [
        {
          id: 501,
          name: 'product-list',
          displayName: '제품 관리',
        },
        {
          id: 502,
          name: 'product-header-fix',
          displayName: '제품 상단 고정 관리',
        },
        {
          id: 503,
          name: 'recommended-product',
          displayName: '구정마루 추천 상품 관리',
        },
      ],
    },

    {
      id: 600,
      name: 'lan-housewarming',
      displayName: '랜선 집들이 관리',
      children: [
        {
          id: 601,
          name: 'lan-housewarming-pending-list',
          displayName: '랜선 집들이 승인대기',
        },
        {
          id: 602,
          name: 'lan-housewarming-list',
          displayName: '랜선 집들이',
        },
        {
          id: 603,
          name: 'lan-housewarming-rejected-list',
          displayName: '랜선 집들이 반려',
        },
      ],
    },

    {
      id: 700,
      name: 'expert-housewarming',
      displayName: '전문가 집들이 관리',
      children: [
        {
          id: 701,
          name: 'expert-housewarming-pending-list',
          displayName: '전문가 집들이 승인대기',
        },
        {
          id: 702,
          name: 'expert-housewarming-list',
          displayName: '전문가 집들이',
        },
        {
          id: 703,
          name: 'expert-housewarming-rejected-list',
          displayName: '전문가 집들이 반려',
        },
      ],
    },

    {
      id: 800,
      name: 'this-month-housewarming',
      displayName: '이달의 랜덤 집들이',
    },

    {
      id: 1600,
      name: 'smartcare-request-list',
      displayName: '스마트케어 신청 관리',
    },

    {
      id: 900,
      name: 'support-center',
      displayName: '고객센터',
      children: [
        {
          id: 901,
          name: 'detail-quote-list',
          displayName: '상세 견적내기',
        },
        {
          id: 902,
          name: 'ask-list',
          displayName: '1:1 문의',
        },
      ],
    },

    {
      id: 1000,
      name: 'point-mall',
      displayName: '포인트몰 관리',
      children: [
        {
          id: 1001,
          name: 'point-mall-product-list',
          displayName: '포인트몰 상품 관리',
        },
        {
          id: 1002,
          name: 'bee-pick',
          displayName: '구정 Bee의 픽',
        },
        {
          id: 1003,
          name: 'product-order-history-list',
          displayName: '포인트 상품 주문 내역',
        },
      ],
    },

    {
      id: 1100,
      name: 'smart-store',
      displayName: '스마트 스토어 관리',
      children: [
        {
          id: 1101,
          name: 'smart-store-list',
          displayName: '스마트 스토어 관리',
        },
        {
          id: 1102,
          name: 'smart-store-recommends',
          displayName: '구정 Bee의 추천제품',
        },
        {
          id: 1103,
          name: 'smart-store-banner-list',
          displayName: '스마트 스토어 배너 관리',
        },
      ],
    },

    {
      id: 1200,
      name: 'popup-list',
      displayName: '팝업 관리',
    },

    {
      id: 1300,
      name: 'category',
      displayName: '카테고리 관리',
      children: [
        {
          id: 1301,
          name: 'product-category-list',
          displayName: '제품 분류 관리',
        },
        {
          id: 1302,
          name: 'label-list',
          displayName: '라벨 관리',
        },
        {
          id: 1303,
          name: 'recommended-keyword-list',
          displayName: '추천 검색어',
        },
        {
          id: 1306,
          name: 'popular-keyword-list',
          displayName: '인기 검색어',
        },
        {
          id: 1307,
          name: 'search-keyword-list',
          displayName: '검색어관리',
        },
        {
          id: 1304,
          name: 'tag-list',
          displayName: '태그',
        },
        {
          id: 1305,
          name: 'common-constant-list',
          displayName: '속성',
        },
      ],
    },

    {
      id: 1400,
      name: 'send-history',
      displayName: '발송내역',
      children: [
        {
          id: 1401,
          name: 'sms-send-history',
          displayName: 'SMS 발송내역',
        },
        {
          id: 1402,
          name: 'mms-send-history',
          displayName: 'MMS 발송내역',
        },
      ],
    },

    {
      id: 1500,
      name: 'manager-list',
      displayName: '관리자 관리',
    },
  ] as INavigationRoute[],
}
