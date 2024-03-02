<template>
  <page-header title="기업 회원 승인대기" breadcrumbsDepth1="기업 회원 승인대기" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row" v-if="false">
        <div class="search-form-label">기업유형</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row">
          <va-radio
            v-for="(option, index) in typeOptions"
            :key="index"
            v-model="type"
            :option="option"
            style="margin-top: 0px; margin-right: 1rem; flex-grow: 0"
          />
        </div>
      </div>

      <div class="row">
        <div class="search-form-label">사업자유형</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row">
          <va-radio
            v-for="(option, index) in businessTypeOptions"
            :key="index"
            v-model="businessType"
            :option="option"
            style="margin-top: 0px; margin-right: 1rem; flex-grow: 0"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">날짜</div>
        <div class="flex flex-col search-form-value">
          <div class="row" style="align-items: center">
            <va-select v-model="dateType" :options="dateTypeValues" style="width: 100px; margin-right: 10px" />
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
      <va-select v-model="itemsPerPage" :options="itemsPerPageValues" style="width: 150px; margin-left: 10px" />
    </div>

    <div class="row">
      <table class="va-table va-table--clickable">
        <thead>
          <tr>
            <th>
              <va-checkbox v-model="checkAll" />
            </th>
            <th>#</th>
            <th>사업자 유형</th>
            <th>아이디</th>
            <th>닉네임</th>
            <th>회사 또는 브랜드명</th>
            <th>휴대폰번호</th>
            <th>이메일</th>
            <th>포인트</th>
            <th>신청일시</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td><va-checkbox v-model="checkedIds" :array-value="element.id" @click.stop="" /></td>
            <td>{{ element.id }}</td>
            <td>{{ element.manager_type === 'legal' ? '법인' : '개인' }}</td>
            <td>{{ element.business_reg_num }}</td>
            <td>{{ element.nickname }}</td>
            <td>{{ element.company_name }}</td>
            <td>{{ element.phone }}</td>
            <td>{{ element.email }}</td>
            <td>{{ element.point }}</td>
            <td>
              {{ Common.getDateTime(element.created_at) }}
              <va-button style="margin-left: 10px" @click.stop="onApprove(element)">승인</va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="row" style="justify-content: start">
      <va-button preset="secondary" border-color="primary" size="medium" @click="onApproveChecked">선택 승인</va-button>
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
  </div>

  <send-sms-popup
    v-if="showSendSmsPopup"
    @closed="showSendSmsPopup = false"
    :users="checkedUsers"
    :is-normal-user="false"
  />
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch, watchEffect } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestGet, requestPost } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import { useModal, useToast } from 'vuestic-ui'
  import SendSmsPopup from '../SendSmsPopup.vue'
  import Common from '../../../../util/common'
  import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const typeOptions = ['전체', '인테리어', '대리점']
  const type = ref<string>('전체')

  const businessTypeOptions = ['전체', '개인', '법인']
  const businessType = ref<string>('전체')

  const dateTypeValues = ref<string[]>(['신청일', '승인일'])
  const dateType = ref<string>('신청일')
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
  const checkAll = ref<boolean>(false)
  const checkedIds = ref<number[]>([])

  const showSendSmsPopup = ref<boolean>(false)

  const checkedUsers = computed(() => {
    let checkedItems = data.value!.filter((item) => checkedIds.value.indexOf(item.id) !== -1)
    return checkedItems
  })

  watchEffect(() => {
    if (data.value !== undefined) {
      if (checkAll.value) {
        let ids = data.value.map((item) => item.id)
        checkedIds.value = [...ids]
      } else {
        checkedIds.value = []
      }
    }
  })

  const getItemsPerPage = () => {
    const itemsPerPageIndex = itemsPerPageValues.indexOf(itemsPerPage.value)
    const itemsPerPageNumber = [20, 50, 100][itemsPerPageIndex]
    return itemsPerPageNumber
  }

  onMounted(async () => {
    try {
      const result = await requestGet('user-management', {
        page: currentPageNumber.value,
        take: getItemsPerPage(),
        needAllCount: true,
        status: 'waiting_approval',
        account_type: 'business',
      })
      data.value = result.data.items
      searchResultCount.value = result.data.meta.totalCount
      totalPageCount.value = result.data.meta.pageCount
      totalDataCount.value = result.data.meta.allCount
      console.log(result)
    } catch (error) {
      console.log(error)
    }
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
      var result = await requestGet('user-management', {
        from: from.value,
        to: to.value,
        q_type: keywordTypeValues[keywordType.value],
        q: keyword.value,
        page: currentPageNumber.value,
        take: getItemsPerPage(),
        needAllCount: true,
        status: 'waiting_approval',
        account_type: 'business',
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

  watch([currentPageNumber, itemsPerPage], () => {
    onSearch()
  })

  const onReset = () => {
    type.value = '전체'
    businessType.value = '전체'
    from.value = undefined
    to.value = undefined
    keywordType.value = '닉네임'
    keyword.value = ''
  }

  const onApprove = (element) => {
    alert({
      message: `해당 회원을 승인하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestPost('user-management/status/multi', {
            ids: [element.id],
            status: 'active',
          })
          console.log(result)
          toast('승인하였습니다.')

          data.value = [...data.value!].filter((it) => element.id !== it.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onApproveChecked = async () => {
    if (checkedIds.value.length === 0) {
      alert({
        message: '회원을 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      let result = await requestPost('user-management/status/multi', {
        ids: checkedIds.value,
        status: 'active',
      })
      console.log(result)
      toast('승인하였습니다.')

      onSearch()
    } catch (error) {
      console.log(error)
    }
  }

  const onRowClick = (id) => {
    router.push({ name: 'business-user-detail', params: { user_id: id } })
  }
</script>

<style lang="scss" scoped>
  .category-button {
    height: 30px;
    margin-right: 10px;
  }
</style>
