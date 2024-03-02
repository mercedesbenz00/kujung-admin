<template>
  <page-header title="대리점 수정" breadcrumbsDepth1="대리점 관리" breadcrumbsDepth2="대리점 수정" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">대리점명*</div>
    <va-input v-model="name" placeholder="대리점명을 입력해 주세요." />

    <div class="label">주소*</div>
    <div>
      <va-input v-model="zonecode" style="width: 300px" />
      <va-button style="width: 100px" @click="onAddressSearch">주소검색</va-button>
    </div>

    <va-input v-model="addr" style="width: 400px; margin-top: 10px; margin-bottom: 10px" /><br />
    <va-input v-model="addr_sub" placeholder="상세주소를 입력하세요." style="width: 400px" />

    <div class="label">전화번호*</div>
    <div>
      <va-input v-model="phoneNumber1" style="width: 100px" />
      -
      <va-input v-model="phoneNumber2" style="width: 100px" />
      -
      <va-input v-model="phoneNumber3" style="width: 100px" />
    </div>

    <div class="label">특징*</div>
    <va-input v-model="character" placeholder="특징을 입력해 주세요." />

    <div class="label">운영시간*</div>
    <va-input
      v-model="operatingHour"
      placeholder="운영시간을 입력해 주세요. 예) 월-금 10:00-17:00, 토요일 10:00-17:00"
    />

    <div class="label">우선순위* (숫자만 입력가능, 숫자가 높을 수록 상위 표기됩니다.)</div>
    <va-input v-model="order" />

    <div class="label">대리점 이미지*</div>
    <va-image :src="originalMainImage" style="width: 100px; height: auto" />
    <va-file-upload v-model="mainImage" />
    <div v-if="mainImage.length === 0">선택된 파일이 없습니다.</div>

    <div class="label">추가 이미지*(최대 7장)</div>
    <div style="display: flex; flex-direction: row; flex-wrap: wrap">
      <div
        v-for="(image, index) in originalAgencyStoreImages"
        style="display: flex; flex-direction: column; align-items: center"
      >
        <va-image
          :src="image.image_url"
          style="width: 100px; height: auto; flex: 0 0 auto; margin-right: 10px; margin-bottom: 10px"
        />
        <va-button size="small" @click="onDeleteImage(index)">삭제</va-button>
      </div>
    </div>
    <va-file-upload v-model="extraImages" />
    <div v-if="extraImages.length === 0">선택된 파일이 없습니다.</div>

    <div class="label">아이콘*</div>
    <div style="display: flex; align-items: center">
      <va-checkbox v-model="isGold" /><va-chip color="warning" style="margin-left: 10px; margin-right: 20px"
        >GOLD</va-chip
      >
    </div>

    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'brand-showroom-list' }"
        >취소</va-button
      >
      <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'

  import { useModal, useToast } from 'vuestic-ui'
  import { requestGet, requestPut, uploadFile, uploadFiles } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'
  import Common from '../../../../util/common'
  import { ICommonConstant, getConstantId } from '../../../../interfaces/CommonConstant'
  import { getMergedImages } from '../../../../interfaces/Image'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  var areas: ICommonConstant[] = []

  const id = route.params.id

  const name = ref<string>('')
  const addr = ref<string>('')
  const addr_sub = ref<string>('')
  const zonecode = ref<string>('')
  const latLng = ref({ lat: 37.5411, lng: 127.068 })
  const phoneNumber1 = ref<string>('')
  const phoneNumber2 = ref<string>('')
  const phoneNumber3 = ref<string>('')
  const character = ref<string>('')
  const operatingHour = ref<string>('')
  const order = ref<string>('')
  const originalMainImage = ref<string>('')
  const mainImage = ref([])
  const originalAgencyStoreImages = ref<any[]>([])
  const extraImages = ref([])
  const isGold = ref<boolean>(false)

  onMounted(async () => {
    try {
      let result = await requestGet('common-constant', {
        typeList: ['area_code'],
      })
      areas = result.data[0].items
      console.log(result)

      result = (await requestGet(`homepage/agency-store/${id}`, {})).data
      name.value = result.name
      addr.value = result.addr
      addr_sub.value = result.addr_sub
      zonecode.value = result.zonecode
      latLng.value = { lat: result.lat, lng: result.lng }

      const phoneNumbers = result.phone.split(' ')
      if (phoneNumbers.length > 0) {
        phoneNumber1.value = phoneNumbers[0]
      }
      if (phoneNumbers.length > 1) {
        phoneNumber2.value = phoneNumbers[1]
      }
      if (phoneNumbers.length > 2) {
        phoneNumber3.value = phoneNumbers[2]
      }

      character.value = result.feature
      operatingHour.value = result.opening_hours
      order.value = result.priority
      originalMainImage.value = result.image_url
      originalAgencyStoreImages.value = result.agencyStoreImages
      isGold.value = result.is_gold
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: async function (data) {
        addr.value = data.address
        zonecode.value = data.zonecode

        let res = await Common.getLatLonFromAddress(data.address)
        if (res !== undefined) {
          latLng.value = res
        }
      },
    }).open()
  }

  const onDeleteImage = (index) => {
    originalAgencyStoreImages.value.splice(index, 1)
    originalAgencyStoreImages.value = [...originalAgencyStoreImages.value]
  }

  const onSave = async () => {
    if (name.value === '') {
      alert({
        message: '대리점명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (zonecode.value === '' || addr.value === '') {
      alert({
        message: '주소를 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    let areaCode = getConstantId(areas, addr.value.split(' ')[0])

    if (phoneNumber1.value === '' || phoneNumber2.value === '' || phoneNumber3.value === '') {
      alert({
        message: '전화번호를 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (character.value === '') {
      alert({
        message: '특징을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (operatingHour.value === '') {
      alert({
        message: '운영시간을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (order.value === '') {
      alert({
        message: '우선순위를 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (originalAgencyStoreImages.value.length + extraImages.value.length > 7) {
      alert({
        message: '대리점 이미지는 최대 7장까지 등록가능합니다.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    var mainImageUrl = originalMainImage.value
    var mainImageThumbUrl = originalMainImage.value
    if (mainImage.value.length > 0) {
      var result = await uploadFile(mainImage.value[0], 'agency-store', 'y')
      mainImageUrl = result.data[0].Location
      mainImageThumbUrl = result.data[0].thumbLocation
      console.log(result)
    }

    var agencyStoreImages = originalAgencyStoreImages.value
    if (extraImages.value.length > 0) {
      result = await uploadFiles(extraImages.value, 'agency-store', 'y')
      agencyStoreImages = getMergedImages(agencyStoreImages, result.data)
    }

    try {
      await requestPut(`homepage/agency-store/${id}`, {
        name: name.value,
        addr: addr.value,
        addr_sub: addr_sub.value,
        zonecode: zonecode.value,
        lat: latLng.value.lat,
        lng: latLng.value.lng,
        area_code: areaCode,
        phone: phoneNumber1.value + ' ' + phoneNumber2.value + ' ' + phoneNumber3.value,
        feature: character.value,
        opening_hours: operatingHour.value,
        priority: Number(order.value),
        image_url: mainImageUrl,
        image_url_mobile: mainImageThumbUrl,
        agencyStoreImages: agencyStoreImages,
        is_gold: isGold.value,
      })
      toast('수정하였습니다.')

      router.replace({ name: 'brand-showroom-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
