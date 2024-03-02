<template>
  <va-modal v-model="showModal" no-padding size="large" @close="$emit('closed')">
    <template #content="{ ok }">
      <div class="layout fluid" style="width: 1000px">
        <va-navbar color="#6B737F">
          <template #left>
            <va-navbar-item class="navbar-item-slot">
              <span class="title">SMS 발송</span>
            </va-navbar-item>
          </template>
          <template #right>
            <va-navbar-item class="navbar-item-slot">
              <va-button @click="ok" icon="close" />
            </va-navbar-item>
          </template>
        </va-navbar>

        <div class="layout va-gutter-5">
          <div class="row">
            <div class="flex xs6">
              <div style="margin-bottom: 10px">문자내용</div>
              <va-input
                type="textarea"
                v-model="content"
                placeholder="문자내용을 작성해 주세요."
                rows="10"
                style="height: 250px"
                :max-length="2000"
                counter
              />
            </div>
            <div class="flex xs6">
              <div style="margin-bottom: 10px">지정된 수신인</div>
              <div
                class="row"
                style="height: 250px; overflow-y: auto; border-color: #828282; border-width: 1px; border-style: solid"
              >
                <table class="va-table">
                  <thead>
                    <tr>
                      <th>닉네임</th>
                      <th>{{ props.isNormalUser ? '이름' : '회사 또는 브랜드명' }}</th>
                      <th>휴대폰번호</th>
                      <th>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{ user.nickname }}</td>
                      <td>
                        {{ props.isNormalUser ? user.name : user.business_name }}
                      </td>
                      <td>{{ user.phone }}</td>
                      <td>
                        <va-button size="medium" @click="onDelete(user)">삭제</va-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="row" style="justify-content: end">
            <va-button preset="secondary" border-color="primary" size="medium" @click="onCancel">취소</va-button>
            <va-button style="margin-left: 10px" @click="onSend">발송</va-button>
          </div>
        </div>
      </div>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { requestPost } from '../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const showModal = ref(true)
  defineEmits(['closed'])
  const props = defineProps<{
    users: any[]
    isNormalUser: boolean
  }>()

  const content = ref<string>('')
  const users = ref<any[]>([])

  onMounted(async () => {
    users.value = props.users
  })

  const onDelete = (user) => {
    users.value = users.value.filter((u) => u.id !== user.id)
  }

  const onSend = async () => {
    if (users.value.length === 0) {
      alert({
        message: '회원을 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (content.value === '') {
      alert({
        message: '문자내용을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }


    const recipients: Array<any> = []

    users.value.map(it => {
      recipients.push({
        name: it.name,
        phone: it.phone,
        nickname: it.nickname,
        allow_sms_recv: it.allow_sms_recv,
      })
    })

    console.log("11111111111111", recipients)

    try {
      var result = await requestPost('sms-delivery', {
        content: content.value,
        recipients: recipients,
      })
      toast('발송하였습니다.')

      showModal.value = false
    } catch (error) {
      console.log(error)
    }
  }

  const onCancel = () => {
    showModal.value = false
  }
</script>

<style lang="scss"></style>
