<template>
  <va-modal v-model="showModal" no-padding size="large" @close="$emit('closed')">
    <template #content="{ ok }">
      <div class="layout fluid" style="width: 1000px">
        <va-navbar color="#6B737F">
          <template #left>
            <va-navbar-item class="navbar-item-slot">
              <span class="title">태그 수정</span>
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
            태그명:<va-input
              v-model="name"
              placeholder="태그명을 입력해주세요."
              style="margin-start: 10px; margin-end: 20px"
            />
            우선순위:<va-input
              v-model="priority"
              placeholder="우선순위를 입력해주세요."
              style="margin-start: 10px; margin-end: 20px"
            />
            노출여부:
            <div style="margin-start: 10px">
              <va-radio
                v-for="(option, index) in displayOptions"
                :key="index"
                v-model="display"
                :option="option"
                style="margin-right: 1rem; margin-top: 0px"
              />
            </div>
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
  import { ref, onMounted } from 'vue'
  import { requestPut } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import { ITag } from '../../../../interfaces/Tag'
  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const showModal = ref(true)
  const emit = defineEmits(['closed', 'saved'])
  const props = defineProps<{
    tag: ITag | undefined
  }>()

  const name = ref<string>('')
  const priority = ref<string>('0')
  const display = ref<string>('노출')
  const displayOptions = ['노출', '미노출']

  onMounted(async () => {
    name.value = props.tag!.name
    priority.value = `${props.tag!.priority}`
    display.value = props.tag!.display ? '노출' : '미노출'
  })

  const onSave = async () => {
    if (name.value === '') {
      alert({
        message: '태그명을 입력해 주세요.',
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

    try {
      await requestPut(`tag/${props.tag!.id}`, {
        name: name.value,
        priority: Number(priority.value),
        display: display.value === '노출',
      })
      toast('수정하였습니다.')

      showModal.value = false
      emit('saved')
    } catch (error) {
      console.log(error)
    }
  }

  const onCancel = () => {
    showModal.value = false
  }
</script>

<style lang="scss"></style>
