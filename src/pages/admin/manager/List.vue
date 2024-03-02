<template>
  <page-header title="관리자 관리" breadcrumbsDepth1="관리자 관리" />
  <div class="layout fluid page-container">
    <div class="row" style="display: flex; justify-content: end">
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
            <th>아이디</th>
            <th>이름</th>
            <th>성별</th>
            <th>휴대폰 번호</th>
            <th>이메일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element)">
            <td>{{ element.user_id }}</td>
            <td>{{ element.name }}</td>
            <td>{{ element.gender }}</td>
            <td>{{ element.phone }}</td>
            <td>{{ element.email }}</td>
            <td>{{ element.disabled ? '사용중지' : '사용중' }}</td>
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
      <va-button :to="{ name: 'manager-create' }">추가</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../components/PageHeader.vue'
  import { requestGet } from '../../../util/api'
  import { useRouter } from 'vue-router'
  import SearchResultCountView from '../../../components/views/SearchResultCountView.vue'

  const router = useRouter()

  const keywordTypes = ['아이디', '이름', '휴대폰 번호', '이메일']
  const keywordTypeValues = { 아이디: 'user_id', 이름: 'name', '휴대폰 번호': 'phone', 이메일: 'email' }
  const keywordType = ref<string>('아이디')
  const keyword = ref<string>('')

  const itemsPerPageValues = ['20개씩 보기', '50개씩 보기', '100개씩 보기']
  const itemsPerPage = ref<string>('20개씩 보기')
  const currentPageNumber = ref<Number>(1)
  const totalPageCount = ref<Number>(0)
  const totalDataCount = ref<Number>(0)
  const searchResultCount = ref<Number>(0)
  const data = ref<any[]>()

  watch([currentPageNumber, itemsPerPage], () => {
    onSearch()
  })

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
      const result = await requestGet('admin', {
        page: currentPageNumber.value,
        q_type: keywordTypeValues[keywordType.value],
        q: keyword.value,
        needAllCount: true,
        take: getItemsPerPage(),
      })
      data.value = result.data.items
      searchResultCount.value = result.data.meta.totalCount
      totalPageCount.value = result.data.meta.pageCount
      totalDataCount.value = result.data.meta.allCount
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onRowClick = (element) => {
    router.replace({ name: 'manager-edit', params: { id: element.id } })
  }
</script>

<style lang="scss"></style>
