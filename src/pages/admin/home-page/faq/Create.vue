<template>
  <page-header title="자주 묻는 질문 등록" breadcrumbsDepth1="자주 묻는 질문" breadcrumbsDepth2="자주 묻는 질문 등록" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">질문*</div>
    <div style="display: flex; flex-direction: row; align-items: center">
      <va-input v-model="question" placeholder="질문을 입력해 주세요." />
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
      <va-button style="margin-left: 10px" @click="onCreate">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { useModal, useToast } from 'vuestic-ui'
  import { requestPost } from '../../../../util/api'
  import { useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const question = ref<string>('')
  const answer = ref<string>('')

  const onCreate = async () => {
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
      await requestPost('homepage/faq', {
        question: question.value,
        answer: answer.value,
      })
      toast('등록하였습니다.')

      router.replace({ name: 'faq-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
