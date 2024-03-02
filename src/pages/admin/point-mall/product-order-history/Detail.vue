<template>
  <page-header
    title="포인트 상품 주문 내역 상세"
    breadcrumbsDepth1="포인트 상품 주문 내역"
    breadcrumbsDepth2="포인트 상품 주문 내역 상세"
  />
  <div class="layout fluid page-container va-gutter-5">
    <div>선택 상품</div>

    <div v-if="productInfo !== undefined" style="margin-top: 20px">
      <table class="va-table va-table">
        <thead>
          <tr>
            <th>이미지</th>
            <th>상품명</th>
            <th>상품 설명</th>
            <th>차감포인트</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><va-image :src="productInfo.thumb_url" style="width: 100px" /></td>
            <td>{{ productInfo.name }}</td>
            <td>{{ productInfo.summary }}</td>
            <td>{{ productInfo.point }}P</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top: 40px">주문자 정보</div>

    <div v-if="detailInfo !== undefined" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">이름</div>
        <div class="flex flex-col search-form-value">
          {{ detailInfo.requester.name }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">휴대폰 번호</div>
        <div class="flex flex-col search-form-value">
          {{ detailInfo.requester.phone }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">이메일</div>
        <div class="flex flex-col search-form-value">
          {{ detailInfo.requester.email }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">요청일시</div>
        <div class="flex flex-col search-form-value">
          {{ Common.getDateTime(detailInfo.created_at) }}
        </div>
      </div>
    </div>

    <div style="margin-top: 40px">배송지 정보</div>

    <div v-if="detailInfo !== undefined" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">수령인</div>
        <div class="flex flex-col search-form-value">
          {{ detailInfo.recipient_name }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">휴대폰 번호</div>
        <div class="flex flex-col search-form-value">
          {{ detailInfo.recipient_phone }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">배송주소</div>
        <div class="flex flex-col search-form-value">
          {{ detailInfo.delivery_addr }}&nbsp;{{ detailInfo.delivery_addr_sub }}&nbsp;{{ detailInfo.delivery_zonecode }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">배송메모</div>
        <div class="flex flex-col search-form-value">
          {{ detailInfo.delivery_memo }}
        </div>
      </div>
    </div>

    <div style="margin-top: 40px">포인트 사용</div>

    <div v-if="detailInfo !== undefined" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">보유</div>
        <div class="flex flex-col search-form-value">{{ detailInfo.requester.point }}P</div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">사용</div>
        <div class="flex flex-col search-form-value">{{ productInfo !== undefined ? productInfo.point : 0 }}P</div>
      </div>
    </div>

    <div style="margin-top: 40px">처리상태</div>

    <div v-if="detailInfo !== undefined" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">처리상태</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row">
          <va-select v-model="status" :options="statusValues" style="width: 200px; margin-right: 10px; flex-grow: 0" />
          <va-button @click="onStatusChange" style="flex-grow: 0">변경</va-button>
        </div>
      </div>
    </div>

    <div
      style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; margin-top: 40px"
    >
      <div>메모</div>
      <va-button size="medium" @click="onAddMemo">메모 등록</va-button>
    </div>

    <div class="row" style="margin-top: 10px">
      <table class="va-table va-table">
        <thead>
          <tr>
            <th>#</th>
            <th>내용</th>
            <th>작성자</th>
            <th>등록일시</th>
            <th>최종수정</th>
            <th>최종 수정일시</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in memoList" :key="element.id">
            <td>{{ element.id }}</td>
            <td>{{ element.content }}</td>
            <td>{{ element.creator.name }}</td>
            <td>{{ Common.getDateTime(element.created_at) }}</td>
            <td>{{ element.modifier }}</td>
            <td>{{ Common.getDateTime(element.updated_at) }}</td>
            <td>
              <va-button @click="onDelete(element)">삭제</va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <va-divider />

    <va-button @click="onGotoList()">목록으로</va-button>
  </div>

  <add-memo-popup v-if="showAddMemoPopup" @closed="showAddMemoPopup = false" :id="route.params.id" @added="onAdded" />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { requestDelete, requestGet, requestPost, requestPut } from '../../../../util/api'
  import PageHeader from '../../../../components/PageHeader.vue'
  import AddMemoPopup from './AddMemoPopup.vue'
  import { useModal, useToast } from 'vuestic-ui'
  import Common from '../../../../util/common'

  const router = useRouter()
  const route = useRoute()

  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const productInfo = ref(undefined)
  const detailInfo = ref(undefined)
  const memoList = ref([])
  const showAddMemoPopup = ref<boolean>(false)

  const statusValues = ['발송대기', '발송완료']
  const status = ref<string>('발송대기')

  onMounted(async () => {
    try {
      var result = (await requestGet(`point-product-order/${route.params.id}`, {})).data
      detailInfo.value = result
      productInfo.value = result.pointProduct
      status.value = result.status === 'waiting' ? '발송대기' : '발송완료'
      console.log(result)

      result = await requestPost('point-product-order/memo/list', {
        point_product_order_id: Number(route.params.id),
      })
      memoList.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onGotoList = () => {
    router.back()
  }

  const onStatusChange = async () => {
    try {
      await requestPut(`point-product-order/${route.params.id}`, {
        status: status.value === '발송대기' ? 'waiting' : 'delivered',
      })

      var result = (await requestGet(`point-product-order/${route.params.id}`, {})).data
      detailInfo.value = result
      productInfo.value = result.pointProduct
      status.value = result.status === 'waiting' ? '발송대기' : '발송완료'
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onDelete = (element) => {
    alert({
      message: '정말로 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`point-product-order/memo/${element.id}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          memoList.value = [...memoList.value!].filter((it) => it.id !== element.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onAddMemo = () => {
    showAddMemoPopup.value = true
  }

  const onAdded = async () => {
    try {
      const result = await requestPost('point-product-order/memo/list', {
        point_product_order_id: Number(route.params.id),
      })
      memoList.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
