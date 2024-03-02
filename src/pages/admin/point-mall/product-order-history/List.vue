<template>
  <page-header title="포인트 상품 주문내역" breadcrumbsDepth1="포인트 상품 주문내역" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">처리상태</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row">
          <va-checkbox
            v-for="it in statuses"
            v-model="status"
            :label="it"
            style="margin-right: 20px"
            :array-value="it"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">주문일</div>
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
      <table class="va-table va-table--clickable">
        <thead>
          <tr>
            <th>#</th>
            <th>상품명</th>
            <th>주문자</th>
            <th>휴대폰 번호</th>
            <th>이메일</th>
            <th>요청일시</th>
            <th>처리상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td>{{ element.id }}</td>
            <td>{{ element.pointProduct?.name }}</td>
            <td>{{ element.requester?.name }}</td>
            <td>{{ element.requester?.phone }}</td>
            <td>{{ element.requester?.email }}</td>
            <td>{{ Common.getDateTime(element.created_at) }}</td>
            <td>{{ element.status === 'delivered' ? '발송완료' : '발송대기' }}</td>
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

  const statuses = ['발송대기', '발송완료']
  const statusValues = {
    발송대기: 'waiting',
    발송완료: 'delivered',
  }
  const status = ref<string[]>([])

  const keywordTypes = ref<string[]>(['상품명', '주문자', '전화번호', '이메일'])
  const keywordTypeValues = {
    상품명: 'pointProduct.name',
    주문자: 'requester.name',
    전화번호: 'requester.phone',
    이메일: 'requester.email',
  }
  const keywordType = ref<string>('상품명')

  const keyword = ref<string>()
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
      const result = await requestPost('point-product-order/list', {
        from: from.value,
        to: to.value,
        q_type: keywordTypeValues[keywordType.value],
        q: keyword.value,
        page: currentPageNumber.value,
        take: getItemsPerPage(),
        needAllCount: true,
        statusList: status.value.map((it) => statusValues[it]),
      })
      data.value = result.data.items
      searchResultCount.value = result.data.meta.totalCount
      totalPageCount.value = result.data.meta.pageCount
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onReset = () => {
    from.value = undefined
    to.value = undefined
    status.value = []
    keyword.value = ''
  }

  const onRowClick = (id) => {
    router.push({ name: 'product-order-history-detail', params: { id: id } })
  }
</script>

<style lang="scss"></style>
