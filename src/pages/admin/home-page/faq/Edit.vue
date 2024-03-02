<template>
  <page-header title="자주 묻는 질문 수정" breadcrumbsDepth1="자주 묻는 질문" breadcrumbsDepth2="자주 묻는 질문 수정" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">질문*</div>
    <div style="display: flex; flex-direction: row; align-items: center">
      <va-input v-model="question" placeholder="질문을 입력해 주세요." style="margin-right: 20px" />
    </div>

    <div class="label">답변*</div>
    <QuillEditor
      v-model:content="answer"
      placeholder="답변을 작성해 주세요."
      contentType="html"
      theme="snow"
      style="height: 100px"
    />
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'faq-list' }">취소</va-button>
      <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { useModal, useToast } from 'vuestic-ui'
  import { requestGet, requestPut } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = ref(route.params.id)

  const question = ref<string>('')
  const answer = ref<string>('')

  onMounted(async () => {
    try {
      var result = (await requestGet(`homepage/faq/${id.value}`, {})).data
      question.value = result.question
      answer.value = result.answer
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onSave = async () => {
    if (question.value === '') {
      alert({
        message: '질문을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (answer.value === '') {
      alert({
        message: '답변을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      await requestPut(`homepage/faq/${id.value}`, {
        question: question.value,
        answer: answer.value,
      })
      toast('수정하였습니다.')

      router.replace({ name: 'faq-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
