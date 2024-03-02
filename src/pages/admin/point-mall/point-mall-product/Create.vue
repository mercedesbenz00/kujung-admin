<template>
  <page-header title="포인트 상품 등록" breadcrumbsDepth1="포인트 상품 관리" breadcrumbsDepth2="포인트 상품 등록" />
  <div class="layout fluid page-container">
    <div class="label">상품명*</div>
    <va-input v-model="title" placeholder="상품명을 입력해 주세요." />

    <div class="label">상품 설명*</div>
    <va-input v-model="summary" placeholder="상품 설명을 작성해 주세요." />

    <div class="label">차감 포인트*</div>
    <va-input v-model="point" placeholder="차감 포인트를 입력해 주세요." />

    <div class="label">관리자 점수</div>
    <va-input v-model="view_point" placeholder="관리자 점수를 입력해 주세요." />

    <div class="label">내용*</div>
    <QuillEditor
      v-model:content="content"
      placeholder="내용을 작성해 주세요."
      contentType="html"
      theme="snow"
      style="height: 300px"
    />

    <div class="label">썸네일 이미지*</div>
    <va-file-upload v-model="thumbnailImages" />
    <div v-if="thumbnailImages.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'point-mall-product-list' }"
        >취소</va-button
      >
      <va-button style="margin-left: 10px" @click="onCreate">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { useModal, useToast } from 'vuestic-ui'
  import { requestPost, uploadFile } from '../../../../util/api'
  import { useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const title = ref<string>('')
  const summary = ref<string>('')
  const point = ref<string>('')
  const view_point = ref<string>('')
  const content = ref<string>('')
  const thumbnailImages = ref([])

  const onCreate = async () => {
    if (title.value === '') {
      alert({
        message: '상품명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (summary.value === '') {
      alert({
        message: '상품 설명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (point.value === '') {
      alert({
        message: '차감 포인트를 입력해 주세요.',
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
    if (thumbnailImages.value.length === 0) {
      alert({
        message: '썸네일 이미지를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var result = await uploadFile(thumbnailImages.value[0], 'point-product', 'y')
      var thumbnailImageUrl = result.data.map((it) => it.Location)[0]

      await requestPost('point-product', {
        name: title.value,
        summary: summary.value,
        point: Number(point.value),
        view_point: Number(view_point.value),
        desc: content.value,
        thumb_url: thumbnailImageUrl,
        is_bee: false,
      })
      toast('등록하였습니다.')

      router.replace({ name: 'point-mall-product-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
