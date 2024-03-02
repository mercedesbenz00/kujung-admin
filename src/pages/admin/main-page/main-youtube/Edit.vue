<template>
  <page-header title="메인 유튜브 수정" breadcrumbsDepth1="메인 유튜브 관리" breadcrumbsDepth2="메인 유튜브 수정" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="label">주소*</div>
    <va-input v-model="url" placeholder="URL을 입력해 주세요." />

    <div class="label">사용여부</div>
    <va-radio
      v-for="(option, index) in useOptions"
      :key="index"
      v-model="use"
      :option="option"
      style="margin-right: 1rem"
    />

    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'main-youtube-list' }"
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
  import { requestGet, requestPut } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = route.params.id

  const title = ref<string>('')
  const url = ref<string>('')
  const use = ref<string>('사용')

  const useOptions = ['사용', '미사용']

  onMounted(async () => {
    try {
      var result = (await requestGet(`main-youtube/${id}`, {})).data
      title.value = result.title
      url.value = result.video_url
      use.value = result.enabled ? '사용' : '미사용'
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onSave = async () => {
    if (title.value === '') {
      alert({
        message: '제목을 입력해 주세요.',
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

    try {
      await requestPut(`main-youtube/${id}`, {
        title: title.value,
        video_url: url.value,
        enabled: use.value === '사용',
      })
      toast('수정하였습니다.')

      router.replace({ name: 'main-youtube-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
