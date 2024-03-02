<template>
  <page-header title="대리점 상세" breadcrumbsDepth1="브랜드 쇼룸" breadcrumbsDepth2="대리점 상세" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">대리점명</div>
        <div class="flex flex-col search-form-value-small">
          {{ name }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">전화번호</div>
        <div class="flex flex-col search-form-value-small">
          {{ phoneNumber }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">주소</div>
        <div class="flex flex-col search-form-value">
          {{ addr }} {{ addr_sub }} {{ zonecode }} <br /><br />
          <div id="map" style="width: 500px; height: 300px"></div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">특징</div>
        <div class="flex flex-col search-form-value">
          {{ character }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">운영시간</div>
        <div class="flex flex-col search-form-value">
          {{ operatingHour }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">우선순위</div>
        <div class="flex flex-col search-form-value">
          {{ order }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">대리점 이미지</div>
        <div class="flex flex-col search-form-value">
          <va-image :src="imageUrl" style="width: 100px; height: auto" />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">추가 이미지</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row; flex-wrap: wrap">
          <va-image
            v-for="image in images"
            :src="image.image_url"
            style="width: 100px; height: auto; flex: 0 0 auto; margin-right: 10px; margin-bottom: 10px"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">아이콘</div>
        <div class="flex flex-col search-form-value">
          <div>
            <va-chip v-if="isGold" color="warning">GOLD</va-chip>
          </div>
        </div>
      </div>
    </div>

    <div class="row" style="justify-content: space-between">
      <va-button :to="{ name: 'brand-showroom-list' }">목록으로</va-button>
      <div>
        <va-button preset="secondary" border-color="primary" size="medium" @click="onDelete">삭제</va-button>
        <va-button style="margin-left: 10px" :to="{ name: 'brand-showroom-edit', params: { id: id } }">수정</va-button>
      </div>
    </div>
    <va-divider />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { useModal, useToast } from 'vuestic-ui'
  import { requestGet, requestDelete } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = ref(route.params.id)

  const name = ref<string>('')
  const addr = ref<string>('')
  const addr_sub = ref<string>('')
  const zonecode = ref<string>('')
  const mapCenter = ref({ lat: 37.5411, lng: 127.068 })
  const phoneNumber = ref<string>('')
  const character = ref<string>('')
  const operatingHour = ref<string>('')
  const order = ref<string>('')
  const imageUrl = ref<string>('')
  const images = ref<any>([])
  const isGold = ref<boolean>(false)

  onMounted(async () => {
    try {
      var result = (await requestGet(`homepage/agency-store/${id.value}`, {})).data

      name.value = result.name
      addr.value = result.addr
      addr_sub.value = result.addr_sub
      zonecode.value = result.zonecode
      mapCenter.value = { lat: result.lat, lng: result.lng }
      phoneNumber.value = result.phone
      character.value = result.feature
      operatingHour.value = result.opening_hours
      order.value = result.priority
      imageUrl.value = result.image_url
      images.value = result.agencyStoreImages
      isGold.value = result.is_gold
      console.log(result)

      showMap()
    } catch (error) {
      console.log(error)
    }
  })

  const showMap = () => {
    const mapDiv = document.getElementById('map')
    const mapOptions = {
      center: new window.kakao.maps.LatLng(mapCenter.value.lat, mapCenter.value.lng),
      level: 4,
    }
    new window.kakao.maps.Map(mapDiv, mapOptions)
  }

  const onDelete = () => {
    alert({
      message: `정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {          
          let result = await requestDelete(`homepage/agency-store/${id.value}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          router.replace({ name: 'brand-showroom-list' })
        } catch (error) {
          console.log(error)
        }
      },
    })
  }
</script>

<style lang="scss"></style>
