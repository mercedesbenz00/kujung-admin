<template>
  <page-header title="구정마루 소개 배너 관리" breadcrumbsDepth1="구정마루 소개 배너 관리" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">형식</div>
    <va-radio
      v-for="(option, index) in formatOptions"
      :key="index"
      v-model="format"
      :option="option"
      style="margin-right: 1rem"
    />

    <template v-if="format == '이미지'">
      <div class="label">PC*</div>
      <va-image :src="originalImageUrl" style="width: 100px; height: auto" />
      <va-file-upload v-model="pc" />
      <div v-if="pc.length === 0">선택된 파일이 없습니다.</div>
      <va-divider />

      <div class="label">모바일*</div>
      <va-image :src="originalMobileUrl" style="width: 100px; height: auto" />
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
      <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'

  import { useModal, useToast } from 'vuestic-ui'
  import { requestGet, requestPost, requestPut, uploadFile } from '../../../../util/api'

  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const format = ref<string>('이미지')
  const originalImageUrl = ref<string>('')
  const originalImageThumbUrl = ref<string>('')

  const originalMobileUrl = ref<string>('')
  const originalMobileThumbUrl = ref<string>('')
  const pc = ref([])
  const mobile = ref([])
  const videoUrl = ref<string>('')
  const use = ref<string>('사용')

  const formatOptions = ['이미지', '동영상']
  const useOptions = ['사용', '미사용']

  const load = async () => {
    try {
      var result = (await requestGet('homepage/intro-banner', {})).data

      format.value = result.format === 'image' ? '이미지' : '동영상'
      originalImageUrl.value = result.image_url
      originalImageThumbUrl.value = result.thumb_url
      originalMobileUrl.value = result.image_url_mobile
      originalMobileThumbUrl.value = result.thumb_url_mobile
      videoUrl.value = result.video_url
      use.value = result.enabled ? '사용' : '미사용'
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  onMounted(() => {
    load()
  })

  const onSave = async () => {
    var param = {
      enabled: use.value === '사용',
    }

    if (format.value === '이미지') {
      if (originalImageUrl.value == '' && pc.value.length === 0) {
        alert({
          message: 'PC용 이미지를 선택해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }

      if (originalMobileUrl.value == '' && mobile.value.length === 0) {
        alert({
          message: '모바일용 이미지를 선택해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }

      param['format'] = 'image'
      if (pc.value.length > 0) {
        var result = await uploadFile(pc.value[0], 'intro-banner', 'y')
        param['image_url'] = result.data[0].Location
        param['thumb_url'] = result.data[0].thumbLocation
      }

      if (mobile.value.length > 0) {
        var result = await uploadFile(mobile.value[0], 'intro-banner', 'y')
        param['image_url_mobile'] = result.data[0].Location
        param['thumb_url_mobile'] = result.data[0].thumbLocation
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

      param['format'] = 'video'
      param['video_url'] = videoUrl.value
    }

    try {
      await requestPut('homepage/intro-banner', param)
      toast('수정하였습니다.')

      load()
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
