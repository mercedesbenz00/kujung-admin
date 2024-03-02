<template>
  <page-header title="제품 관리법 수정" breadcrumbsDepth1="제품 관리법" breadcrumbsDepth2="제품 관리법 수정" />
  <div class="layout fluid page-container">
    <div class="label">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="label">요약 내용*</div>
    <va-input v-model="summary" placeholder="요약 내용을 작성해 주세요." />

    <div class="label">유튜브 URL*</div>
    <va-input v-model="youtubeUrl" placeholder="유튜브 URL을 입력해 주세요." />
    <iframe
      :src="`https://www.youtube.com/embed/${Common.getYoutubeIdFromURL(youtubeUrl)}?autoplay=0&rel=0&loop=1`"
      style="width: 200px; height: 200px"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'product-manage-method-list' }"
        >취소</va-button
      >
      <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import Common from '../../../../util/common'

  import { useModal, useToast } from 'vuestic-ui'
  import { requestGet, requestPut } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = ref(route.params.id)

  const title = ref<string>('')
  const summary = ref<string>('')
  const youtubeUrl = ref<string>('')

  onMounted(async () => {
    try {
      var result = (await requestGet(`homepage/management-law/${id.value}`, {})).data
      title.value = result.title
      summary.value = result.summary
      youtubeUrl.value = result.video_url
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
      await requestPut(`homepage/management-law/${id.value}`, {
        title: title.value,
        summary: summary.value,
        video_url: youtubeUrl.value,
      })
      toast('수정하였습니다.')

      router.replace({ name: 'product-manage-method-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
