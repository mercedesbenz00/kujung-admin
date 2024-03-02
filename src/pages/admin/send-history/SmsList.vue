<template>
  <page-header title="SMS 발송내역" breadcrumbsDepth1="SMS 발송내역" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">날짜</div>
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
        <div class="search-form-label">시간</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row; align-items: center">
          <va-checkbox v-model="all" label="전체" style="margin-right: 20px" />
          <va-select v-model="time" :options="timeValues" style="width: 200px; flex-grow: 0" />
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
            <th>이름,회사 또는 브랜드명<br />(닉네임)</th>
            <th>휴대폰 번호</th>
            <th>발송일시</th>
            <th>상태</th>
            <th>메시지</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id">
            <td>{{ element.id }}</td>
            <td>{{ element.name }}({{ element.nickname }})</td>
            <td>{{ element.phone }}</td>
            <td>
              {{
                element.sent_at !== null ? Common.getDateTime(element.sent_at) : Common.getDateTime(element.created_at)
              }}
            </td>
            <td>{{ ['처리중', '성공', '실패'][element.status] }}</td>
            <td>{{ element.content }}</td>
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
  import PageHeader from '../../../components/PageHeader.vue'
  import { requestGet } from '../../../util/api'
  import Common from '../../../util/common'
  import SearchResultCountView from '../../../components/views/SearchResultCountView.vue'

  const dateRangeValues = ['오늘', '7일', '15일', '1개월', '3개월', '6개월', '1년']
  const from = ref<Date>()
  const to = ref<Date>()

  const timeValues = Array(24)
    .fill(0)
    .map((_, i) => `${i}시`)
  const time = ref<string>('0시')
  const all = ref<boolean>(true)

  const keywordTypes = ref<string[]>(['받는 사람', '휴대폰 번호', '메시지'])
  const keywordTypeValues = {
    '받는 사람': 'name',
    '휴대폰 번호': 'phone',
    메시지: 'content',
  }
  const keywordType = ref<string>('받는 사람')

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
      const result = await requestGet('sms-delivery', {
        from: from.value,
        to: to.value,
        q_type: keywordTypeValues[keywordType.value],
        q: keyword.value,
        page: currentPageNumber.value,
        take: getItemsPerPage(),
        needAllCount: true,
        hour: all.value ? undefined : Number(time.value.replace('시', '')),
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

  watch([currentPageNumber, itemsPerPage], onSearch)

  const onReset = () => {
    from.value = undefined
    to.value = undefined
    all.value = true
    time.value = '0시'
    keywordType.value = '받는 사람'
    keyword.value = ''
  }
</script>

<style lang="scss"></style>
