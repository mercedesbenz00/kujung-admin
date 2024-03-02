<template>
  <page-header title="포트폴리오 상세" breadcrumbsDepth1="포트폴리오" breadcrumbsDepth2="포트폴리오 상세" />
  <div class="layout fluid page-container">
    <va-divider />
    <h6 class="va-h6">{{ title }}</h6>

    <div class="section">
      <b>카테고리:</b>
      {{ category }}
    </div>
    <va-divider />

    <div class="section">
      <b>등록일시</b>&nbsp;&nbsp;&nbsp;{{ Common.getDateTime(registerDate) }}
      &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <b>조회수</b>&nbsp;&nbsp;&nbsp;&nbsp;{{ visits }}
    </div>
    <va-divider />

    <div class="section">
      <b>요약내용:</b>
      {{ summary }}
    </div>
    <va-divider />

    <div class="section">
      <b>콜라보:</b>
      {{ collabo }}
    </div>
    <va-divider />

    <div class="section">
      <b>일시:</b>
      {{ Common.getDateTime(startDate).substring(0, 10) }} ~ {{ Common.getDateTime(endDate).substring(0, 10) }}
    </div>
    <va-divider />

    <div class="section">
      <b>장소:</b>
      {{ site }}
    </div>
    <va-divider />

    <div class="section">
      <b>온라인 정보:</b>
      {{ online }}
    </div>
    <va-divider />

    <div class="section">
      이미지
      <div style="display: flex; flex-direction: row; flex-wrap: wrap; margin-top: 10px">
        <va-image
          v-for="image in images"
          :src="image.image_url"
          style="width: 100px; height: auto; flex: 0 0 auto; margin-right: 10px; margin-bottom: 10px"
        />
      </div>
    </div>
    <va-divider />

    <div class="row" style="justify-content: space-between">
      <va-button :to="{ name: 'portfolio-list' }">목록으로</va-button>
      <div>
        <va-button preset="secondary" border-color="primary" size="medium" @click="onDelete">삭제</va-button>
        <va-button style="margin-left: 10px" :to="{ name: 'portfolio-edit', params: { id: id } }">수정</va-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'

  import { useModal, useToast } from 'vuestic-ui'
  import { requestDelete, requestGet } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'
  import Common from '../../../../util/common'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = ref(route.params.id)

  const categoryNames = {
    brand: '브랜드',
    convention: '컨벤션',
    artist: '아티스트',
  }
  const category = ref<string>('')
  const title = ref<string>('')
  const summary = ref<string>('')
  const collabo = ref<string>('')
  const startDate = ref<string>()
  const endDate = ref<string>()
  const site = ref<string>('')
  const online = ref<string>('')
  const images = ref<any[]>([])
  const registerDate = ref<string>('')
  const visits = ref<Number>(0)

  onMounted(async () => {
    try {
      var result = (await requestGet(`homepage/portfolio/${id.value}`, {})).data
      category.value = categoryNames[result.category]
      title.value = result.title
      summary.value = result.summary
      collabo.value = result.collaboration
      startDate.value = Common.getDateTime(result.start_at)
      endDate.value = Common.getDateTime(result.end_at)
      site.value = result.place
      online.value = result.online_info
      images.value = result.portfolioImages
      registerDate.value = result.updated_at
      visits.value = result.view_count
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onDelete = () => {
    alert({
      message: `정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`homepage/portfolio/${id.value}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          router.replace({ name: 'portfolio-list' })
        } catch (error) {
          console.log(error)
        }
      },
    })
  }
</script>

<style lang="scss" scoped>
  .section {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
