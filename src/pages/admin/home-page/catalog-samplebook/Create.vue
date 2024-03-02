<template>
  <page-header title="카탈로그 및 샘플북 등록" breadcrumbsDepth1="카탈로그 및 샘플북" breadcrumbsDepth2="카탈로그 및 샘플북 등록" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">카테고리*</div>
    <va-select v-model="category" :options="categoryValues" style="width: 200px" />

    <div class="label">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="label">요약 내용*</div>
    <va-input v-model="summary" placeholder="요약 내용을 작성해 주세요." />

    <div class="label">다운로드 파일</div>
    <va-file-upload v-model="downloadFiles" />
    <div v-if="downloadFiles.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="label">미리보기 파일</div>
    <va-file-upload v-model="previewFiles" />
    <div v-if="previewFiles.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="label">썸네일 이미지*</div>
    <va-file-upload v-model="thumbnailImages" />
    <div v-if="thumbnailImages.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium"
        :to="{ name: 'catalog-samplebook-list' }">취소</va-button>
      <va-button style="margin-left: 10px" @click="onCreate">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '../../../../components/PageHeader.vue'

import { useModal, useToast } from 'vuestic-ui'
import { requestPost, uploadFile } from '../../../../util/api'
import { useRouter } from 'vue-router'

const { init: alert } = useModal()
const { init: toast } = useToast()
const router = useRouter()

const categoryValues = ['카탈로그', '샘플북', '룩북']
const category = ref<string>('')
const categoryNames = {
  카탈로그: 'catalog',
  샘플북: 'sample',
  룩북: 'look',
}
const title = ref<string>('')
const summary = ref<string>('')
const downloadFiles = ref([])
const previewFiles = ref([])
const thumbnailImages = ref([])

const onCreate = async () => {
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
  if (downloadFiles.value.length === 0 && previewFiles.value.length === 0) {
    alert({
      message: '미리보기 혹은 다운로드 파일중 하나를 선택해 주세요.',
      okText: '확인',
      cancelText: null,
    })
    return
  }
  if (thumbnailImages.value.length === 0) {
    alert({
      message: '썸네일 이미지를 선택해 주세요.',
      okText: '확인',
      cancelText: null,
    })
    return
  }

  try {
    var downloadFileUrl = ""
    if (downloadFiles.value.length > 0) {
      var result = await uploadFile(downloadFiles.value[0], 'catalog', 'n')
      downloadFileUrl = result.data[0].Location
    }

    var previewFileUrl = ""
    if (previewFiles.value.length > 0) {
      result = await uploadFile(previewFiles.value[0], 'catalog', 'n')
      previewFileUrl = result.data[0].Location
    }

    result = await uploadFile(thumbnailImages.value[0], 'catalog', 'y')
    var thumbUrl = result.data[0].Location

    await requestPost('homepage/catalog', {
      category: categoryNames[category.value],
      title: title.value,
      summary: summary.value,
      download_file: downloadFileUrl,
      preview_file: previewFileUrl,
      thumb_url: thumbUrl,
      thumb_url_mobile: thumbUrl,
    })
    toast('등록하였습니다.')

    router.replace({ name: 'catalog-samplebook-list' })
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="scss"></style>
