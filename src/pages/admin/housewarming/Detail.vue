<template>
  <page-header
    v-if="isLanHousewarming"
    title="랜선 집들이 상세"
    breadcrumbsDepth1="랜선 집들이"
    breadcrumbsDepth2="랜선 집들이 상세"
  />
  <page-header
    v-if="!isLanHousewarming"
    title="전문가 집들이 상세"
    breadcrumbsDepth1="전문가 집들이"
    breadcrumbsDepth2="전문가 집들이 상세"
  />
  <div class="layout fluid page-container">
    <span class="va-h6">기본 정보</span>
    <div v-if="detailInfo !== undefined" class="search-form" style="margin-top: 10px">
      <div class="row">
        <div class="search-form-label">집들이 분류</div>
        <div class="search-form-value-33">{{ isLanHousewarming ? '랜선 집들이' : '전문가 집들이' }}</div>

        <div class="search-form-label" style="margin-left: -1px">작성자</div>
        <div class="search-form-value-33">{{ detailInfo!.requester.name }}</div>

        <div class="search-form-label" style="margin-left: -1px">회원분류</div>
        <div class="search-form-value-33">
          {{ detailInfo!.requester.account_type === 'general' ? '일반회원' : '기업회원' }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">발행 요청일시</div>
        <div class="search-form-value-small">{{ Common.getDateTime(detailInfo!.requested_at) }}</div>

        <div class="search-form-label" style="margin-left: -1px">상태</div>
        <div class="search-form-value-small">
          <div class="row" style="display: flex; flex-direction: row; align-items: center">
            <va-select v-model="status" :options="statusValues" style="margin-right: 10px; width: 200px" />
            <va-button size="medium" @click="onStatusChange">변경</va-button>
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">위시리스트 수</div>
        <div class="search-form-value-33">{{ detailInfo!.wish_count }}</div>

        <div class="search-form-label" style="margin-left: -1px">좋아요 수</div>
        <div class="search-form-value-33">{{ detailInfo!.wish_count }}</div>

        <div class="search-form-label" style="margin-left: -1px">조회수</div>
        <div class="search-form-value-33">{{ detailInfo!.view_count }}</div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">관리자 점수</div>
        <div class="search-form-value-small">
          <div class="row" style="display: flex; flex-direction: row; align-items: center">
            <va-input v-model="view_point" style="margin-right: 10px; width: 200px" />
            <va-button size="medium" @click="onViewPointChange">변경</va-button>
          </div>
        </div>
      </div>
    </div>

    <span class="va-h6">필수 정보</span>
    <div v-if="detailInfo !== undefined" class="search-form" style="margin-top: 10px">
      <div class="row">
        <div class="search-form-label">컬러</div>
        <div class="search-form-value-33">{{ detailInfo!.color_info?.name }}</div>

        <div class="search-form-label" style="margin-left: -1px">주거면적</div>
        <div class="search-form-value-33">{{ detailInfo!.area_space_info?.name }}</div>

        <div class="search-form-label" style="margin-left: -1px">주거공간</div>
        <div class="search-form-value-33">{{ detailInfo!.house_type_info?.name }}</div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">스타일</div>
        <div class="search-form-value-small">{{ detailInfo!.house_style_info?.name }}</div>

        <div class="search-form-label" style="margin-left: -1px">가족형태</div>
        <div class="search-form-value-small">{{ detailInfo!.family_type_info?.name }}</div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">태그</div>
        <div class="search-form-value">{{ getTagsNames(detailInfo!.tags) }}</div>
      </div>

      <div v-if="!isLanHousewarming" class="row" style="margin-top: -1px">
        <div class="search-form-label">시공주소</div>
        <div class="search-form-value">{{ detailInfo!.building_addr }}</div>
      </div>
    </div>

    <span class="va-h6">마루 정보</span>
    <div v-if="productDetail !== undefined" class="search-form" style="margin-top: 10px">
      <div class="row">
        <div class="search-form-label">마루 종류</div>
        <div class="search-form-value" style="flex-direction: row; align-items: center">
          <va-image :src="productDetail.thumbnail_url" style="width: 100px; height: auto; margin-right: 10px" />
          <div>
            {{
              Common.getCategoryString(
                productDetail.category_level1,
                productDetail.category_level2,
                productDetail.category_level3,
              )
            }}<br />
            <b>{{ productDetail.title }}</b>
          </div>
        </div>
      </div>
    </div>

    <span class="va-h6">상세 내용</span>
    <div v-if="isLanHousewarming && detailInfo !== undefined" class="search-form" style="margin-top: 10px">
      <div class="row">
        <div class="search-form-label">사진</div>
        <div class="search-form-value" style="flex-direction: row">
          <va-image
            v-for="image in detailInfo.onlineHouseImages"
            :src="image.image_url"
            style="width: 100px; height: auto; margin-right: 10px"
          />
        </div>
      </div>
    </div>
    <div v-if="!isLanHousewarming && detailInfo !== undefined" class="search-form" style="margin-top: 10px">
      <div class="row">
        <div class="search-form-label">커버 이미지</div>
        <div class="search-form-value" style="flex-direction: row">
          <va-image :src="detailInfo.thumb_url" style="width: 100px; height: auto; margin-right: 10px" />
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">제목</div>
        <div class="search-form-value">
          {{ detailInfo.title }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">내용</div>
        <div class="search-form-value html-content-container" v-html="detailInfo.content" />
      </div>
    </div>

    <va-divider />
    <div class="row" style="justify-content: space-between">
      <va-button @click="onGotoList">목록으로</va-button>
      <div>
        <va-button preset="secondary" border-color="primary" size="medium" @click="onDelete">삭제</va-button>
        <va-button style="margin-left: 10px" @click="onEdit">수정</va-button>
      </div>
    </div>
  </div>

  <add-reject-reason-popup
    v-if="showRejectReasonPopup"
    @closed="showRejectReasonPopup = false"
    @inputed="onRejectReasonInputed"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../components/PageHeader.vue'
  import AddRejectReasonPopup from './AddRejectReasonPopup.vue'
  import { requestDelete, requestGet, requestPut } from '../../../util/api'
  import { useRoute, useRouter } from 'vue-router'
  import { useModal, useToast } from 'vuestic-ui'
  import Common from '../../../util/common'
  import { getTagsNames } from '../../../interfaces/Tag'

  const router = useRouter()
  const route = useRoute()

  const { init: toast } = useToast()

  const { init: alert } = useModal()
  const isLanHousewarming = ref<boolean>(route.path.indexOf('lan-house') > 0)
  let apiUrlPrefix = route.path.indexOf('lan-house') > 0 ? 'online-house' : 'expert-house'
  const detailInfo = ref(undefined)
  const productDetail = ref(undefined)

  const statusValues = ['발행 대기', '발행 완료', '발행 반려']
  const status = ref('발행 대기')
  const view_point = ref<string>('')

  const showRejectReasonPopup = ref<boolean>(false)

  watch(route, () => {
    isLanHousewarming.value = route.path.indexOf('lan-house') > 0
    apiUrlPrefix = route.path.indexOf('lan-house') > 0 ? 'online-house' : 'expert-house'
  })

  onMounted(async () => {
    try {
      let result = await requestGet(`${apiUrlPrefix}/${route.params.id}`, {})
      detailInfo.value = result.data
      status.value = statusValues[detailInfo.value!.status]
      productDetail.value = detailInfo.value!.product
      view_point.value = detailInfo.value!.view_point
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onStatusChange = async () => {
    if (status.value === '발행 반려') {
      showRejectReasonPopup.value = true
    } else {
      let result = await requestPut(`${apiUrlPrefix}/${route.params.id}`, {
        status: statusValues.indexOf(status.value),
      })
      console.log(result)
      toast('변경하였습니다.')
    }
  }

  const onRejectReasonInputed = async (reason) => {
    let result = await requestPut(`${apiUrlPrefix}/${route.params.id}`, {
      status: statusValues.indexOf(status.value),
      reason: reason,
    })
    console.log(result)
    toast('변경하였습니다.')
  }

  const onViewPointChange = async () => {
    let result = await requestPut(`${apiUrlPrefix}/${route.params.id}`, {
      view_point: Number(view_point.value),
    })
    console.log(result)
    toast('변경하였습니다.')
  }

  const onGotoList = () => {
    router.back()
  }

  const onDelete = () => {
    alert({
      message: `정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`${apiUrlPrefix}/${route.params.id}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          router.back()
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onEdit = () => {
    if (isLanHousewarming.value) {
      router.push({ name: 'lan-housewarming-edit', params: { id: route.params.id } })
    } else {
      router.push({ name: 'expert-housewarming-edit', params: { id: route.params.id } })
    }
  }
</script>

<style lang="scss"></style>
