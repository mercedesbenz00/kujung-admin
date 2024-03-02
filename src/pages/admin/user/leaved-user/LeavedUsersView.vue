<template>
  <div class="search-form">
    <div class="row" style="margin-top: -1px">
      <div class="search-form-label">탈퇴일</div>
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
      <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row">
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
    <div>
      <va-button preset="secondary" border-color="primary" size="medium" @click="onExcelDownload"
        >엑셀 다운로드</va-button
      >
      <va-select v-model="itemsPerPage" :options="itemsPerPageValues" style="width: 150px; margin-left: 10px" />
    </div>
  </div>

  <div class="row">
    <table class="va-table va-table--clickable">
      <thead>
        <tr>
          <th>#</th>
          <th>닉이름</th>
          <th>탈퇴일시</th>
          <th>탈퇴사유</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="element in data" :key="element.id" @click="onRowClick(element)">
          <td>{{ element.nickname }}</td>
          <td>{{ element.idle_at }}</td>
          <td>{{ element.inactive_reason }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="row" style="display: flex; justify-content: center">
    <va-pagination v-model="currentPageNumber" :pages="totalPageCount" :visible-pages="5" buttons-preset="secondary" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { requestGet } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vuestic-ui'
  import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

  const { init: toast } = useToast()
  const router = useRouter()

  const dateRangeValues = ['오늘', '7일', '15일', '1개월', '3개월', '6개월', '1년']
  const from = ref<Date>()
  const to = ref<Date>()
  const keywordTypes = ['닉네임', '회사 또는 브랜드명', '휴대폰번호', '이메일']
  const keywordTypeValues = { 닉네임: 'nickname', '회사 또는 브랜드명': 'name', 휴대폰번호: 'phone', 이메일: 'email' }
  const keywordType = ref<string>('닉네임')
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
      const result = await requestGet('user-management', {
        account_type: 'inactive',
        date_type: 'inactive_at',
        from: from.value,
        to: to.value,
        q_type: keywordTypeValues[keywordType.value],
        q: keyword.value,
        page: currentPageNumber.value,
        take: getItemsPerPage(),
        needAllCount: true,
        status: 'inactive',
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

  const onReset = () => {
    from.value = undefined
    to.value = undefined
    keywordType.value = '닉네임'
    keyword.value = ''
  }

  const onExcelDownload = () => {
    toast('서비스 준비중입니다.')
  }

  const onRowClick = (element) => {
    if (element.type === '기업회원') {
      router.push({ name: 'business-user-detail', params: { user_id: element.id } })
    } else {
      router.push({ name: 'normal-user-detail', params: { user_id: element.id } })
    }
  }
</script>

<style lang="scss" scoped>
  .category-button {
    height: 30px;
    margin-right: 10px;
  }
</style>
