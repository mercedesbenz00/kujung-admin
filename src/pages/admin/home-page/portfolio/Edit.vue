<template>
  <page-header title="포트폴리오 수정" breadcrumbsDepth1="포트폴리오 관리" breadcrumbsDepth2="포트폴리오 수정" />
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
    <div style="display: flex; flex-direction: row; flex-wrap: wrap; margin-top: 10px">
      <div v-for="(image, index) in originalImages" style="display: flex; flex-direction: column; align-items: center">
        <va-image
          :src="image.image_url"
          style="width: 100px; height: auto; flex: 0 0 auto; margin-right: 10px; margin-bottom: 10px"
        />
        <va-button size="small" @click="onDeleteImage(index)">삭제</va-button>
      </div>
    </div>
    <va-file-upload v-model="images" />
    <div v-if="images.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'portfolio-list' }"
        >취소</va-button
      >
      <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { useModal, useToast } from 'vuestic-ui'
  import { requestGet, requestPut, uploadFiles } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'
  import Common from '../../../../util/common'
  import { getMergedImages } from '../../../../interfaces/Image'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = ref(route.params.id)

  const categoryValues = ['브랜드', '컨벤션', '아티스트']
  const category = ref<string>('')
  const categoryTitles = {
    brand: '브랜드',
    convention: '컨벤션',
    artist: '아티스트',
  }
  const categoryNames = {
    브랜드: 'brand',
    컨벤션: 'convention',
    아티스트: 'artist',
  }
  const title = ref<string>('')
  const summary = ref<string>('')
  const content = ref<string>('')
  const collabo = ref<string>('')
  const startDate = ref<Date | null>()
  const endDate = ref<Date | null>()
  const site = ref<string>('')
  const online = ref<string>('')
  const originalImages = ref<any[]>([])
  const images = ref([])

  onMounted(async () => {
    try {
      var result = (await requestGet(`homepage/portfolio/${id.value}`, {})).data
      category.value = categoryTitles[result.category]
      title.value = result.title
      summary.value = result.summary
      content.value = result.content
      collabo.value = result.collaboration
      startDate.value = Common.getDate(result.start_at)
      endDate.value = Common.getDate(result.end_at)
      site.value = result.place
      online.value = result.online_info
      originalImages.value = result.portfolioImages
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onDeleteImage = (index) => {
    originalImages.value.splice(index, 1)
    originalImages.value = [...originalImages.value]
  }

  const onSave = async () => {
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
    if (originalImages.value.length + images.value.length > 10) {
      alert({
        message: '이미지는 최대 10장까지 선택가능합니다.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var portfolioImages = originalImages.value
      if (images.value.length > 0) {
        const result = await uploadFiles(images.value, 'portfolio', 'y')
        portfolioImages = getMergedImages(portfolioImages, result.data)
      }

      await requestPut(`homepage/portfolio/${id.value}`, {
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
      toast('수정하였습니다.')

      router.replace({ name: 'portfolio-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
