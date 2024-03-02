<template>
  <page-header
    title="메인 인스타그램 수정"
    breadcrumbsDepth1="메인 인스타그램 관리"
    breadcrumbsDepth2="메인 인스타그램 수정"
  />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="label">주소*</div>
    <va-input v-model="url" placeholder="URL을 입력해 주세요." />

    <div class="label">썸네일 이미지*</div>
    <va-image
      v-if="originalThumbUrl !== ''"
      :src="originalThumbUrl"
      style="width: 100px; height: auto; margin-top: 10px"
    />
    <va-file-upload v-model="thumbnailImages" />
    <div v-if="thumbnailImages.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

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
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'main-instagram-list' }"
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
  import { requestGet, requestPut, uploadFile} from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = route.params.id

  const title = ref<string>('')
  const url = ref<string>('')
  const originalThumbUrl = ref<string>('')
  const thumbnailImages = ref([])
  const use = ref<string>('사용')

  const useOptions = ['사용', '미사용']

  onMounted(async () => {
    try {
      var result = (await requestGet(`main-instagram/${id}`, {})).data
      title.value = result.title
      url.value = result.instagram_url
      originalThumbUrl.value = result.thumb_url
      use.value = result.enabled ? '사용' : '미사용'
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onSave = async () => {
    if (title.value === '') {
      alert({
        message: '제목을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (url.value === '') {
      alert({
        message: '주소 URL을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var thumbUrl = originalThumbUrl.value
      if (thumbnailImages.value.length > 0) {
        var result = await uploadFile(thumbnailImages.value[0], 'instagram', 'y')
        thumbUrl = result.data[0].Location
      }

      await requestPut(`main-instagram/${id}`, {
        title: title.value,
        instagram_url: url.value,
        thumb_url: thumbUrl,
        enabled: use.value === '사용',
      })
      toast('수정하였습니다.')

      router.replace({ name: 'main-instagram-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
