<template>
  <page-header title="추천검색어" breadcrumbsDepth1="추천검색어" />
  <div class="layout fluid page-container">
    <div class="row" style="display: flex; justify-content: end">
      <div>
        <va-input v-model="keyword" style="width: 200px; margin-right: 10px" />
        <va-button @click="onSearch">검색</va-button>
      </div>
    </div>

    <div class="row">
      <table class="va-table va-table--clickable">
        <thead>
          <tr>
            <th>검색어</th>
            <th>우선순위</th>
            <th>노출여부</th>
            <th>메인노출</th>
            <th>수정/삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id">
            <td>{{ element.name }}</td>
            <td>{{ element.priority }}</td>
            <td>{{ element.display ? '노출' : '미노출' }}</td>
            <td>
              <va-button v-if="element.main_display" color="info" @click="onMainDisplayOff(element)">메인노출 해제</va-button>
              <va-button v-if="element.main_display === false" color="warning"
                @click="onMainDisplayOn(element)">메인노출</va-button>
            </td>
            <td>
              <va-button preset="secondary" border-color="primary" size="medium" @click="onEdit(element)">수정</va-button>
              <va-button size="medium" @click="onDelete(element)" style="margin-start: 10px">삭제</va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <va-divider />
    <div class="row">
      <va-input v-model="name" placeholder="추천검색어를 입력해주세요." />
      <va-input v-model="priority" placeholder="추천검색어를 입력해주세요." style="margin-start: 40px; margin-end: 40px" />
      <va-radio v-for="(option, index) in displayOptions" :key="index" v-model="display" :option="option"
        style="margin-right: 1rem; margin-top: 0px" />
      <va-button style="margin-start: 40px" @click="onAdd">등록</va-button>
    </div>
    <va-divider />
    <div class="row" style="display: flex; justify-content: center">
      <va-pagination v-model="currentPageNumber" :pages="totalPageCount" :visible-pages="5" buttons-preset="secondary" />
    </div>
  </div>

  <search-term-edit-popup v-if="showSearchTermEditPopup" @saved="onEdited" @closed="showSearchTermEditPopup = false"
    :search-term="searchTermToEdit" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import PageHeader from '../../../../components/PageHeader.vue'
import { requestDelete, requestGet, requestPost, requestPut } from '../../../../util/api'
import { useModal, useToast } from 'vuestic-ui'
import { ISearchTerm } from './SearchTerm'
import SearchTermEditPopup from './SearchTermEditPopup.vue'

const { init: alert } = useModal()
const { init: toast } = useToast()

const keyword = ref<string>('')

const currentPageNumber = ref<Number>(1)
const totalPageCount = ref<Number>(0)
const data = ref<ISearchTerm[]>()
const searchTermToEdit = ref<ISearchTerm>()

const name = ref<string>('')
const priority = ref<string>('0')
const display = ref<string>('노출')
const displayOptions = ['노출', '미노출']

const showSearchTermEditPopup = ref<boolean>(false)

const search = async () => {
  try {
    const result = await requestGet('search-term', {
      page: currentPageNumber.value,
      type: 'recommend',
      q: keyword.value,
    })
    data.value = result.data.items
    totalPageCount.value = result.data.meta.pageCount
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

watch(currentPageNumber, () => {
  search()
})

onMounted(() => {
  search()
})

const onSearch = () => {
  currentPageNumber.value = 1
  search()
}

const onMainDisplayOff = async (element: ISearchTerm) => {
  try {
    await requestPut(`search-term/${element.id}`, {
      main_display: false,
    })
    toast('변경하였습니다.')

    search()
  } catch (error) {
    console.log(error)
  }
}

const onMainDisplayOn = async (element: ISearchTerm) => {
  try {
    await requestPut(`search-term/${element.id}`, {
      main_display: true,
    })
    toast('변경하였습니다.')

    search()
  } catch (error) {
    console.log(error)
  }
}

const onEdit = (element: ISearchTerm) => {
  searchTermToEdit.value = element
  showSearchTermEditPopup.value = true
}

const onEdited = () => {
  search()
}

const onDelete = (element: ISearchTerm) => {
  alert({
    message: '정말로 삭제하시겠습니까?',
    okText: '삭제',
    cancelText: '취소',
    onOk: async () => {
      try {
        let result = await requestDelete(`search-term/${element.id}`, {})
        console.log(result)
        toast('삭제하였습니다.')

        data.value = [...data.value!].filter((it) => it.id !== element.id)
      } catch (error) {
        console.log(error)
      }
    },
  })
}

const onAdd = async () => {
  if (name.value === '') {
    alert({
      message: '추천검색어를 입력해 주세요.',
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
    await requestPost('search-term', {
      name: name.value,
      type: 'recommend',
      priority: Number(priority.value),
      display: display.value === '노출',
      main_display: false,
    })
    toast('등록하였습니다.')

    name.value = ''
    priority.value = '0'
    display.value = '노출'

    search()
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="scss"></style>
./SearchTerm