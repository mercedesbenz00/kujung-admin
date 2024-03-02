<template>
  <page-header
    title="카탈로그 및 샘플북 수정"
    breadcrumbsDepth1="카탈로그 및 샘플북"
    breadcrumbsDepth2="카탈로그 및 샘플북 수정"
  />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">카테고리*</div>
    <va-select v-model="category" :options="categoryValues" style="width: 200px" />

    <div class="label">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="label">요약 내용*</div>
    <va-input v-model="summary" placeholder="요약 내용을 작성해 주세요." />

    <div class="label">다운로드 파일</div>
    <div style="display: flex; flex-direction: row">
      <div
        style="
          display: flex;
          align-items: center;
          padding-left: 10px;
          width: 300px;
          border-style: solid;
          border-width: 1px;
          border-color: #3a4555;
        "
      >
        {{ Common.getFileNameFromUrl(originalDownloadFile) }}
      </div>
      <va-button @click="onDeleteDownloadFile">삭제</va-button>
    </div>
    <va-file-upload v-model="downloadFiles" />
    <div v-if="downloadFiles.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="label">미리보기 파일</div>
    <div style="display: flex; flex-direction: row">
      <div
        style="
          display: flex;
          align-items: center;
          padding-left: 10px;
          width: 300px;
          border-style: solid;
          border-width: 1px;
          border-color: #3a4555;
        "
      >
        {{ Common.getFileNameFromUrl(originalPreviewFile) }}
      </div>
      <va-button @click="onDeletePreviewFile">삭제</va-button>
    </div>
    <va-file-upload v-model="previewFiles" />
    <div v-if="previewFiles.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="label">썸네일 이미지*</div>
    <va-image :src="originalThumbnailUrl" style="width: 100px; height: auto" />
    <va-file-upload v-model="thumbnailImages" />
    <div v-if="thumbnailImages.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'catalog-samplebook-list' }"
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
  import { requestGet, requestPut, uploadFile } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'
  import Common from '../../../../util/common'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = ref(route.params.id)

  const categoryValues = ['카탈로그', '샘플북', '룩북']
  const category = ref<string>('')
  const categoryTitles = {
    catalog: '카탈로그',
    sample: '샘플북',
    look: '룩북',
  }
  const categoryNames = {
    카탈로그: 'catalog',
    샘플북: 'sample',
    룩북: 'look',
  }
  const title = ref<string>('')
  const summary = ref<string>('')
  const originalDownloadFile = ref<string>('')
  const originalPreviewFile = ref<string>('')
  const originalThumbnailUrl = ref<string>('')
  const downloadFiles = ref<any[]>([])
  const previewFiles = ref<any[]>([])
  const thumbnailImages = ref<any[]>([])

  onMounted(async () => {
    try {
      var result = (await requestGet(`homepage/catalog/${id.value}`, {})).data
      category.value = categoryTitles[result.category]
      title.value = result.title
      summary.value = result.summary
      originalDownloadFile.value = result.download_file
      originalPreviewFile.value = result.preview_file
      originalThumbnailUrl.value = result.thumb_url
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onDeleteDownloadFile = () => {
    originalDownloadFile.value = ''
  }

  const onDeletePreviewFile = () => {
    originalPreviewFile.value = ''
  }

  const onSave = async () => {
    if (category.value === '') {
      alert({
        message: '카테고리를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (title.value === '') {
      alert({
        message: '제목을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (summary.value === '') {
      alert({
        message: '요약내용을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (originalDownloadFile.value === '' && downloadFiles.value.length === 0 && originalPreviewFile.value === '' && previewFiles.value.length === 0) {
      alert({
        message: '미리보기 혹은 다운로드 파일중 하나를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var downloadFileUrl = originalDownloadFile.value
      if (downloadFiles.value.length > 0) {
        const result = await uploadFile(downloadFiles.value[0], 'catalog', 'n')
        downloadFileUrl = result.data[0].Location
      }

      var previewFileUrl = originalPreviewFile.value
      if (previewFiles.value.length > 0) {
        const result = await uploadFile(previewFiles.value[0], 'catalog', 'n')
        previewFileUrl = result.data[0].Location
      }

      var thumbnailImageUrl = originalThumbnailUrl.value
      if (thumbnailImages.value.length > 0) {
        const result = await uploadFile(thumbnailImages.value[0], 'catalog', 'y')
        thumbnailImageUrl = result.data[0].Location
      }

      await requestPut(`homepage/catalog/${id.value}`, {
        category: categoryNames[category.value],
        title: title.value,
        summary: summary.value,
        download_file: downloadFileUrl,
        preview_file: previewFileUrl,
        thumb_url: thumbnailImageUrl,
        thumb_url_mobile: thumbnailImageUrl,
      })
      toast('수정하였습니다.')

      router.replace({ name: 'catalog-samplebook-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
