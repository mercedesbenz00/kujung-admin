<template>
  <page-header title="라벨 수정" breadcrumbsDepth1="라벨 관리" breadcrumbsDepth2="라벨 수정" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">라벨명*</div>
    <va-input v-model="title" placeholder="라벨명을 입력해 주세요." />

    <div class="label">이미지*</div>
    <va-image :src="imageUrl" style="width: 100px" />
    <va-file-upload v-model="images" />
    <div v-if="images.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'label-list' }">취소</va-button>
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

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = route.params.id

  const title = ref<string>('')
  const images = ref([])
  const imageUrl = ref<string>('')

  onMounted(async () => {
    try {
      var result = (await requestGet(`label/${id}`, {})).data
      title.value = result.name
      imageUrl.value = result.image_url
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onSave = async () => {
    if (title.value === '') {
      alert({
        message: '라벨명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var uploadedImageUrl = imageUrl.value
      if (images.value.length > 0) {
        var result = await uploadFile(images.value[0], 'label', 'y')
        uploadedImageUrl = result.data[0].Location
      }

      await requestPut(`label/${id}`, {
        name: title.value,
        image_url: uploadedImageUrl,
      })
      toast('수정하였습니다.')

      router.replace({ name: 'label-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
