<template>
  <h6>회원정보 수정</h6>
  <va-divider />

  <div class="row">
    <div class="flex xs6" v-if="false">
      <div class="label">기업유형</div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <va-radio
          v-for="(option, index) in typeOptions"
          :key="index"
          v-model="type"
          :option="option"
          style="margin-top: 0px; margin-right: 1rem; flex-grow: 0"
        />
      </div>
    </div>

    <div class="flex xs6">
      <div class="label">사업자 유형</div>
      <va-radio
        v-for="(option, index) in businessTypeOptions"
        :key="index"
        v-model="businessType"
        :option="option"
        style="margin-top: 0px; margin-right: 1rem; flex-grow: 0"
      />
    </div>
  </div>

  <div class="row">
    <div class="flex xs6">
      <div class="label">기업회원 아이디*</div>
      <va-input v-model="userInfo.user_id" disabled />
    </div>

    <div class="flex xs6">
      <div class="label">닉네임*</div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <va-input v-model="nickname" />
        <va-button size="medium" @click="onNicknameDuplicationCheck">중복확인</va-button>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="flex xs6">
      <div class="label">
        비밀번호<span class="va-text-secondary" style="margin-left: 10px; font-size: 0.6rem"
          >(현재 비밀번호는 알수 없습니다. 변경시에만 입력해주세요.)</span
        >
      </div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <va-input v-model="password" type="password" />
      </div>
    </div>

    <div class="flex xs6">
      <div class="label">
        비밀번호 확인<span class="va-text-secondary" style="margin-left: 10px; font-size: 0.6rem"
          >(변경시에만 입력해주세요.)</span
        >
      </div>
      <va-input v-model="passwordConfirm" type="password" />
    </div>
  </div>

  <div class="row">
    <div class="flex xs6">
      <div class="label">회사 또는 브랜드명*</div>
      <va-input v-model="userInfo.company_name" disabled />
    </div>

    <div class="flex xs6">
      <div class="label">담당자명*</div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <va-input v-model="name" />
      </div>
    </div>
  </div>

  <div class="row">
    <div class="flex xs6">
      <div class="label">사업자 등록번호*</div>
      <va-input v-model="userInfo.business_reg_num" disabled />
    </div>

    <div class="flex xs6">
      <div class="label">회사 전화번호</div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <va-input v-model="businessTelephone" />
      </div>
    </div>
  </div>

  <div class="label">주소</div>

  <div class="flex xs6" style="display: flex; flex-direction: row; align-items: center; padding: 0px">
    <va-input v-model="zonecode" />
    <va-button size="medium" @click="onAddressSearch" style="flex-shrink: 0">주소검색</va-button>
  </div>
  <div class="flex xs6" style="padding: 0px; margin-top: 8px; margin-bottom: 8px">
    <va-input v-model="addr" />
  </div>
  <div class="flex xs6" style="padding: 0px">
    <va-input v-model="addr_sub" />
  </div>

  <div class="row">
    <div class="flex xs6">
      <div class="label">휴대폰번호*</div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <va-input v-model="phoneNumber" />
        <va-checkbox v-model="smsReceive" label="SMS 수신" style="margin-left: 10px" />
      </div>
    </div>

    <div class="flex xs6">
      <div class="label">이메일*</div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <va-input v-model="email" />
        <va-checkbox v-model="emailReceive" label="이메일 수신" style="margin-left: 10px" />
      </div>
    </div>
  </div>

  <va-divider />

  <div class="row" style="justify-content: end">
    <va-button preset="secondary" border-color="primary" size="medium" @click="emit('canceled')">취소</va-button>
    <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useModal, useToast } from 'vuestic-ui'
  import { requestPost, requestPut } from '../../../../../util/api'
  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const props = defineProps<{
    userInfo: string
  }>()
  const emit = defineEmits(['canceled', 'saved'])

  const userInfo = ref<any>(JSON.parse(props.userInfo))

  const typeOptions = ['인테리어', '대리점']
  const type = ref<string>('인테리어')

  const businessTypeOptions = ['개인', '법인']
  const businessType = ref<string>(userInfo.value.manager_type === 'legal' ? '법인' : '개인')
  const nickname = ref<string>(userInfo.value.nickname)
  let nicknameDuplicationChecked = false
  const password = ref<string>('')
  const passwordConfirm = ref<string>('')
  const name = ref<string>(userInfo.value.contact_name)
  const businessTelephone = ref<string>(userInfo.value.company_phone)
  const phoneNumber = ref<string>(userInfo.value.phone)
  const smsReceive = ref<boolean>(userInfo.value.allow_sms_recv)
  const email = ref<string>(userInfo.value.email)
  const emailReceive = ref<boolean>(userInfo.value.allow_email_recv)
  const zonecode = ref<string>(userInfo.value.zonecode)
  const addr = ref<string>(userInfo.value.addr)
  const addr_sub = ref<string>(userInfo.value.addr_sub)

  const onNicknameDuplicationCheck = async () => {
    if (nickname.value === '') {
      toast('닉네임을 입력하세요.')
      return
    }

    try {
      const result = await requestPost('user-management/check-duplication', {
        id: userInfo.value.id,
        nickname: nickname.value,
      })
      console.log(result)

      if (result.success === true) {
        toast('사용할 수 있는 닉네임 입니다.')
        nicknameDuplicationChecked = true
      } else {
        toast('중복된 닉네임 입니다. 다른 닉네임을 입력해 주세요.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        console.log(data)
        zonecode.value = data.zonecode
        addr.value = data.address
      },
    }).open()
  }

  const onSave = async () => {
    if (nickname.value === '') {
      toast('닉네임을 입력하세요.')
      return
    }
    if (userInfo.value.nickname !== nickname.value && nicknameDuplicationChecked === false) {
      toast('닉네임 중복 확인을 해 주세요')
      return
    }
    if (password.value !== passwordConfirm.value) {
      toast('비밀번호가 일치하지 않습니다.')
      return
    }
    if (name.value === '') {
      toast('담당자명을 입력하세요.')
      return
    }
    if (businessTelephone.value === '') {
      toast('회사 전화번호를 입력하세요.')
      return
    }
    if (phoneNumber.value === '') {
      toast('휴대폰번호를 입력하세요.')
      return
    }
    if (email.value === '') {
      toast('이메일 주소를 입력하세요.')
      return
    }
    if (zonecode.value === '') {
      toast('우편번호를 입력하세요.')
      return
    }
    if (addr.value === '') {
      toast('주소를 입력하세요.')
      return
    }

    try {
      await requestPut(`user-management/business/${userInfo.value.id}`, {
        manager_type: businessType.value === '법인' ? 'legal' : 'individual',
        nickname: nickname.value,
        password: password.value !== '' ? password.value : undefined,
        contact_name: name.value,
        company_phone: businessTelephone.value,
        phone: phoneNumber.value,
        allow_sms_recv: smsReceive.value,
        email: email.value,
        allow_email_recv: emailReceive.value,
        addr: addr.value,
        addr_sub: addr_sub.value,
        zonecode: zonecode.value,
      })
      toast('수정하였습니다.')

      emit('saved')
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss" scoped>
  .label {
    margin-top: 20px;
    margin-bottom: 10px;
  }
</style>
