<template>
  <div>
    <h6>온라인 집들이 내역</h6>
  </div>
  <div class="search-form" style="padding: 0px; margin-left: 0px; margin-right: 0px; margin-top: 20px">
    <div class="row">
      <div class="search-form-label">분류</div>
      <div class="flex flex-col search-form-value">
        <div class="row" style="padding: 10px">
          <va-checkbox
            v-for="type in types"
            v-model="checkedTypes"
            :label="type"
            :array-value="type"
            style="margin-right: 10px"
          />
        </div>
      </div>
    </div>
    <div class="row" style="margin-top: -1px">
      <div class="search-form-label">상태</div>
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
          <th>이미지</th>
          <th>제목</th>
          <th>작성자</th>
          <th>상태</th>
          <th>발행 요청일시</th>
          <th>발행 승인<br />(반려)일시</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="element in data" :key="element.id" @click="onRowClick(element)">
          <td>{{ element.id }}</td>
          <td>{{ element.entity_type == 'online' ? '랜선 집들이' : '전문가 집들이' }}</td>
          <td>
            <va-image
              :src="element.entity_type == 'online' ? element.images[0] : element.thumb_url"
              style="width: 100px; height: auto"
            />
          </td>
          <td>{{ element.title }}</td>
          <td>{{ element.requester_name }}</td>
          <td>{{ statusValues[element.status] }}</td>
          <td>{{ Common.getDateTime(element.requested_at) }}</td>
          <td>{{ element.approved_at !== null ? Common.getDateTime(element.approved_at) : '' }}</td>
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
  import { requestPost } from '../../../../util/api'
  import Common from '../../../../util/common'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const props = defineProps<{
    user_id: number
  }>()

  const types = ['랜선 집들이', '전문가 집들이']
  const typeNames = {
    '랜선 집들이': 'online',
    '전문가 집들이': 'expert',
  }
  const statusValues = ['발행 대기', '발행 완료', '발행 반려']

  const checkedTypes = ref<string[]>([])
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

  onMounted(() => {
    onSearch()
  })

  const onSearch = async () => {
    try {
      const result = await requestPost('expert-house/house-list', {
        requester_id: Number(props.user_id),
        status_list: checkedStatuses.value.map((it) => statusValues.indexOf(it)),
        entity_type_list: checkedTypes.value.map((it) => typeNames[it]),
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

  const onRowClick = (element) => {
    localStorage.setItem('normal-user.detail.lastOpenedTab', '1')

    if (element.entity_type == 'online') {
      router.push({ name: 'lan-housewarming-detail', params: { id: element.id } })
    } else {
      router.push({ name: 'expert-housewarming-detail', params: { id: element.id } })
    }
  }
</script>

<style lang="scss"></style>
