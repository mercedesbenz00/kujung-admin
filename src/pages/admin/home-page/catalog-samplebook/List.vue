<template>
  <page-header title="카탈로그 및 샘플북" breadcrumbsDepth1="카탈로그 및 샘플북" />
  <div class="layout fluid page-container">
    <div class="row" style="display: flex; justify-content: space-between">
      <div>
        <va-button
          v-for="cat in categoryTitles"
          :preset="category == cat ? '' : 'secondary'"
          :border-color="category == cat ? '' : 'primary'"
          @click="onCatalogClick(cat)"
          style="margin-right: 10px"
          >{{ cat }}</va-button
        >
      </div>

      <div>
        <va-select v-model="keywordType" :options="keywordTypes" style="width: 200px; margin-right: 10px" />
        <va-input v-model="keyword" style="width: 200px; margin-right: 10px" />
        <va-button @click="onSearch">검색</va-button>
      </div>
    </div>

    <div class="row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px">
      <search-result-count-view :totalDataCount="totalDataCount" :searchResultCount="searchResultCount" />
      <va-select v-model="itemsPerPage" :options="itemsPerPageValues" style="width: 150px" />
    </div>

    <div class="row">
      <table class="va-table va-table--clickable">
        <thead>
          <tr>
            <th>#</th>
            <th>썸네일 이미지</th>
            <th>제목</th>
            <th>요약내용</th>
            <th>등록일시</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td>{{ element.id }}</td>
            <td>
              <va-image :src="element.thumb_url" style="width: 100px; height: auto" />
            </td>
            <td>{{ element.title }}</td>
            <td>{{ element.summary }}</td>
            <td>{{ Common.getDateTime(element.created_at) }}</td>
            <td>
              <va-button @click.stop="onDelete(element)">삭제</va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="row" style="display: flex; justify-content: center">
      <va-pagination
        v-model="currentPageNumber"
        :pages="totalPageCount"
        :visible-pages="5"
        buttons-preset="secondary"
      />
    </div>

    <va-divider />
    <div class="row" style="justify-content: end">
      <va-button :to="{ name: 'catalog-samplebook-create' }">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestDelete, requestPost } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import { useRouter } from 'vue-router'
  import Common from '../../../../util/common'
  import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const categoryTitles = ['카탈로그', '샘플북', '룩북']
  const category = ref<string>('카탈로그')
  const categoryNames = {
    카탈로그: ['catalog'],
    샘플북: ['sample'],
    룩북: ['look'],
  }
  const keywordTypes = ['제목', '요약 내용']
  const keywordType = ref<string>('제목')
  const keywordTypeValues = {
    제목: 'title',
    '요약 내용': 'summary',
  }
  const keyword = ref<string>('')

  const itemsPerPageValues = ['20개씩 보기', '50개씩 보기', '100개씩 보기']
  const itemsPerPage = ref<string>('20개씩 보기')
  const currentPageNumber = ref<Number>(1)
  const totalPageCount = ref<Number>(0)
  const totalDataCount = ref<Number>(0)
  const searchResultCount = ref<Number>(0)
  const data = ref<any[]>()

  const getItemsPerPage = () => {
    const itemsPerPageIndex = itemsPerPageValues.indexOf(itemsPerPage.value)
    const itemsPerPageNumber = [20, 50, 100][itemsPerPageIndex]
    return itemsPerPageNumber
  }

  onMounted(() => {
    onSearch()
  })

  const onCatalogClick = (cat) => {
    category.value = cat
  }

  const onSearch = async () => {
    try {
      const result = await requestPost('homepage/catalog/list', {
        page: currentPageNumber.value,
        itemsPerPage: getItemsPerPage(),
        categoryList: categoryNames[category.value],
        q_type: keywordTypeValues[keywordType.value],
        q: keyword.value,
        needAllCount: true,
      })
      data.value = result.data.items
      searchResultCount.value = result.data.meta.totalCount
      totalDataCount.value = result.data.meta.allCount
      totalPageCount.value = result.data.meta.pageCount
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  watch([currentPageNumber, itemsPerPage, category], async () => {
    onSearch()
  })

  const onRowClick = (id) => {
    router.replace({ name: 'catalog-samplebook-edit', params: { id: id } })
  }

  const onDelete = (element) => {
    alert({
      message: `${element.title}항목을 정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`homepage/catalog/${element.id}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          data.value = [...data.value!].filter((it) => element.id !== it.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }
</script>

<style lang="scss"></style>
