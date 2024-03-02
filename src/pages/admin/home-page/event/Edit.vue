<template>
  <page-header title="이벤트 수정" breadcrumbsDepth1="이벤트" breadcrumbsDepth2="이벤트 수정" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="label">이벤트 기간</div>
    <va-date-input v-model="startDate" />
    -
    <va-date-input v-model="endDate" />

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

    <div class="label">사용여부</div>
    <div class="row">
      <va-radio
        v-for="(option, index) in usageValues"
        :key="index"
        v-model="usage"
        :option="option"
        style="margin-right: 1rem; margin-top: 0px"
      />
    </div>

    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'event-list' }">취소</va-button>
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
  const startDate = ref<Date>()
  const endDate = ref<Date>()
  const content = ref<string>('')
  const originalThumbUrl = ref<string>('')
  const thumbnailImages = ref([])
  const usageValues = ['사용', '미사용']
  const usage = ref<string>('')

  onMounted(async () => {
    try {
      var result = (await requestGet(`homepage/event/${id.value}`, {})).data
      title.value = result.title
      content.value = result.content
      startDate.value = new Date(result.start_at)
      endDate.value = new Date(result.end_at)
      usage.value = result.enabled ? '사용' : '미사용'
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

      await requestPut(`homepage/event/${id.value}`, {
        title: title.value,
        content: content.value,
        start_at: startDate.value,
        end_at: endDate.value,
        thumb_url: thumbUrl,
        enabled: usage.value === '사용',
      })
      toast('수정하였습니다.')

      router.replace({ name: 'event-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
