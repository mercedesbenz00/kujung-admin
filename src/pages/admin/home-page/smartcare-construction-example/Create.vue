<template>
  <page-header
    title="스마트 케어 시공사례 등록"
    breadcrumbsDepth1="스마트 케어 시공사례"
    breadcrumbsDepth2="스마트 케어 시공사례 등록"
  />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">주거공간*</div>
    <va-radio
      v-for="(option, index) in livingSpaceValues"
      :key="index"
      v-model="livingSpace"
      :option="option"
      :label="option.name"
      style="margin-right: 1rem"
    />

    <div class="label">주거형태*</div>
    <va-radio
      v-for="(option, index) in livingTypeValues"
      :key="index"
      v-model="livingType"
      :option="option"
      :label="option.name"
      style="margin-right: 1rem"
    />

    <div class="label">태그별*</div>
    <va-checkbox
      v-for="it in tags"
      v-model="tag"
      :label="it.name"
      style="margin-right: 20px; margin-top: 10px"
      :array-value="it"
    />

    <div class="label">마루정보*</div>
    <va-button @click="showProductSelectPopup = true" style="margin-bottom: 10px">마루선택</va-button><br />
    <span v-if="product === undefined" style="font-size: 0.75rem; color: gray">마루를 선택해 주세요.</span>
    <span v-if="product !== undefined">{{ product.title }}</span>

    <div class="label">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="label">요약 내용*</div>
    <va-input v-model="summary" placeholder="요약 내용을 입력해 주세요." />

    <div class="label">주소*</div>
    <va-input v-model="url" placeholder="URL을 입력해 주세요." />

    <div class="label">썸네일 이미지*</div>
    <va-file-upload v-model="thumbnailImages" />
    <div v-if="thumbnailImages.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button
        preset="secondary"
        border-color="primary"
        size="medium"
        :to="{ name: 'smartcare-construction-example-list' }"
        >취소</va-button
      >
      <va-button style="margin-left: 10px" @click="onCreate">등록</va-button>
    </div>
  </div>

  <product-select-popup
    v-if="showProductSelectPopup"
    @closed="showProductSelectPopup = false"
    @product-selected="onProductSelected"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import ProductSelectPopup from '../../../../components/popup/ProductSelectPopup.vue'
  import { useModal, useToast } from 'vuestic-ui'
  import { requestGet, requestPost, uploadFile } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import { ITag } from '../../../../interfaces/Tag'
  import { ICommonConstant } from '../../../../interfaces/CommonConstant'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const livingSpaceValues = ref<ICommonConstant[]>([])
  const livingTypeValues = ref<ICommonConstant[]>([])

  const livingSpace = ref<ICommonConstant | null>(null)
  const livingType = ref<ICommonConstant | null>(null)
  const tags = ref<ITag[]>([])
  const tag = ref<ITag[]>([])
  const product = ref()

  const title = ref<string>('')
  const summary = ref<string>('')
  const url = ref<string>('')
  const thumbnailImages = ref([])

  const showProductSelectPopup = ref<boolean>(false)

  onMounted(async () => {
    try {
      var result = await requestGet('common-constant', {
        typeList: ['area_space', 'family_type'],
      })
      livingSpaceValues.value = result.data[0].items
      livingTypeValues.value = result.data[1].items

      var result = await requestGet('tag', {})
      tags.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onProductSelected = async (p) => {
    product.value = p
  }

  const onCreate = async () => {
    if (livingSpace.value === null) {
      alert({
        message: '주거공간을 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (livingType.value === null) {
      alert({
        message: '주거형태를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (tag.value.length === 0) {
      alert({
        message: '태그를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (product.value === undefined) {
      alert({
        message: '마루를 선택해 주세요.',
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
    if (url.value === '') {
      alert({
        message: '주소 URL을 입력해 주세요.',
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
      var result = await uploadFile(thumbnailImages.value[0], 'smart-construction-case', 'y')

      await requestPost('homepage/smart-construction-case', {
        area_space_code: livingSpace.value.id,
        family_type_code: livingType.value.id,
        tags: tag.value.map((it) => ({ id: it.id })),
        product_id: product.value.id,
        title: title.value,
        summary: summary.value,
        url: url.value,
        thumb_url: result.data[0].Location,
      })
      toast('등록하였습니다.')

      router.replace({ name: 'smartcare-construction-example-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
