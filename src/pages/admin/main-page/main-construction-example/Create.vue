<template>
  <page-header
    title="최신 인테리어팁 등록"
    breadcrumbsDepth1="최신 인테리어팁"
    breadcrumbsDepth2="최신 인테리어팁 등록"
  />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="label">주소*</div>
    <va-input v-model="url" placeholder="URL을 입력해 주세요." />

    <div class="label">썸네일 이미지*</div>
    <va-file-upload v-model="thumbnail" />
    <div v-if="thumbnail.length === 0">선택된 파일이 없습니다.</div>

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
      <va-button
        preset="secondary"
        border-color="primary"
        size="medium"
        :to="{ name: 'main-construction-example-list' }"
        >취소</va-button
      >
      <va-button style="margin-left: 10px" @click="onCreate">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'

  import { useModal, useToast } from 'vuestic-ui'
  import { requestPost, uploadFile } from '../../../../util/api'
  import { useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const title = ref<string>('')
  const url = ref<string>('')
  const thumbnail = ref([])
  const use = ref<string>('사용')

  const useOptions = ['사용', '미사용']

  const onCreate = async () => {
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

    if (thumbnail.value.length === 0) {
      alert({
        message: '썸네일 이미지를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var result = await uploadFile(thumbnail.value[0], 'main-construction-case', 'y')
      var thumbnailUrl = result.data[0].Location

      await requestPost('main-construction-case', {
        title: title.value,
        url: url.value,
        thumb_url: thumbnailUrl,
        enabled: use.value === '사용',
      })
      toast('등록하였습니다.')

      router.replace({ name: 'main-construction-example-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
