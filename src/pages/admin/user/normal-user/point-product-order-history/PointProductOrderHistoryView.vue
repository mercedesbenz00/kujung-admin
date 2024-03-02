<template>
  <div>
    <h6>포인트 상품 주문 내역</h6>
  </div>

  <div class="row" style="display: flex; justify-content: end">
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
          <td>{{ element.pointProduct.name }}</td>
          <td>{{ element.recipient_name }}</td>
          <td>{{ element.recipient_phone }}</td>
          <td>{{ element.requester.email }}</td>
          <td>{{ Common.getDateTime(element.created_at) }}</td>
          <td>{{ element.status === 'delivered' ? '발송완료' : '발송대기' }}</td>
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
  import { requestPost } from '../../../../../util/api'
  import Common from '../../../../../util/common'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const props = defineProps<{
    user_id: number
  }>()

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

  const onSearch = async () => {
    try {
      var result = await requestPost('point-product-order/list', {
        requester_id: Number(props.user_id),
        page: 1,
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

  onMounted(async () => {
    onSearch()
  })

  watch([currentPageNumber, itemsPerPage], async () => {
    onSearch()
  })

  const onRowClick = (id) => {
    localStorage.setItem('normal-user.detail.lastOpenedTab', '4')
    router.push({ name: 'product-order-history-detail', params: { id: id } })
  }
</script>

<style lang="scss"></style>
