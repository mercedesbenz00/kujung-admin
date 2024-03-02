<template>
  <va-modal v-model="showModal" no-padding size="large" @close="$emit('closed')">
    <template #content="{ ok }">
      <div class="layout fluid" style="width: 1000px">
        <va-navbar color="#6B737F">
          <template #left>
            <va-navbar-item class="navbar-item-slot">
              <span class="title">탈퇴 요청 사유</span>
            </va-navbar-item>
          </template>
          <template #right>
            <va-navbar-item class="navbar-item-slot">
              <va-button @click="ok" icon="close" />
            </va-navbar-item>
          </template>
        </va-navbar>

        <div class="layout va-gutter-5">
          <div class="search-form">
            <div class="row">
              <div class="search-form-label">탈퇴사유</div>
              <div class="flex flex-col search-form-value">
                <va-radio v-for="(option, index) in reasonOptions" :key="index" v-model="reason" :option="option" />
                <va-input type="textarea" v-model="content" rows="3" style="margin-top: 10px" />
              </div>
            </div>

            <div class="row" style="justify-content: end; margin-top: 20px">
              <va-button preset="secondary" border-color="primary" size="medium" @click="onCancel">취소</va-button>
              <va-button style="margin-left: 10px" @click="onSave">저장</va-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { requestPost } from '../../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const showModal = ref(true)
  defineEmits(['closed'])
  const props = defineProps<{
    user_id: number
  }>()

  const reasonOptions = ['개인정보 노출우려', '서비스 불만', '고객응대 부족', '재가입을 위해서', '기타']
  const reason = ref<string>('')
  const content = ref<string>('')

  onMounted(async () => {})

  const onSave = async () => {
    if (reason.value === '') {
      alert({
        message: '탈퇴사유를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var result = await requestPost('user-exit', {
        reason: reason.value,
        content: content.value,
      })
      console.log(result)
      toast('탈퇴하였습니다.')

      showModal.value = false
    } catch (error) {
      console.log(error)
    }
  }

  const onCancel = () => {
    showModal.value = false
  }
</script>

<style lang="scss"></style>
