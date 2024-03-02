import { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Login from './login.json'
import Dashboard from './dashboard.json'
import MainBannerSlide from './main-banner-slide.json'
import MainBannerList from './main-banner-list.json'
import MainbannerDetail from './main-banner-detail.json'
import MainRecommendedProductList from './main-recommended-product-list.json'
import ProductSearchResult from './product-search-result.json'
import ProductCategories1 from './product-categories-1.json'
import ProductCategories2 from './product-categories-2.json'
import ProductCategories3 from './product-categories-3.json'
import ProductTags from './product-tags.json'
import MainLanHousewarmingList from './main-lan-housewarming-list.json'
import MainRecommendedKeywordList from './main-recommended-keyword-list.json'
import MainTagList from './main-tag-list.json'
import MainBestProductList from './main-best-product-list.json'
import MainYoutubeList from './main-youtube-list.json'
import MainYoutubeDetail from './main-youtube-detail.json'
import MainConstructionExampleList from './main-construction-example-list.json'
import MainConstructionExampleDetail from './main-construction-example-detail.json'
import MainInstagramList from './main-instagram-list.json'
import MainInstagramDetail from './main-instagram-detail.json'
import IntroBanner from './intro-banner.json'
import BrandShowroomList from './brand-showroom-list.json'
import BrandShowroomDetail from './brand-showroom-detail.json'
import PortfolioList from './portfolio-list.json'
import PortfolioDetail from './portfolio-detail.json'
import CatalogSamplebookList from './catalog-samplebook-list.json'
import CatalogSamplebookDetail from './catalog-samplebook-detail.json'
import ProductManageMethodList from './product-manage-method-list.json'
import ProductManageMethodDetail from './product-manage-method-detail.json'
import CertificateList from './certificate-list.json'
import CertificateDetail from './certificate-detail.json'
import SmartcareConstructionExampleList from './smartcare-construction-example-list.json'
import SmartcareConstructionExampleDetail from './smartcare-construction-example-detail.json'
import ProductDetail from './product-detail.json'
import NoticeList from './notice-list.json'
import NoticeDetail from './notice-detail.json'
import EventList from './event-list.json'
import EventDetail from './event-detail.json'
import FaqList from './faq-list.json'
import FaqDetail from './faq-detail.json'
import UserList from './user-list.json'
import UserInfo from './user-info.json'
import UserMemoList from './user-memo-list.json'
import UserOnlineHousewarmingHistory from './user-online-housewarming-history.json'
import UserAskHistory from './user-ask-history.json'
import UserAskDetail from './user-ask-detail.json'
import UserPointHistory from './user-point-history.json'
import UserPoint from './user-point.json'
import UserPointProductOrderHistory from './user-point-product-order-history.json'
import BusinessUserList from './business-user-list.json'
import BusinessUserInfo from './business-user-info.json'
import DormantUserList from './dormant-user-list.json'
import LeavedPendingUserList from './leaved-pending-user-list.json'
import LeavedUserList from './leaved-user-list.json'
import ProductDetail2 from './product-detail2.json'
import ProductHeaderFixResult from './product-header-fix-result.json'
import RecommendedProduct from './recommended-product-result.json'
import LanHousewarmingPending from './lan-housewarming-pending.json'
import LanHousewarmingDetail from './lan-housewarming-detail.json'
import LanHousewarmingAll from './lan-housewarming-all.json'
import LanHousewarmingRejected from './lan-housewarming-rejected.json'
import ThisMonthHousewarming from './this-month-housewarming.json'
import DetailQuoteList from './detail-quote-list.json'
import DetailQuoteInfo from './detail-quote-info.json'
import DetailQuoteMemoList from './detail-quote-memo-list.json'
import AskList from './ask-list.json'
import AskDetail from './ask-detail.json'
import PointMallProductList from './point-mall-product-list.json'
import PointMallProductDetail from './point-mall-product-detail.json'
import BeePickList from './bee-pick-list.json'
import ProductOrderHistoryList from './product-order-history-list.json'
import ProductOrderHistoryInfo from './product-order-history-info.json'
import ProductOrderHistoryMemoList from './product-order-history-memo-list.json'
import SmartStoreManageList from './smart-store-manage-list.json'
import SmartStoreDetail from './smart-store-detail.json'
import SmartStoreBannerList from './smart-store-banner-list.json'
import SmartStoreBannerDetail from './smart-store-banner-detail.json'
import PopupList from './popup-list.json'
import PopupDetail from './popup-detail.json'
import LabelList from './label-list.json'
import LabelDetail from './label-detail.json'
import SmsList from './sms-list.json'
import MmsList from './mms-list.json'
import ManagerList from './manager-list.json'
import ManagerDetail from './manager-detail.json'

export const setupMockApiResponses = (axiosInstance: AxiosInstance) => {
  var mock = new MockAdapter(axiosInstance, { onNoMatch: 'passthrough' })

  mock.onPost('login').reply(200, Login)
  mock.onGet('dashboard').reply(200, Dashboard)
  mock.onGet('main-banner-slide').reply(200, MainBannerSlide)
  mock.onPost('main-banner-slide').reply(200, MainBannerSlide)
  mock.onGet('main-banner-list').reply(200, MainBannerList)
  mock.onPost('main-banner-delete').reply(200, MainBannerList)
  mock.onPost('main-banner-create').reply(200, MainBannerList)
  mock.onGet('main-banner-detail').reply(200, MainbannerDetail)
  mock.onPost('main-banner-edit').reply(200, MainbannerDetail)
  mock.onGet('main-recommended-product-list').reply(200, MainRecommendedProductList)
  mock.onPost('main-recommended-product-delete').reply(200, MainRecommendedProductList)
  mock.onPost('main-recommended-product-register').reply(200)
  mock.onGet('product-search').reply(200, ProductSearchResult)
  mock.onGet('product-categories-1').reply(200, ProductCategories1)
  mock.onGet('product-categories-2').reply(200, ProductCategories2)
  mock.onGet('product-categories-3').reply(200, ProductCategories3)
  mock.onGet('product-tags').reply(200, ProductTags)
  mock.onGet('main-lan-housewarming-list').reply(200, MainLanHousewarmingList)
  mock.onPost('main-lan-housewarming-delete').reply(200)
  mock.onGet('main-recommended-keyword-list').reply(200, MainRecommendedKeywordList)
  mock.onPost('main-recommended-keyword-delete').reply(200)
  mock.onGet('main-tag-list').reply(200, MainTagList)
  mock.onPost('main-tag-delete').reply(200)
  mock.onGet('main-best-product-list').reply(200, MainBestProductList)
  mock.onPost('main-best-product-delete').reply(200, MainBestProductList)
  mock.onPost('main-best-product-register').reply(200)
  mock.onGet('main-youtube-list').reply(200, MainYoutubeList)
  mock.onPost('main-youtube-delete').reply(200, MainYoutubeList)
  mock.onPost('main-youtube-create').reply(200, MainYoutubeList)
  mock.onGet('main-youtube-detail').reply(200, MainYoutubeDetail)
  mock.onPost('main-youtube-edit').reply(200, MainYoutubeDetail)
  mock.onGet('main-construction-example-list').reply(200, MainConstructionExampleList)
  mock.onPost('main-construction-example-delete').reply(200, MainConstructionExampleList)
  mock.onPost('main-construction-example-create').reply(200, MainConstructionExampleList)
  mock.onGet('main-construction-example-detail').reply(200, MainConstructionExampleDetail)
  mock.onPost('main-construction-example-edit').reply(200, MainConstructionExampleDetail)
  mock.onGet('main-instagram-list').reply(200, MainInstagramList)
  mock.onPost('main-instagram-delete').reply(200, MainInstagramList)
  mock.onPost('main-instagram-create').reply(200, MainInstagramList)
  mock.onGet('main-instagram-detail').reply(200, MainInstagramDetail)
  mock.onPost('main-instagram-edit').reply(200, MainInstagramDetail)
  mock.onGet('intro-banner').reply(200, IntroBanner)
  mock.onPost('intro-banner').reply(200, IntroBanner)
  mock.onGet('brand-showroom-list').reply(200, BrandShowroomList)
  mock.onPost('brand-showroom-create').reply(200)
  mock.onGet('brand-showroom-detail').reply(200, BrandShowroomDetail)
  mock.onPost('brand-showroom-delete').reply(200)
  mock.onPost('brand-showroom-edit').reply(200)
  mock.onGet('portfolio-list').reply(200, PortfolioList)
  mock.onPost('portfolio-create').reply(200)
  mock.onGet('portfolio-detail').reply(200, PortfolioDetail)
  mock.onPost('portfolio-delete').reply(200)
  mock.onPost('portfolio-edit').reply(200)
  mock.onGet('catalog-samplebook-list').reply(200, CatalogSamplebookList)
  mock.onPost('catalog-samplebook-create').reply(200)
  mock.onGet('catalog-samplebook-detail').reply(200, CatalogSamplebookDetail)
  mock.onPost('catalog-samplebook-delete').reply(200)
  mock.onPost('catalog-samplebook-edit').reply(200)
  mock.onGet('product-manage-method-list').reply(200, ProductManageMethodList)
  mock.onPost('product-manage-method-create').reply(200)
  mock.onGet('product-manage-method-detail').reply(200, ProductManageMethodDetail)
  mock.onPost('product-manage-method-delete').reply(200)
  mock.onPost('product-manage-method-edit').reply(200)
  mock.onGet('certificate-list').reply(200, CertificateList)
  mock.onPost('certificate-create').reply(200)
  mock.onGet('certificate-detail').reply(200, CertificateDetail)
  mock.onPost('certificate-delete').reply(200)
  mock.onPost('certificate-edit').reply(200)
  mock.onGet('smartcare-construction-example-list').reply(200, SmartcareConstructionExampleList)
  mock.onPost('smartcare-construction-example-create').reply(200)
  mock.onGet('smartcare-construction-example-detail').reply(200, SmartcareConstructionExampleDetail)
  mock.onPost('smartcare-construction-example-delete').reply(200)
  mock.onPost('smartcare-construction-example-edit').reply(200)
  mock.onGet('product-detail').reply(200, ProductDetail)
  mock.onGet('notice-list').reply(200, NoticeList)
  mock.onPost('notice-create').reply(200)
  mock.onGet('notice-detail').reply(200, NoticeDetail)
  mock.onPost('notice-delete').reply(200)
  mock.onPost('notice-edit').reply(200)
  mock.onGet('event-list').reply(200, EventList)
  mock.onPost('event-create').reply(200)
  mock.onGet('event-detail').reply(200, EventDetail)
  mock.onPost('event-delete').reply(200)
  mock.onPost('event-edit').reply(200)
  mock.onGet('faq-list').reply(200, FaqList)
  mock.onPost('faq-create').reply(200)
  mock.onGet('faq-detail').reply(200, FaqDetail)
  mock.onPost('faq-delete').reply(200)
  mock.onPost('faq-edit').reply(200)
  mock.onGet('user-list').reply(200, UserList)
  mock.onPost('user-send-sms').reply(200)
  mock.onPost('user-send-email').reply(200)
  mock.onGet('user-info').reply(200, UserInfo)
  mock.onGet('user-memo-list').reply(200, UserMemoList)
  mock.onPost('user-exit').reply(200)
  mock.onPost('user-memo-add').reply(200)
  mock.onGet('user-nickname-duplication-check').reply(200, true)
  mock.onPost('user-info-edit').reply(200)
  mock.onGet('user-online-housewarming-history').reply(200, UserOnlineHousewarmingHistory)
  mock.onGet('user-ask-history').reply(200, UserAskHistory)
  mock.onGet('user-ask-detail').reply(200, UserAskDetail)
  mock.onPost('user-ask-history-add-answer').reply(200)
  mock.onPost('user-ask-history-delete').reply(200)
  mock.onGet('user-point-history').reply(200, UserPointHistory)
  mock.onGet('user-point').reply(200, UserPoint)
  mock.onPost('user-point-add').reply(200)
  mock.onPost('user-point-edit').reply(200)
  mock.onGet('user-point-product-order-history').reply(200, UserPointProductOrderHistory)
  mock.onGet('business-user-list').reply(200, BusinessUserList)
  mock.onGet('business-user-info').reply(200, BusinessUserInfo)
  mock.onPost('business-user-info-edit').reply(200)
  mock.onPost('business-user-approve').reply(200)
  mock.onPost('dormant-user-release').reply(200)
  mock.onGet('dormant-user-list').reply(200, DormantUserList)
  mock.onGet('leaved-pending-user-list').reply(200, LeavedPendingUserList)
  mock.onPost('leaved-pending-user-undo').reply(200)
  mock.onGet('leaved-user-list').reply(200, LeavedUserList)
  mock.onPost('product-delete').reply(200)
  mock.onPost('product-create').reply(200)
  mock.onGet('product-detail2').reply(200, ProductDetail2)
  mock.onPost('product-edit').reply(200)
  mock.onGet('product-header-fix').reply(200, ProductHeaderFixResult)
  mock.onPost('product-header-fix-delete').reply(200)
  mock.onPost('product-header-fix-add').reply(200)
  mock.onGet('recommended-product').reply(200, RecommendedProduct)
  mock.onPost('recommended-product-delete').reply(200)
  mock.onPost('recommended-product-add').reply(200)
  mock.onGet('lan-housewarming-pending').reply(200, LanHousewarmingPending)
  mock.onPost('lan-housewarming-delete').reply(200)
  mock.onGet('lan-housewarming-detail').reply(200, LanHousewarmingDetail)
  mock.onPost('lan-housewarming-change-status').reply(200)
  mock.onPost('lan-housewarming-edit').reply(200)
  mock.onGet('lan-housewarming-all').reply(200, LanHousewarmingAll)
  mock.onPost('lan-housewarming-add-main-exposure').reply(200)
  mock.onPost('lan-housewarming-remove-main-exposure').reply(200)
  mock.onGet('lan-housewarming-rejected').reply(200, LanHousewarmingRejected)
  mock.onGet('this-month-housewarming').reply(200, ThisMonthHousewarming)
  mock.onPost('this-month-housewarming-add').reply(200)
  mock.onGet('detail-quote-list').reply(200, DetailQuoteList)
  mock.onGet('detail-quote-info').reply(200, DetailQuoteInfo)
  mock.onGet('detail-quote-memo-list').reply(200, DetailQuoteMemoList)
  mock.onPost('detail-quote-memo-add').reply(200)
  mock.onPost('detail-quote-info-status-change').reply(200)
  mock.onGet('ask-list').reply(200, AskList)
  mock.onGet('ask-detail').reply(200, AskDetail)
  mock.onPost('ask-add-answer').reply(200)
  mock.onPost('ask-delete').reply(200)
  mock.onPost('ask-edit-answer').reply(200)
  mock.onGet('point-mall-product-list').reply(200, PointMallProductList)
  mock.onPost('point-mall-product-create').reply(200)
  mock.onGet('point-mall-product-detail').reply(200, PointMallProductDetail)
  mock.onPost('point-mall-product-delete').reply(200)
  mock.onPost('point-mall-product-edit').reply(200)
  mock.onPost('point-mall-product-add-bee-pick').reply(200)
  mock.onPost('point-mall-product-remove-bee-pick').reply(200)
  mock.onGet('bee-pick-list').reply(200, BeePickList)
  mock.onPost('bee-pick-delete').reply(200)
  mock.onGet('product-order-history-list').reply(200, ProductOrderHistoryList)
  mock.onGet('product-order-history-info').reply(200, ProductOrderHistoryInfo)
  mock.onGet('product-order-history-memo-list').reply(200, ProductOrderHistoryMemoList)
  mock.onPost('product-order-history-memo-add').reply(200)
  mock.onPost('product-order-history-info-status-change').reply(200)
  mock.onGet('smart-store-manage-list').reply(200, SmartStoreManageList)
  mock.onPost('smart-store-create').reply(200)
  mock.onGet('smart-store-detail').reply(200, SmartStoreDetail)
  mock.onPost('smart-store-delete').reply(200)
  mock.onPost('smart-store-edit').reply(200)
  mock.onGet('smart-store-banner-list').reply(200, SmartStoreBannerList)
  mock.onPost('smart-store-banner-create').reply(200)
  mock.onGet('smart-store-banner-detail').reply(200, SmartStoreBannerDetail)
  mock.onPost('smart-store-banner-edit').reply(200)
  mock.onGet('popup-list').reply(200, PopupList)
  mock.onPost('popup-create').reply(200)
  mock.onGet('popup-detail').reply(200, PopupDetail)
  mock.onPost('popup-edit').reply(200)
  mock.onGet('label-list').reply(200, LabelList)
  mock.onGet('label-detail').reply(200, LabelDetail)
  mock.onPost('label-create').reply(200)
  mock.onPost('label-edit').reply(200)
  mock.onGet('sms-list').reply(200, SmsList)
  mock.onGet('mms-list').reply(200, MmsList)
  mock.onGet('manager-list').reply(200, ManagerList)
  mock.onPost('manager-create').reply(200)
  mock.onGet('manager-user-id-duplication-check').reply(200, true)
  mock.onPost('manager-edit').reply(200)
  mock.onGet('manager-detail').reply(200, ManagerDetail)
}
