<template>
  <div>
    <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
      <div>회원정보</div>
      <div>
        <va-button
          v-if="userInfo !== undefined && userInfo.status === '휴면'"
          preset="secondary"
          border-color="primary"
          size="medium"
          @click="onReleaseDormancy"
          style="margin-start: 10px"
          >휴면해제</va-button
        >
        <va-button size="medium" @click="onEdit">정보 수정</va-button>
      </div>
    </div>

    <div v-if="userInfo !== undefined" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">분류</div>
        <div class="flex flex-col search-form-value-small">
          {{ UserUtil.getAccountTypeString(userInfo.account_type) }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">회원 상태</div>
        <div class="flex flex-col search-form-value-small">
          <div>
            {{ UserUtil.getStatusString(userInfo.status) }}
            <va-button
              v-if="userInfo.status === '정상'"
              preset="secondary"
              border-color="primary"
              size="small"
              @click="onExit"
              style="margin-start: 10px"
              >강제 탈퇴</va-button
            >
            <va-button v-if="userInfo.status === '승인대기'" size="small" @click="onApprove" style="margin-start: 10px"
              >승인</va-button
            >
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">기업유형</div>
        <div class="flex flex-col search-form-value-small">대리점</div>
        <div class="search-form-label" style="margin-left: -1px">사업자 유형</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.manager_type === 'legal' ? '법인' : '개인' }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">기업회원<br />아이디</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.user_id }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">닉네임</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.nickname }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">회사 또는<br />브랜드명</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.company_name }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">담당자명</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.contact_name }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">사업자<br />등록번호</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.business_reg_num }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">회사 전화번호</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.company_phone }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">주소</div>
        <div class="flex flex-col search-form-value">
          {{ userInfo.addr }} &nbsp; {{ userInfo.addr_sub }} &nbsp; {{ userInfo.zonecode }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">본인인증<br />휴대폰번호</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.phone }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">본인인증<br />SITEUID코드</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.site_uid }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">휴대폰번호</div>
        <div class="flex flex-col search-form-value-small">
          <div style="width: 100%; display: flex; align-items: center; justify-content: space-between">
            {{ userInfo.phone }}
            <va-button
              preset="secondary"
              border-color="primary"
              size="small"
              @click="onSendSMS"
              style="margin-start: 10px"
              >SMS 발송</va-button
            >
          </div>
        </div>
        <div class="search-form-label" style="margin-left: -1px">이메일</div>
        <div class="flex flex-col search-form-value-small">
          <div style="width: 100%; display: flex; align-items: center; justify-content: space-between">
            {{ userInfo.email }}
            <va-button
              preset="secondary"
              border-color="primary"
              size="small"
              @click="onSendEmail"
              style="margin-start: 10px"
              >이메일 발송</va-button
            >
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">SMS 수신</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.allow_sms_recv ? '수신' : '수신안함' }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">이메일수신</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.allow_email_recv ? '수신' : '수신안함' }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">보유 포인트</div>
        <div class="flex flex-col search-form-value">{{ userInfo.point }} P</div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">신청일시</div>
        <div class="flex flex-col search-form-value-small">
          {{ Common.getDateTime(userInfo.created_at) }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">승인일시</div>
        <div class="flex flex-col search-form-value-small">
          {{ userInfo.approved_at !== null ? Common.getDateTime(userInfo.approved_at) : '' }}
        </div>
      </div>
    </div>
  </div>

  <send-sms-popup
    v-if="showSendSmsPopup"
    @closed="showSendSmsPopup = false"
    :users="[userInfo]"
    :is-normal-user="false"
  />
  <exit-reason-popup v-if="showExitReasonPopup" @closed="showExitReasonPopup = false" :user_id="userInfo.id" />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { requestGet, requestPost } from '../../../../../util/api'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vuestic-ui'
  import SendSmsPopup from '../../SendSmsPopup.vue'
  import ExitReasonPopup from './ExitReasonPopup.vue'
  import UserUtil from '../../UserUtil'
  import Common from '../../../../../util/common'

  const router = useRouter()
  const { init: toast } = useToast()

  const emit = defineEmits(['edit'])
  const props = defineProps<{
    user_id: number
  }>()

  const userInfo = ref()
  const showSendSmsPopup = ref<boolean>(false)
  const showExitReasonPopup = ref<boolean>(false)

  onMounted(async () => {
    try {
      const result = await requestGet(`user-management/${props.user_id}`, {})
      userInfo.value = result.data
      console.log(`user-management/${props.user_id}`, result)
    } catch (error) {
      console.log(error)
    }
  })

  const onReleaseDormancy = async () => {
    try {
      let result = await requestPost('dormant-user-release', {
        id: props.user_id,
      })
      console.log(result)
      toast('휴면해제하였습니다.')

      result = await requestGet('user-info', {})
      userInfo.value = result
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onEdit = () => {
    emit('edit')
  }

  const onExit = () => {
    showExitReasonPopup.value = true
  }

  const onApprove = async (element) => {
    try {
      let result = await requestPost('business-user-approve', {
        id: element.id,
      })
      console.log(result)
      toast('승인하였습니다.')

      result = await requestGet('business-user-info', {})
      userInfo.value = result
    } catch (error) {
      console.log(error)
    }
  }

  const onSendSMS = () => {
    showSendSmsPopup.value = true
  }

  const onSendEmail = () => {
    router.push({
      name: 'send-email',
      params: {
        users: JSON.stringify([userInfo.value]),
      },
    })
  }
</script>

<style lang="scss"></style>
