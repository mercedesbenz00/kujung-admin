<template>
  <page-header title="상세 견적내기" breadcrumbsDepth1="상세 견적내기" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">처리상태</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row">
          <va-checkbox
            v-for="it in statusValues"
            v-model="status"
            :label="it"
            style="margin-right: 20px"
            :array-value="it"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">등록일</div>
        <div class="flex flex-col search-form-value">
          <div class="row" style="align-items: center">
            <va-date-input v-model="from" />
            -
            <va-date-input v-model="to" style="margin-right: 10px" />
            <va-button
              class="category-button"
              v-for="range in dateRangeValues"
              preset="secondary"
              border-color="primary"
              size="medium"
              @click="onDateRangeBtnClick(range)"
              >{{ range }}</va-button
            >
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">검색어</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row">
          <va-select v-model="keywordType" :options="keywordTypes" style="width: 200px; margin-right: 10px" />
          <va-input v-model="keyword" />
        </div>
      </div>
    </div>

    <div class="row" style="justify-content: center">
      <va-button preset="secondary" border-color="primary" size="medium" @click="onSearch">검색</va-button>
      <va-button style="margin-left: 10px" @click="onReset">초기화</va-button>
    </div>
    <va-divider />

    <div class="row" style="display: flex; justify-content: space-between; align-items: center">
      <search-result-count-view :totalDataCount="totalDataCount" :searchResultCount="searchResultCount" />
      <va-select v-model="itemsPerPage" :options="itemsPerPageValues" style="width: 150px" />
    </div>

    <div class="row">
      <table class="va-table">
        <thead>
          <tr>
            <th>#</th>
            <th>이름</th>
            <th>휴대폰 번호</th>
            <th>집 유형</th>
            <th>평형</th>
            <th>등록일시</th>
            <th>처리상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td>{{ element.id }}</td>
            <td>{{ element.requester.name }}</td>
            <td>{{ element.phone }}</td>
            <td>{{ element.house_style_text }}</td>
            <td>{{ element.area_space_text }}</td>
            <td>{{ Common.getDateTime(element.requested_at) }}</td>
            <td>{{ statusValues[element.status] }}</td>
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
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestPost } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import Common from '../../../../util/common'
  import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

  const router = useRouter()

  const dateRangeValues = ['오늘', '7일', '15일', '1개월', '3개월', '6개월', '1년']
  const from = ref<Date>()
  const to = ref<Date>()

  const statusValues = ['답변대기', '처리완료', '보류']
  const status = ref<string[]>([])

  const keywordTypes = ref<string[]>(['신청자명', '전화번호'])
  const keywordTypeValues = { 신청자명: 'name', 전화번호: 'phone' }
  const keywordType = ref<string>('신청자명')

  const keyword = ref<string>()
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

  const onDateRangeBtnClick = (range) => {
    let rangeIndex = dateRangeValues.indexOf(range)
    let rangeDays = [0, 7, 15, 30, 90, 180, 365][rangeIndex]
    to.value = new Date()

    var fromDate = new Date()
    fromDate.setHours(0, 0, 0, 0)
    fromDate.setDate(fromDate.getDate() - rangeDays)
    from.value = fromDate
  }

  const onSearch = async () => {
    try {
      const result = await requestPost('detailed-quotation/list', {
        from: from.value,
        to: to.value,
        q: keyword.value,
        q_type: keywordTypeValues[keywordType.value],
        status_list: status.value.map((it) => statusValues.indexOf(it)),
        page: currentPageNumber.value,
        take: getItemsPerPage(),
        needAllCount: true,
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

  watch([currentPageNumber, itemsPerPage], async () => {
    onSearch()
  })

  const onReset = () => {
    from.value = undefined
    to.value = undefined
    status.value = []
    keyword.value = ''
  }

  const onRowClick = (id) => {
    router.push({ name: 'detail-quote-detail', params: { id: id } })
  }
</script>

<style lang="scss"></style>
