<template>
  <page-header title="상세 견적내기 상세" breadcrumbsDepth1="상세 견적내기" breadcrumbsDepth2="상세 견적내기 상세" />
  <div class="layout fluid page-container va-gutter-5">
    <div>기본정보</div>

    <div v-if="detailInfo !== undefined" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">이름</div>
        <div class="flex flex-col search-form-value-small">
          {{ detailInfo.name }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">등록일시</div>
        <div class="flex flex-col search-form-value-small">
          <div style="margin-start: 10px">
            {{ Common.getDateTime(detailInfo.requested_at) }}
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">휴대폰 번호</div>
        <div class="flex flex-col search-form-value">
          {{ detailInfo.phone }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">주소</div>
        <div class="flex flex-col search-form-value">
          {{ detailInfo.addr }}
        </div>
      </div>
    </div>

    <div style="margin-top: 40px">상세 견적내기 정보</div>

    <div v-if="detailInfo !== undefined" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">집 유형</div>
        <div class="flex flex-col search-form-value-small">
          {{ detailInfo.house_style_text }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">평 형</div>
        <div class="flex flex-col search-form-value-small">
          <div style="margin-start: 10px">
            {{ detailInfo.area_space_text }}
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">시공 범위</div>
        <div class="flex flex-col search-form-value-small">{{ detailInfo.living_room_count > 0 ? "거실, " : "" }}
          {{ detailInfo.kitchen_count > 0 ? "부엌, " : "" }}
          {{
            detailInfo.room_count > 0 ? "방" + detailInfo.room_count + "개" : "" }}</div>
        <div class="search-form-label" style="margin-left: -1px">마루 종류</div>
        <div class="flex flex-col search-form-value-small">
          <div style="margin-start: 10px">
            {{
              Common.getCategoryString(
                detailInfo.category
              )
            }}
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">특이사항</div>
        <div class="flex flex-col search-form-value">
          {{ detailInfo.remark }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">평면도</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row">
          <va-image v-for="imageUrl in detailInfo.detailedQuotationImages" :src="imageUrl.image_url"
            style="width: 100px; height: auto; flex-grow: 0; margin-right: 10px" />
        </div>
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
      style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; margin-top: 40px">
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

const detailInfo = ref(undefined)
const memoList = ref([])
const showAddMemoPopup = ref<boolean>(false)

const statusValues = ['답변대기', '처리완료', '보류']
const status = ref<string>('답변대기')

onMounted(async () => {
  try {
    var result = await requestGet(`detailed-quotation/${route.params.id}`, {})
    detailInfo.value = result.data
    status.value = statusValues[detailInfo.value.status]
    console.log(result)

    result = await requestPost('detailed-quotation/memo/list', {
      detailed_quotation_id: Number(route.params.id),
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
    await requestPut(`detailed-quotation/${route.params.id}`, {
      status: statusValues.indexOf(status.value),
    })

    var result = await requestGet(`detailed-quotation/${route.params.id}`, {})
    detailInfo.value = result.data
    status.value = statusValues[detailInfo.value.status]
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
        let result = await requestDelete(`detailed-quotation/memo/${element.id}`, {})
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
    var result = await requestPost('detailed-quotation/memo/list', {
      detailed_quotation_id: Number(route.params.id),
    })
    memoList.value = result.data.items
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="scss"></style>
