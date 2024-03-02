<template>
  <page-header title="자주 묻는 질문 상세" breadcrumbsDepth1="자주 묻는 질문" breadcrumbsDepth2="자주 묻는 질문 상세" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">등록일시</div>
        <div class="flex flex-col search-form-value">
          {{ Common.getDateTime(registerDate) }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">질문</div>
        <div class="flex flex-col search-form-value">
          {{ question }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">답변</div>
        <div class="flex flex-col search-form-value html-content-container" v-html="answer" />
      </div>
    </div>
    <va-divider />

    <div class="row" style="justify-content: space-between">
      <va-button :to="{ name: 'faq-list' }">목록으로</va-button>
      <div>
        <va-button preset="secondary" border-color="primary" size="medium" @click="onDelete">삭제</va-button>
        <va-button style="margin-left: 10px" :to="{ name: 'faq-edit', params: { id: id } }">수정</va-button>
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

  const question = ref<string>('')
  const answer = ref<string>('')
  const registerDate = ref<string>('')

  onMounted(async () => {
    try {
      var result = (await requestGet(`homepage/faq/${id.value}`, {})).data
      question.value = result.question
      answer.value = result.answer
      registerDate.value = result.created_at
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
          let result = await requestDelete(`homepage/faq/${id.value}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          router.replace({ name: 'faq-list' })
        } catch (error) {
          console.log(error)
        }
      },
    })
  }
</script>

<style lang="scss"></style>
