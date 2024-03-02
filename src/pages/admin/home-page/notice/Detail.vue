<template>
  <page-header title="공지사항 상세" breadcrumbsDepth1="공지사항" breadcrumbsDepth2="공지사항 상세" />
  <div class="layout fluid page-container">
    <va-divider />
    <h6 class="va-h6">{{ title }}</h6>

    <div class="section">
      <b>등록일시</b>&nbsp;&nbsp;&nbsp;{{ Common.getDateTime(registerDate) }}
      &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <b>조회수</b>&nbsp;&nbsp;&nbsp;&nbsp;{{ visits }}
    </div>
    <va-divider />

    <div class="section html-content-container" v-html="content" />
    <va-divider />
    
    <div>썸네일 이미지</div>
    <va-image :src="originalThumbUrl" style="width: 100px; height: auto; margin-top: 10px" />
    <va-divider />

    <div class="row" style="justify-content: space-between">
      <va-button :to="{ name: 'notice-list' }">목록으로</va-button>
      <div>
        <va-button preset="secondary" border-color="primary" size="medium" @click="onDelete">삭제</va-button>
        <va-button style="margin-left: 10px" :to="{ name: 'notice-edit', params: { id: id } }">수정</va-button>
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

  const title = ref<string>('')
  const content = ref<string>('')
  const registerDate = ref<string>('')
  const visits = ref<Number>(0)
  const originalThumbUrl = ref<string>('')

  onMounted(async () => {
    try {
      var result = (await requestGet(`homepage/notification/${id.value}`, {})).data
      title.value = result.title
      content.value = result.content
      registerDate.value = result.created_at
      visits.value = result.view_count
      originalThumbUrl.value = result.thumb_url
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
          let result = await requestDelete(`homepage/notification/${id.value}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          router.replace({ name: 'notice-list' })
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
