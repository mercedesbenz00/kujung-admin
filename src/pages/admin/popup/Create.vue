<template>
  <page-header title="팝업 등록" breadcrumbsDepth1="팝업 관리" breadcrumbsDepth2="팝업 등록" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">팝업명*</div>
    <va-input v-model="title" placeholder="팝업명을 입력해 주세요." />

    <div class="label">우선순위 (숫자가 낮을수록 위로 노출됩니다.)</div>
    <va-input v-model="priority" placeholder="우선순위를 입력해 주세요." />

    <div class="row xs12">
      <div class="flex xs6">
        <div class="label">주소</div>
        <va-input v-model="address" placeholder="URL을 입력해 주세요." />
      </div>
      <div class="flex" style="margin-left: 20px">
        <div class="label">타겟</div>
        <va-radio
          v-for="(option, index) in targetOptions"
          :key="index"
          v-model="target"
          :option="option"
          style="margin-right: 1rem"
        />
      </div>
    </div>

    <div class="label">PC*</div>
    <va-file-upload v-model="pc" />
    <div v-if="pc.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="label">모바일*</div>
    <va-file-upload v-model="mobile" />
    <div v-if="mobile.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

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
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'popup-list' }">취소</va-button>
      <va-button style="margin-left: 10px" @click="onCreate">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import PageHeader from '../../../components/PageHeader.vue'

  import { useModal, useToast } from 'vuestic-ui'
  import { requestPost, uploadFile } from '../../../util/api'
  import { useRouter } from 'vue-router'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const title = ref<string>('')
  const priority = ref<string>('')
  const address = ref<string>('')
  const target = ref<string>('현재창')
  const pc = ref([])
  const mobile = ref([])
  const use = ref<string>('사용')

  const targetOptions = ['현재창', '새창', '이동 안함']
  const useOptions = ['사용', '미사용']

  const onCreate = async () => {
    if (title.value === '') {
      alert({
        message: '팝업명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (priority.value === '') {
      alert({
        message: '우선순위를 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (pc.value.length === 0) {
      alert({
        message: 'PC용 이미지를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (mobile.value.length === 0) {
      alert({
        message: '모바일용 이미지를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var pcUrl = ''
      var pcThumbUrl = ''
      if (pc.value.length > 0) {
        var result = await uploadFile(pc.value[0], 'popup', 'y')
        pcUrl = result.data[0].Location
        pcThumbUrl = result.data[0].thumbLocation
        console.log(result)
      }

      var mobileUrl = ''
      var mobileThumbUrl = ''
      if (mobile.value.length > 0) {
        result = await uploadFile(mobile.value[0], 'popup', 'y')
        mobileUrl = result.data[0].Location
        mobileThumbUrl = result.data[0].thumbLocation
      }

      await requestPost('popup', {
        title: title.value,
        priority: Number(priority.value),
        url: address.value,
        target: targetOptions.indexOf(target.value),
        image_url: pcUrl,
        thumb_url: pcThumbUrl,
        image_url_mobile: mobileUrl,
        thumb_url_mobile: mobileThumbUrl,
        enabled: use.value === '사용',
      })
      toast('등록하였습니다.')

      router.replace({ name: 'popup-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
