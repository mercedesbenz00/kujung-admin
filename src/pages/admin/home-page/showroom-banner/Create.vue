<template>
  <page-header
    title="본사 쇼룸 배너 등록"
    breadcrumbsDepth1="본사 쇼룸 배너 관리"
    breadcrumbsDepth2="본사 쇼룸 배너 등록"
  />
  <div class="layout fluid page-container">
    <div class="label">이미지*</div>
    <va-file-upload v-model="images" />
    <div v-if="images.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'showroom-banner-list' }"
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
  import { requestPost, uploadFile } from '../../../../util/api'
  import { useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const images = ref([])

  const onCreate = async () => {
    if (images.value.length === 0) {
      alert({
        message: '이미지를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var result = await uploadFile(images.value[0], 'showroom-banner', 'y')
      var labelUrl = result.data[0].Location
      console.log(result)

      await requestPost('homepage/showroom-banner', {
        image_url: labelUrl,
        image_url_mobile: labelUrl,
        enabled: true,
      })
      toast('등록하였습니다.')

      router.replace({ name: 'showroom-banner-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
