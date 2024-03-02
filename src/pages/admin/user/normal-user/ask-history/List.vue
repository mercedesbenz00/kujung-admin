<template>
  <div>
    <h6>1:1 문의 내역</h6>
  </div>
  <div class="search-form" style="padding: 0px; margin-left: 0px; margin-right: 0px; margin-top: 20px">
    <div class="row">
      <div class="search-form-label">분류</div>
      <div class="flex flex-col search-form-value">
        <div class="row" style="padding: 10px">
          <va-checkbox
            v-for="type in typeValues"
            v-model="checkedTypes"
            :label="type.name"
            :array-value="type"
            style="margin-right: 10px"
          />
        </div>
      </div>
    </div>
    <div class="row" style="margin-top: -1px">
      <div class="search-form-label">처리상태</div>
      <div class="flex flex-col search-form-value">
        <div class="row" style="padding: 10px">
          <va-checkbox
            v-for="status in statusValues"
            v-model="checkedStatuses"
            :label="status"
            :array-value="status"
            style="margin-right: 10px"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="row" style="justify-content: center">
    <va-button preset="secondary" border-color="primary" size="medium" @click="onSearch">검색</va-button>
    <va-button style="margin-left: 10px" @click="onReset">초기화</va-button>
  </div>
  <va-divider />

  <div class="row" style="display: flex; justify-content: end">
    <va-select v-model="itemsPerPage" :options="itemsPerPageValues" style="width: 150px" />
  </div>

  <div class="row">
    <table class="va-table va-table--clickable">
      <thead>
        <tr>
          <th>#</th>
          <th>분류</th>
          <th>제목</th>
          <th>이름</th>
          <th>휴대폰번호</th>
          <th>등록일시</th>
          <th>처리상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
          <td>{{ element.id }}</td>
          <td>{{ element.question_type_info?.name }}</td>
          <td>{{ element.question_title }}</td>
          <td>{{ element.requester.name }}</td>
          <td>{{ element.requester.phone }}</td>
          <td>{{ Common.getDateTime(element.requested_at) }}</td>
          <td>{{ statusValues[element.status] }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="row" style="display: flex; justify-content: center">
    <va-pagination v-model="currentPageNumber" :pages="totalPageCount" :visible-pages="5" buttons-preset="secondary" />
  </div>

  <va-divider />
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { requestGet, requestPost } from '../../../../../util/api'
  import Common from '../../../../../util/common'
  import { ICommonConstant, getConstantsIds } from '../../../../../interfaces/CommonConstant'

  const props = defineProps<{
    user_id: number
  }>()

  const emit = defineEmits(['showDetail'])

  const typeValues = ref<ICommonConstant[]>([])
  const checkedTypes = ref<ICommonConstant[]>([])

  const statusValues = ['답변대기', '처리완료', '보류']
  const checkedStatuses = ref<string[]>([])

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

  onMounted(async () => {
    try {
      let result = await requestGet('common-constant', {
        typeList: ['question_type'],
      })
      typeValues.value = result.data[0].items
      console.log(result)

      onSearch()
    } catch (error) {
      console.log(error)
    }
  })

  const onSearch = async () => {
    try {
      let result = await requestPost('question-and-answer/list', {
        requester_id: Number(props.user_id),
        question_type_list: getConstantsIds(checkedTypes.value),
        status_list: checkedStatuses.value.map((it) => statusValues.indexOf(it)),
        page: currentPageNumber.value,
        take: getItemsPerPage(),
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

  const onReset = () => {
    checkedStatuses.value = []
    checkedTypes.value = []
  }

  const onRowClick = (elementId) => {
    emit('showDetail', elementId)
  }
</script>

<style lang="scss"></style>
