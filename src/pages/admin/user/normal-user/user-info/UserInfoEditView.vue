<template>
  <h6>회원정보 수정</h6>
  <va-divider />

  <div class="label">아이디*</div>
  <va-input v-model="userInfo.id" disabled />

  <div class="row">
    <div class="flex xs6">
      <div class="label">닉네임*</div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <va-input v-model="nickname" />
        <va-button size="medium" @click="onNicknameDuplicationCheck">중복확인</va-button>
      </div>
    </div>

    <div class="flex xs6">
      <div class="label">이름*</div>
      <va-input v-model="name" />
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

  <va-divider />

  <div class="row" style="justify-content: end">
    <va-button preset="secondary" border-color="primary" size="medium" @click="emit('canceled')">취소</va-button>
    <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useToast } from 'vuestic-ui'
  import { requestPost, requestPut } from '../../../../../util/api'
  const { init: toast } = useToast()

  const props = defineProps<{
    userInfo: string
  }>()
  const emit = defineEmits(['canceled', 'saved'])

  const userInfo = ref<any>(JSON.parse(props.userInfo))

  const nickname = ref<string>(userInfo.value.nickname)
  let nicknameDuplicationChecked = false
  const name = ref<string>(userInfo.value.name)
  const password = ref<string>('')
  const passwordConfirm = ref<string>('')
  const phoneNumber = ref<string>(userInfo.value.phone)
  const smsReceive = ref<boolean>(userInfo.value.allow_sms_recv)
  const email = ref<string>(userInfo.value.email)
  const emailReceive = ref<boolean>(userInfo.value.allow_email_recv)
  const addr = ref<string>(userInfo.value.addr)
  const addr_sub = ref<string>(userInfo.value.addr_sub)
  const zonecode = ref<string>(userInfo.value.zonecode)

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
        addr.value = data.address
        zonecode.value = data.zonecode
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
    if (name.value === '') {
      toast('이름을 입력하세요.')
      return
    }
    if (password.value !== passwordConfirm.value) {
      toast('비밀번호가 일치하지 않습니다.')
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
      await requestPut(`user-management/user/${userInfo.value.id}`, {
        nickname: nickname.value,
        name: name.value,
        password: password.value !== '' ? password.value : undefined,
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
