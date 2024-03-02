<template>
  <page-header title="제품 관리법 등록" breadcrumbsDepth1="제품 관리법" breadcrumbsDepth2="제품 관리법 등록" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="label">요약 내용*</div>
    <va-input v-model="summary" placeholder="요약 내용을 작성해 주세요." />

    <div class="label">유튜브 URL*</div>
    <va-input v-model="youtubeUrl" placeholder="유튜브 URL을 입력해 주세요." />
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'product-manage-method-list' }"
        >취소</va-button
      >
      <va-button style="margin-left: 10px" @click="onCreate">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'

  import { useModal, useToast } from 'vuestic-ui'
  import { requestPost } from '../../../../util/api'
  import { useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const title = ref<string>('')
  const summary = ref<string>('')
  const youtubeUrl = ref<string>('')

  const onCreate = async () => {
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
    if (youtubeUrl.value === '') {
      alert({
        message: '유튜브 URL을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      await requestPost('homepage/management-law', {
        title: title.value,
        summary: summary.value,
        video_url: youtubeUrl.value,
      })
      toast('등록하였습니다.')

      router.replace({ name: 'product-manage-method-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
