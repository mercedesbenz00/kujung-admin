<template>
  <page-header title="검색어관리" breadcrumbsDepth1="검색어관리" />
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
            <th>오타키워드</th>
            <th>수정/삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id">
            <td>{{ element.name }}</td>
            <td>{{ element.searchKeywordTypos.map(it => it.typos).toString() }}</td>
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
      <va-input v-model="name" placeholder="검색어를 입력해주세요." />
      <va-input v-model="typos" placeholder="오타검색어를 반점으로 구분하여 입력해주세요." style="margin-start: 40px; margin-end: 40px" />
      <va-button style="margin-start: 40px" @click="onAdd">등록</va-button>
    </div>
    <va-divider />
    <div class="row" style="display: flex; justify-content: center">
      <va-pagination v-model="currentPageNumber" :pages="totalPageCount" :visible-pages="5" buttons-preset="secondary" />
    </div>
  </div>

  <search-keyword-edit-popup v-if="showSearchKeywordEditPopup" @saved="onEdited" @closed="showSearchKeywordEditPopup = false"
    :search-keyword="showSearchKeywordToEdit" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import PageHeader from '../../../../components/PageHeader.vue'
import { requestDelete, requestGet, requestPost, requestPut } from '../../../../util/api'
import { useModal, useToast } from 'vuestic-ui'
import { ISearchKeyword } from './SearchKeyword'
import SearchKeywordEditPopup from './SearchKeywordEditPopup.vue'
import { array } from '@amcharts/amcharts5'

const { init: alert } = useModal()
const { init: toast } = useToast()

const keyword = ref<string>('')

const currentPageNumber = ref<Number>(1)
const totalPageCount = ref<Number>(0)
const data = ref<ISearchKeyword[]>()
const showSearchKeywordToEdit = ref<ISearchKeyword>()

const name = ref<string>('')
const typos = ref<string>('')

const showSearchKeywordEditPopup = ref<boolean>(false)

const search = async () => {
  try {
    const result = await requestPost('search-keyword/list', {
      page: currentPageNumber.value,
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

const onEdit = (element: ISearchKeyword) => {
  showSearchKeywordToEdit.value = element
  showSearchKeywordEditPopup.value = true
}

const onEdited = () => {
  search()
}

const onDelete = (element: ISearchKeyword) => {
  alert({
    message: '정말로 삭제하시겠습니까?',
    okText: '삭제',
    cancelText: '취소',
    onOk: async () => {
      try {
        let result = await requestDelete(`search-keyword/${element.id}`, {})
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
    await requestPost('search-keyword', {
      name: name.value,
      searchKeywordTypos: typosList,
    })
    toast('등록하였습니다.')

    name.value = ''
    typos.value = ''
    search()
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="scss"></style>