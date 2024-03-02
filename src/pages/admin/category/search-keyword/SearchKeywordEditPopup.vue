<template>
  <va-modal v-model="showModal" no-padding size="large" @close="$emit('closed')">
    <template #content="{ ok }">
      <div class="layout fluid" style="width: 1000px">
        <va-navbar color="#6B737F">
          <template #left>
            <va-navbar-item class="navbar-item-slot">
              <span class="title">검색어 수정</span>
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
            검색어:<va-input v-model="name" placeholder="검색어를 입력해주세요." style="margin-start: 10px; margin-end: 20px" />
            오타검색어:<va-input v-model="typos" placeholder="오타검색어 입력해주세요." style="margin-start: 10px; margin-end: 20px" />
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
import { ISearchKeyword } from './SearchKeyword';
const { init: alert } = useModal()
const { init: toast } = useToast()

const showModal = ref(true)
const emit = defineEmits(['closed', 'saved'])
const props = defineProps<{
  searchKeyword: ISearchKeyword | undefined
}>()

const name = ref<string>('')
const typos = ref<string>('')

onMounted(async () => {
  name.value = props.searchKeyword!.name
  typos.value = `${props.searchKeyword!.searchKeywordTypos.map(it => it.typos).toString()}`
})

const onSave = async () => {
  if (name.value === '') {
    alert({
      message: '검색어를 입력해 주세요.',
      okText: '확인',
      cancelText: null,
    })
    return
  }

  try {
    const typosList: object[] = []
    typos.value.split(",").map(it => {
      typosList.push({ "typos": it })
    })
    await requestPut(`search-keyword/${props.searchKeyword!.id}`, {
      name: name.value,
      searchKeywordTypos: typosList,
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