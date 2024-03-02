<template>
  <page-header title="스마트케어 신청" breadcrumbsDepth1="스마트케어 신청" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">처리상태</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row">
          <va-checkbox v-for="it in statusValues" v-model="status" :label="it" style="margin-right: 20px"
            :array-value="it" />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">등록일</div>
        <div class="flex flex-col search-form-value">
          <div class="row" style="align-items: center">
            <va-date-input v-model="from" />
            -
            <va-date-input v-model="to" style="margin-right: 10px" />
            <va-button class="category-button" v-for="range in dateRangeValues" preset="secondary" border-color="primary"
              size="medium" @click="onDateRangeBtnClick(range)">{{ range }}</va-button>
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
            <th>최초일자</th>
            <th>처리상태</th>
            <th>고객명</th>
            <th>연락처</th>
            <th>주소</th>
            <th>제품명</th>
            <th>시공관련 특이사항</th>
            <th>견적서</th>
            <th>SMS 전송</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)"
            v-bind:style="!element.quote_url ? 'background-color: red; color: white; ' : ''">
            <td>{{ element.id }}</td>
            <td>{{ Common.getDateTime(element.requested_at) }}</td>
            <td>{{ statusValues[element.status] }}</td>
            <td>{{ element.name }}</td>
            <td>{{ element.phone }}</td>
            <td>{{ element.addr + " " + element.addr_sub }}</td>
            <td>{{ element.product_name }}</td>
            <td>{{ element.special_note }}</td>
            <td>
              <va-button v-if="element.quote_url" preset="secondary" border-color="primary" size="medium"
                @click="(e: any) => { onDownloadQuote(e, element.quote_url) }">견적서
                다운로드</va-button>
            </td>
            <td> <va-button preset="secondary" border-color="primary" size="medium"
                @click="(e: any) => onSendSMS(e, element)">SMS 발송</va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="row" style="display: flex; justify-content: center">
      <va-pagination v-model="currentPageNumber" :pages="totalPageCount" :visible-pages="5" buttons-preset="secondary" />
    </div>
  </div>

  <send-sms-popup v-if="showSendSmsPopup" @closed="showSendSmsPopup = false" :users="checkedUsers"
    :is-normal-user="true" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import PageHeader from '../../../components/PageHeader.vue'
import { requestPost } from '../../../util/api'
import { useRouter } from 'vue-router'
import Common from '../../../util/common'
import SearchResultCountView from '../../../components/views/SearchResultCountView.vue'
import SendSmsPopup from '../../admin/user/SendSmsPopup.vue'

const router = useRouter()

const dateRangeValues = ['오늘', '7일', '15일', '1개월', '3개월', '6개월', '1년']
const from = ref<Date>()
const to = ref<Date>()

const statusValues = ['접수완료', '컨설팅 예정', '시공예정', '시공완료', '상담종료']
const status = ref<string[]>([])

const keywordTypes = ref<string[]>(['고객명', '전화번호', '주소'])
const keywordTypeValues = { 신청자명: 'name', 전화번호: 'phone', 주소: 'addr' }
const keywordType = ref<string>('고객명')

const keyword = ref<string>()
const itemsPerPageValues = ['20개씩 보기', '50개씩 보기', '100개씩 보기']
const itemsPerPage = ref<string>('20개씩 보기')
const currentPageNumber = ref<Number>(1)
const totalPageCount = ref<Number>(0)
const totalDataCount = ref<Number>(0)
const searchResultCount = ref<Number>(0)
const data = ref<any[]>()

const showSendSmsPopup = ref<boolean>(false)
const checkedUsers = ref<any>([])


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
    const result = await requestPost('/homepage/smartcare-service/list', {
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
  router.push({ name: 'smartcare-request-detail', params: { id: id } })
}

const onSendSMS = (e: any, p_item: any) => {
  e.stopPropagation()
  checkedUsers.value = [{ phone: p_item.phone, name: p_item.name, nickname: p_item.name, allow_sms_recv: true }]
  showSendSmsPopup.value = true
}

const onDownloadQuote = (e: any, p_url: any) => {
  e.stopPropagation()
  window.open(p_url, '_blank');
}

</script>

<style lang="scss"></style>
