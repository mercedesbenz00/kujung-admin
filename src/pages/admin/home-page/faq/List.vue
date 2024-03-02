<template>
  <page-header title="자주 묻는 질문" breadcrumbsDepth1="자주 묻는 질문" />
  <div class="layout fluid page-container">
    <div class="row" style="display: flex; justify-content: end">
      <div>
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
            <th>질문</th>
            <th>등록일시</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td>{{ element.id }}</td>
            <td>{{ element.question }}</td>
            <td>{{ Common.getDateTime(element.created_at) }}</td>
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
      <va-button :to="{ name: 'faq-create' }">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestGet } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import Common from '../../../../util/common'
  import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

  const router = useRouter()

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

  const onSearch = async () => {
    try {
      const result = await requestGet('homepage/faq', {
        page: currentPageNumber.value,
        sortBy : "created_at",
        order : "DESC",
        itemsPerPage: getItemsPerPage(),
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

  watch([currentPageNumber, itemsPerPage], async () => {
    onSearch()
  })

  const onRowClick = (id) => {
    router.replace({ name: 'faq-detail', params: { id: id } })
  }
</script>

<style lang="scss"></style>
