<template>
  <page-header
    title="스마트 스토어 수정"
    breadcrumbsDepth1="스마트 스토어 관리"
    breadcrumbsDepth2="스마트 스토어 수정"
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
    <va-image :src="imageUrl" style="width: 100px" />
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

  const id = ref(route.params.id)

  const categories = ['리빙', '조명', '소품', '기타']

  const category = ref<string>('')
  const name = ref<string>('')
  const desc = ref<string>('')
  const url = ref<string>('')
  const thumbnailImages = ref([])
  const visible = ref<string>('노출')
  const visibleOptions = ['노출', '미노출']
  const imageUrl = ref<string>('')

  onMounted(async () => {
    try {
      var result = (await requestGet(`smart-store/${id.value}`, {})).data
      category.value = result.category
      name.value = result.name
      desc.value = result.desc
      url.value = result.address
      imageUrl.value = result.thumb_url
      visible.value = result.display ? '노출' : '미노출'
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onSave = async () => {
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
    if (desc.value === '' || desc.value === undefined) {
      alert({
        message: '상품설명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (url.value === '') {
      alert({
        message: '주소를 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var newImageUrl = imageUrl.value
      if (thumbnailImages.value.length > 0) {
        var result = await uploadFile(thumbnailImages.value[0], 'smart-store', 'y')
        newImageUrl = result.data.map((it) => it.Location)[0]
      }

      await requestPut(`smart-store/${id.value}`, {
        category: category.value,
        name: name.value,
        desc: desc.value,
        address: url.value,
        display: visible.value === '노출',
        thumb_url: newImageUrl,
      })
      toast('수정하였습니다.')

      router.replace({ name: 'smart-store-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
