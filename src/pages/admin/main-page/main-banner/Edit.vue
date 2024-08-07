<template>
  <page-header title="메인 배너 수정" breadcrumbsDepth1="메인 배너 관리" breadcrumbsDepth2="메인 배너 수정" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">배너명*</div>
    <va-input v-model="title" placeholder="배너명을 입력해 주세요." />

    <div class="row xs12">
      <div class="flex xs6">
        <div class="label">주소</div>
        <va-input v-model="address" placeholder="URL을 입력해 주세요." />
      </div>
      <div class="flex" style="margin-left: 20px">
        <div class="label">타겟</div>
        <va-radio
          v-for="(option, index) in targetOptions"
          :key="index"
          v-model="target"
          :option="option"
          style="margin-right: 1rem"
        />
      </div>
    </div>

    <div class="label">형식</div>
    <va-radio
      v-for="(option, index) in formatOptions"
      :key="index"
      v-model="format"
      :option="option"
      style="margin-right: 1rem"
    />

    <template v-if="format == '이미지'">
      <div class="label">PC*</div>
      <va-image v-if="pcUrl !== ''" :src="pcUrl" style="width: 100px; height: auto" />
      <va-file-upload v-model="pc" />
      <div v-if="pc.length === 0">선택된 파일이 없습니다.</div>
      <va-divider />

      <div class="label">모바일*</div>
      <va-image v-if="mobileUrl !== ''" :src="mobileUrl" style="width: 100px; height: auto" />
      <va-file-upload v-model="mobile" />
      <div v-if="mobile.length === 0">선택된 파일이 없습니다.</div>
      <va-divider />
    </template>

    <template v-if="format == '동영상'">
      <div class="label">영상 URL*</div>
      <va-input v-model="videoUrl" placeholder="Youtube 또는 Vimeo url을 입력해 주세요." />
    </template>

    <div class="label">사용여부</div>
    <va-radio
      v-for="(option, index) in useOptions"
      :key="index"
      v-model="use"
      :option="option"
      style="margin-right: 1rem"
    />

    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'main-banner-list' }"
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
  import { requestGet, requestPost, requestPut, uploadFile } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = route.params.id

  const title = ref<string>('')
  const address = ref<string>('')
  const target = ref<string>('현재창')
  const format = ref<string>('이미지')
  const pc = ref([])
  const mobile = ref([])
  const pcUrl = ref<string>('')
  const pcThumbUrl = ref<string>('')
  const mobileUrl = ref<string>('')
  const mobileThumbUrl = ref<string>('')
  const videoUrl = ref<string>('')
  const use = ref<string>('사용')

  const targetOptions = ['현재창', '새창', '이동 안함']
  const formatOptions = ['이미지', '동영상']
  const useOptions = ['사용', '미사용']

  onMounted(async () => {
    try {
      var result = (
        await requestGet(`main-banner/${id}`, {
          id: id,
        })
      ).data
      title.value = result.title
      address.value = result.address
      target.value = targetOptions[result.target]
      format.value = result.format === 'image' ? '이미지' : '동영상'
      pcUrl.value = result.image_url
      pcThumbUrl.value = result.thumb_url
      mobileUrl.value = result.image_url_mobile
      mobileThumbUrl.value = result.thumb_url_mobile
      videoUrl.value = result.video_url
      use.value = result.enabled ? '사용' : '미사용'
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onSave = async () => {
    if (title.value === '') {
      alert({
        message: '배너명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (format.value === '이미지') {
      if (pcUrl.value === '' && pc.value.length === 0) {
        alert({
          message: 'PC용 이미지를 선택해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }

      if (mobileUrl.value === '' && mobile.value.length === 0) {
        alert({
          message: '모바일용 이미지를 선택해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
    } else {
      if (videoUrl.value === '') {
        alert({
          message: '동영상 URL을 입력해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
    }

    try {
      var uploadedPcUrl = pcUrl.value
      var uploadedPcThumbUrl = pcThumbUrl.value
      if (pc.value.length > 0) {
        var result = await uploadFile(pc.value[0], 'main-banner', 'y')
        uploadedPcUrl = result.data[0].Location
        uploadedPcThumbUrl = result.data[0].thumbLocation
      }

      var uploadedMobileUrl = mobileUrl.value
      var uploadedMobileThumbUrl = mobileThumbUrl.value
      if (mobile.value.length > 0) {
        result = await uploadFile(mobile.value[0], 'main-banner', 'y')
        uploadedMobileUrl = result.data[0].Location
        uploadedMobileThumbUrl = result.data[0].thumbLocation
      }

      await requestPut(`main-banner/${id}`, {
        title: title.value,
        address: address.value,
        target: targetOptions.indexOf(target.value),
        format: format.value === '이미지' ? 'image' : 'video',
        image_url: uploadedPcUrl,
        image_url_mobile: uploadedMobileUrl,
        thumb_url: uploadedPcThumbUrl,
        thumb_url_mobile: uploadedMobileThumbUrl,
        video_url: videoUrl.value,
        enabled: use.value === '사용',
      })
      toast('수정하였습니다.')

      router.replace({ name: 'main-banner-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
