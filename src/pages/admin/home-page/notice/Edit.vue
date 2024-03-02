<template>
  <page-header title="공지지항 수정" breadcrumbsDepth1="공지지항" breadcrumbsDepth2="공지지항 수정" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">제목*</div>
    <div style="display: flex; flex-direction: row; align-items: center">
      <va-input v-model="title" placeholder="제목을 입력해 주세요." style="margin-right: 20px" />
      <va-checkbox v-model="isTopFixed" label="상단고정" />
    </div>

    <div class="label">내용*</div>
    <QuillEditor
      v-model:content="content"
      placeholder="내용을 작성해 주세요."
      contentType="html"
      theme="snow"
      style="height: 300px"
      toolbar="full"
    />
    
    <div class="label">썸네일 이미지*</div>
    <va-image
      v-if="originalThumbUrl !== ''"
      :src="originalThumbUrl"
      style="width: 100px; height: auto; margin-top: 10px"
    />
    <va-file-upload v-model="thumbnailImages" />
    <div v-if="thumbnailImages.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'notice-list' }">취소</va-button>
      <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { useModal, useToast } from 'vuestic-ui'
  import { requestGet, requestPut, uploadFile } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = ref(route.params.id)

  const title = ref<string>('')
  const isTopFixed = ref<boolean>(false)
  const content = ref<string>('')
  const originalThumbUrl = ref<string>('')
  const thumbnailImages = ref([])

  onMounted(async () => {
    try {
      var result = (await requestGet(`homepage/notification/${id.value}`, {})).data
      title.value = result.title
      content.value = result.content
      isTopFixed.value = result.top_fixed
      originalThumbUrl.value = result.thumb_url
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
    if (content.value === '') {
      alert({
        message: '내용을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var thumbUrl = originalThumbUrl.value
      if (thumbnailImages.value.length > 0) {
        var result = await uploadFile(thumbnailImages.value[0], 'event', 'y')
        thumbUrl = result.data[0].Location
      }

      await requestPut(`homepage/notification/${id.value}`, {
        title: title.value,
        content: content.value,
        top_fixed: isTopFixed.value,
        thumb_url: thumbUrl,
      })
      toast('수정하였습니다.')

      router.replace({ name: 'notice-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
