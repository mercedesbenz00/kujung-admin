<template>
  <page-header title="이벤트 상세" breadcrumbsDepth1="이벤트" breadcrumbsDepth2="이벤트 상세" />
  <div class="layout fluid page-container">
    <va-divider />
    <div class="row" style="display: flex; flex-direction: row; justify-content: space-between">
      <h6 class="va-h6">{{ title }}</h6>
      <div>
        <b>이벤트 기간</b>
        {{ Common.getDateTime(startDate).substring(0, 10) }} ~ {{ Common.getDateTime(endDate).substring(0, 10) }}
      </div>
    </div>

    <div class="section">
      <b>등록일시</b>&nbsp;&nbsp;&nbsp;{{ Common.getDateTime(registerDate) }}
      &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <b>사용여부:</b>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: deepskyblue">{{ usage }}</span>
      &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <b>진행상태:</b>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: deepskyblue">{{ status }}</span>
    </div>
    <va-divider />

    <div class="section html-content-container" v-html="content" />

    <va-divider />

    <div>썸네일 이미지</div>
    <va-image :src="originalThumbUrl" style="width: 100px; height: auto; margin-top: 10px" />

    <va-divider />

    <div class="row" style="justify-content: space-between">
      <va-button :to="{ name: 'event-list' }">목록으로</va-button>
      <div>
        <va-button preset="secondary" border-color="primary" size="medium" @click="onDelete">삭제</va-button>
        <va-button style="margin-left: 10px" :to="{ name: 'event-edit', params: { id: id } }">수정</va-button>
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
  const startDate = ref<string>('')
  const endDate = ref<string>('')
  const usage = ref<string>('')
  const status = ref<string>('')
  const originalThumbUrl = ref<string>('')
  const registerDate = ref<string>('')

  onMounted(async () => {
    try {
      var result = (await requestGet(`homepage/event/${id.value}`, {})).data
      title.value = result.title
      content.value = result.content
      startDate.value = result.start_at
      endDate.value = result.end_at
      registerDate.value = result.created_at
      usage.value = result.enabled ? '사용' : '미사용'
      status.value = Common.getDateStatusString(new Date(result.start_at), new Date(result.end_at))
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
          let result = await requestDelete(`homepage/event/${id.value}`, {
            id: id.value,
          })
          console.log(result)
          toast('삭제하였습니다.')

          router.replace({ name: 'event-list' })
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
