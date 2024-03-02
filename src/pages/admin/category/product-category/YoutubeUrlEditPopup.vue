<template>
  <va-modal v-model="showModal" no-padding size="large" @close="$emit('closed')">
    <template #content="{ ok }">
      <div class="layout fluid" style="width: 1000px">
        <va-navbar color="#6B737F">
          <template #left>
            <va-navbar-item class="navbar-item-slot">
              <span class="title">유튜브 URL 수정</span>
            </va-navbar-item>
          </template>
          <template #right>
            <va-navbar-item class="navbar-item-slot">
              <va-button @click="ok" icon="close" />
            </va-navbar-item>
          </template>
        </va-navbar>

        <div class="layout" style="padding: 30px">
          <div class="row" style="align-items: center">
            URL:<va-input
              v-model="url"
              placeholder="유튜브 URL을 입력해주세요."
              style="margin-start: 10px; margin-end: 20px"
            />
          </div>

          <div class="row" style="justify-content: end; margin-top: 20px">
            <va-button preset="secondary" border-color="primary" size="medium" @click="onCancel">취소</va-button>
            <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
          </div>
        </div>
      </div>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useModal } from 'vuestic-ui'
  const { init: alert } = useModal()

  const showModal = ref(true)
  const emit = defineEmits(['closed', 'edited'])
  const props = defineProps<{
    url: string
  }>()

  const url = ref<string>(props.url)

  const onSave = async () => {
    if (url.value === '') {
      alert({
        message: 'URL을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    showModal.value = false
    emit('edited', url.value)
  }

  const onCancel = () => {
    showModal.value = false
  }
</script>

<style lang="scss"></style>
