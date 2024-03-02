<template>
  <page-header title="라벨 등록" breadcrumbsDepth1="라벨 관리" breadcrumbsDepth2="라벨 등록" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">라벨명*</div>
    <va-input v-model="title" placeholder="라벨명을 입력해 주세요." />

    <div class="label">이미지*</div>
    <va-file-upload v-model="images" />
    <div v-if="images.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'label-list' }">취소</va-button>
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

  const title = ref<string>('')
  const images = ref([])

  const onCreate = async () => {
    if (title.value === '') {
      alert({
        message: '라벨명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (images.value.length === 0) {
      alert({
        message: '이미지를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var result = await uploadFile(images.value[0], 'label', 'y')
      var labelUrl = result.data[0].Location
      console.log(result)

      await requestPost('label', {
        name: title.value,
        image_url: labelUrl,
      })
      toast('등록하였습니다.')

      router.replace({ name: 'label-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
