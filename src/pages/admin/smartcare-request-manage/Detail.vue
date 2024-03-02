<template>
  <page-header title="스마트케어 신청 상세" breadcrumbsDepth1="스마트케어 신청" breadcrumbsDepth2="스마트케어 신청 상세" />
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
          {{ detailInfo.addr + " " + detailInfo.addr_sub + "(" + detailInfo.zonecode + ")" }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">서비스 알게된 경로</div>
        <div class="flex flex-col search-form-value">
          {{ detailInfo.know_from }}
        </div>
      </div>
    </div>

    <div style="margin-top: 40px">스마트케어 신청 정보</div>

    <div v-if="detailInfo !== undefined" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">희망하시는 서비스</div>
        <div class="flex flex-col search-form-value-small">
          {{ detailInfo.desired_services }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">현재 시공되어 있는 바닥</div>
        <div class="flex flex-col search-form-value-small">
          <div style="margin-start: 10px">
            {{ detailInfo.current_floor }}
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">평형대</div>
        <div class="flex flex-col search-form-value-small">{{ detailInfo.living_room_count > 0 ? "거실" : "" }}
          {{ detailInfo.area_range }}</div>
        <div class="search-form-label" style="margin-left: -1px">상담 가능한 시간대</div>
        <div class="flex flex-col search-form-value-small">{{ detailInfo.living_room_count > 0 ? "거실" : "" }}
          {{ detailInfo.contact_time }}</div>
      </div>


      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">스마트케어가 필요한 부위 사진</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row">
          <va-image v-for="imageUrl in detailInfo.smartcareServiceImages" :src="imageUrl.image_url"
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
      <div class="row">
        <div class="search-form-label">견적서 파일</div>
        <div class="flex flex-col search-form-value">
          <div v-if="previewFiles.length === 0">선택된 파일이 없습니다.</div>
          <va-file-upload v-model="previewFiles" style="width: 100%;" />
          <va-button v-if="previewFiles.length > 0" @click="onUploadQuote" style="flex-grow: 0">견적서 업로드</va-button>
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">특이사항</div>
        <div class="flex flex-col search-form-value">
          <va-input type="textarea" v-model="detailInfo.special_note" rows="3"
            style="margin-top: 10px; margin-bottom: 10px;" placeholder="내용을 입력해주세요." />
          <va-button @click="onChangeSpecialNote" style="flex-grow: 0">작성</va-button>
        </div>
      </div>
    </div>

    <div
      style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; margin-top: 40px">
      <div>메모</div>
      <!-- <va-button size="medium" @click="onAddMemo">메모 등록</va-button> -->
    </div>

    <div class="row" style="margin-top: 10px">
      <table class="va-table va-table">
        <thead>
          <tr>
            <th>#</th>
            <th>처리상태</th>
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
            <td>{{ statusValues[element.status - 1] }}</td>
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

  <add-memo-popup v-if="showAddMemoPopup" @closed="showAddMemoPopup = false"
    @added="(p_memo: string) => { onAdded(p_memo) }" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { requestDelete, requestGet, requestPost, requestPut, uploadFile } from '../../../util/api'
import PageHeader from '../../../components/PageHeader.vue'
import AddMemoPopup from './AddMemoPopup.vue'
import { useModal, useToast } from 'vuestic-ui'
import Common from '../../../util/common'

const router = useRouter()
const route = useRoute()

const { init: alert } = useModal()
const { init: toast } = useToast()

const detailInfo = ref(undefined)
const memoList = ref([])
const showAddMemoPopup = ref<boolean>(false)

const statusValues = ['접수완료', '컨설팅 예정', '시공예정', '시공완료', '상담종료']
const status = ref<string>('접수완료')

const previewFiles = ref([])

onMounted(async () => {
  try {
    var result = await requestGet(`/homepage/smartcare-service/${route.params.id}`, {})
    detailInfo.value = result.data
    status.value = statusValues[detailInfo.value.status - 1]
    console.log(result)

    result = await requestPost(`homepage/smartcare-service/memo/list`, {
      smartcare_service_id: Number(route.params.id)
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
    onAddMemo()
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
        let result = await requestDelete(`homepage/smartcare-service/memo/${element.id}`, {})
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

const onAdded = async (p_memo: string) => {
  try {
    await requestPost(`homepage/smartcare-service/update-status`, {
      smartcare_service_id: Number(route.params.id),
      status: statusValues.indexOf(status.value) + 1,
      content: p_memo
    })

    var result = await requestGet(`homepage/smartcare-service/${route.params.id}`, {})
    detailInfo.value = result.data
    status.value = statusValues[detailInfo.value.status - 1]
    console.log(result)

    var result = await requestPost('homepage/smartcare-service/memo/list', {
      smartcare_service_id: Number(route.params.id),
    })
    memoList.value = result.data.items
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

const onUploadQuote = async () => {
  if (previewFiles.value.length === 0) {
    alert({
      message: '업로드할 견적서 하나를 선택해 주세요.',
      okText: '확인',
      cancelText: null,
    })
    return
  }
  var result
  var previewFileUrl = ""
  if (previewFiles.value.length > 0) {
    result = await uploadFile(previewFiles.value[0], 'catalog', 'n')
    previewFileUrl = result.data[0].Location
  }
  result = await requestPut(`homepage/smartcare-service/${route.params.id}`, {
    quote_url: previewFileUrl
  })
  toast('견적서를 업로드하였습니다.')
}

const onChangeSpecialNote = async () => {
  var result = await requestPut(`homepage/smartcare-service/${route.params.id}`, {
    special_note: detailInfo.value.special_note
  })
  toast('작성하였습니다.')
}
</script>

<style lang="scss"></style>
