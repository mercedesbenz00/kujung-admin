<template>
  <page-header
    title="스마트 스토어 등록"
    breadcrumbsDepth1="스마트 스토어 관리"
    breadcrumbsDepth2="스마트 스토어 등록"
  />
  <div class="layout fluid page-container">
    <div class="label">카테고리*</div>
    <va-select v-model="category" :options="categories" style="width: 200px; margin-right: 10px" />

    <div class="label">상품명*</div>
    <va-input v-model="name" placeholder="상품명을 입력해 주세요." />

    <div class="label">상품 설명*</div>
    <va-input v-model="desc" placeholder="상품의 요약 설명을 입력해 주세요." />

    <div class="label">주소*</div>
    <va-input v-model="url" placeholder="url을 입력해 주세요." />

    <div class="label">썸네일 이미지*</div>
    <va-file-upload v-model="thumbnailImages" />
    <div v-if="thumbnailImages.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="label">노출 여부</div>
    <va-radio
      v-for="(option, index) in visibleOptions"
      :key="index"
      v-model="visible"
      :option="option"
      style="margin-right: 1rem"
    />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'smart-store-list' }"
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

  const categories = ['리빙', '조명', '소품', '기타']

  const category = ref<string>('')
  const name = ref<string>('')
  const desc = ref<string>('')
  const url = ref<string>('')
  const thumbnailImages = ref([])
  const visible = ref<string>('노출')
  const visibleOptions = ['노출', '미노출']

  const onCreate = async () => {
    if (category.value === '') {
      alert({
        message: '카테고리를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (name.value === '') {
      alert({
        message: '상품명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (desc.value === '') {
      alert({
        message: '상품설명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (url.value === '') {
      alert({
        message: 'url주소를 입력해 주세요.',
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
      var result = await uploadFile(thumbnailImages.value[0], 'smart-store', 'y')
      var thumbnailImageUrl = result.data.map((it) => it.Location)[0]

      await requestPost('smart-store', {
        category: category.value,
        name: name.value,
        desc: desc.value,
        address: url.value,
        thumb_url: thumbnailImageUrl,
        display: visible.value === '노출',
      })
      toast('등록하였습니다.')

      router.replace({ name: 'smart-store-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
