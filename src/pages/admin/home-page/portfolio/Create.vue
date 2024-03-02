<template>
  <page-header title="포트폴리오 등록" breadcrumbsDepth1="포트폴리오 관리" breadcrumbsDepth2="포트폴리오 등록" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">카테고리*</div>
    <va-select v-model="category" :options="categoryValues" style="width: 200px" />

    <div class="label">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="label">요약 내용*</div>
    <va-input v-model="summary" placeholder="요약 내용을 작성해 주세요." />

    <div class="label">내용*</div>
    <va-input v-model="content" placeholder="내용을 작성해 주세요." />

    <div class="label">콜라보</div>
    <va-input v-model="collabo" placeholder="콜라보를 입력해 주세요." />

    <div class="label">일시</div>
    <va-date-input v-model="startDate" />
    -
    <va-date-input v-model="endDate" />

    <div class="label">장소</div>
    <va-input v-model="site" placeholder="장소를 입력해 주세요." />

    <div class="label">온라인 정보</div>
    <va-input v-model="online" placeholder="온라인 정보를 입력해 주세요." />

    <div class="label">이미지(최대10장)*</div>
    <va-file-upload v-model="images" />
    <div v-if="images.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'portfolio-list' }"
        >취소</va-button
      >
      <va-button style="margin-left: 10px" @click="onCreate">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { useModal, useToast } from 'vuestic-ui'
  import { requestPost, uploadFiles } from '../../../../util/api'
  import { useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const categoryValues = ['브랜드', '컨벤션', '아티스트']
  const category = ref<string>('')
  const categoryNames = {
    브랜드: 'brand',
    컨벤션: 'convention',
    아티스트: 'artist',
  }
  const title = ref<string>('')
  const summary = ref<string>('')
  const content = ref<string>('')
  const collabo = ref<string>('')
  const startDate = ref<Date>()
  const endDate = ref<Date>()
  const site = ref<string>('')
  const online = ref<string>('')
  const images = ref([])

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
    if (content.value === '') {
      alert({
        message: '내용을 입력해 주세요.',
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
    if (images.value.length > 10) {
      alert({
        message: '이미지는 최대 10장까지 선택가능합니다.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var portfolioImages = []
      if (images.value.length > 0) {
        const result = await uploadFiles(images.value, 'portfolio', 'y')
        portfolioImages = result.data.map((it) => ({ id: null, image_url: it.Location }))
      }

      await requestPost('homepage/portfolio', {
        category: categoryNames[category.value],
        title: title.value,
        summary: summary.value,
        content: content.value,
        collaboration: collabo.value,
        start_at: startDate.value,
        end_at: endDate.value,
        place: site.value,
        online_info: online.value,
        portfolioImages: portfolioImages,
      })
      toast('등록하였습니다.')

      router.replace({ name: 'portfolio-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
