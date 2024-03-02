<template>
  <page-header title="일반회원" breadcrumbsDepth1="일반회원" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">가입일</div>
        <div class="flex flex-col search-form-value">
          <div class="row" style="align-items: center">
            <va-date-input v-model="signupDateFrom" />
            -
            <va-date-input v-model="signupDateTo" style="margin-right: 10px" />
            <va-button
              class="category-button"
              v-for="range in signupDateRangeValues"
              preset="secondary"
              border-color="primary"
              size="medium"
              @click="onSignupDateRangeBtnClick(range)"
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
      <va-select v-model="itemsPerPage" :options="itemsPerPageValues" style="width: 150px" />
    </div>

    <div class="row">
      <table class="va-table va-table--clickable">
        <thead>
          <tr>
            <th>
              <va-checkbox v-model="checkAll" />
            </th>
            <th>#</th>
            <th>SNS종류</th>
            <th>닉네임</th>
            <th>이름</th>
            <th>휴대폰번호</th>
            <th>이메일</th>
            <th>포인트</th>
            <th>가입일시</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td><va-checkbox v-model="checkedIds" :array-value="element.id" @click.stop="" /></td>
            <td>{{ element.id }}</td>
            <td>{{ element.sns_type }}11</td>
            <td>
              {{ element.nickname }}
            </td>
            <td>{{ element.name }}</td>
            <td>{{ element.phone }}</td>
            <td>{{ element.email }}</td>
            <td>{{ element.point }}</td>
            <td>{{ Common.getDateTime(element.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="row" style="justify-content: start">
      <va-button preset="secondary" border-color="primary" size="medium" @click="onSendSMS">SMS 발송</va-button>
      <va-button preset="secondary" border-color="primary" size="medium" style="margin-left: 10px" @click="onSendEmail"
        >이메일 발송</va-button
      >
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
    :is-normal-user="true"
  />
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch, watchEffect } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestGet } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import { useModal } from 'vuestic-ui'
  import SendSmsPopup from '../SendSmsPopup.vue'
  import Common from '../../../../util/common'
  import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

  const { init: alert } = useModal()
  const router = useRouter()

  const signupDateRangeValues = ['오늘', '7일', '15일', '1개월', '3개월', '6개월', '1년']
  const signupDateFrom = ref<Date>()
  const signupDateTo = ref<Date>()
  const keywordTypes = ['닉네임', '이름', '휴대폰번호', '이메일']
  const keywordTypeValues = { 닉네임: 'nickname', 이름: 'name', 휴대폰번호: 'phone', 이메일: 'email' }
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

  onMounted(() => {
    onSearch()
  })

  const onSignupDateRangeBtnClick = (range) => {
    let rangeIndex = signupDateRangeValues.indexOf(range)
    let rangeDays = [0, 7, 15, 30, 90, 180, 365][rangeIndex]
    signupDateTo.value = new Date()

    var fromDate = new Date()
    fromDate.setHours(0, 0, 0, 0)
    fromDate.setDate(fromDate.getDate() - rangeDays)
    signupDateFrom.value = fromDate
  }

  const onSearch = async () => {
    try {
      var result = await requestGet('user-management', {
        from: signupDateFrom.value,
        to: signupDateTo.value,
        q_type: keywordTypeValues[keywordType.value],
        q: keyword.value,
        page: currentPageNumber.value,
        take: getItemsPerPage(),
        needAllCount: true,
        status: 'active',
        account_type: 'general',
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
    signupDateFrom.value = undefined
    signupDateTo.value = undefined
    keywordType.value = '닉네임'
    keyword.value = ''
  }

  const onSendSMS = () => {
    if (checkedIds.value.length === 0) {
      alert({
        message: '회원을 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    showSendSmsPopup.value = true
  }

  const onSendEmail = () => {
    if (checkedIds.value.length === 0) {
      alert({
        message: '회원을 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    router.push({
      name: 'send-email',
      params: {
        users: JSON.stringify(checkedUsers.value),
        isNormalUser: 1,
      },
    })
  }

  const onRowClick = (id) => {
    router.push({ name: 'normal-user-detail', params: { user_id: id } })
  }
</script>

<style lang="scss" scoped>
  .category-button {
    height: 30px;
    margin-right: 10px;
  }
</style>
