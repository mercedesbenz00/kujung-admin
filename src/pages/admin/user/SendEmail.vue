<template>
  <page-header title="이메일 발송" breadcrumbsDepth1="이메일 발송" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 10px">지정된 수신인</div>
    <div
      class="row"
      style="height: 250px; overflow-y: auto; border-color: #828282; border-width: 1px; border-style: solid"
    >
      <table class="va-table">
        <thead>
          <tr>
            <th>닉네임</th>
            <th>{{ isNormalUser ? '이름' : '회사 또는 브랜드명' }}</th>
            <th>휴대폰번호</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.nickname }}</td>
            <td>
              {{ isNormalUser ? user.name : user.business_name }}
            </td>
            <td>{{ user.phone_number }}</td>
            <td>
              <va-button size="medium" @click="onDelete(user)">삭제</va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top: 20px; margin-bottom: 10px">메일상세</div>
    <div class="layout va-gutter-5" style="border-color: #828282; border-width: 1px; border-style: solid">
      <div style="margin-bottom: 10px">제목*</div>
      <va-input v-model="title" placeholder="제목을 작성해 주세요." />

      <div style="margin-top: 20px; margin-bottom: 10px">내용*</div>
      <va-input type="textarea" v-model="content" placeholder="내용을 작성해 주세요." rows="10" style="height: 250px" />
    </div>

    <div class="row" style="justify-content: end; margin-top: 20px">
      <va-button preset="secondary" border-color="primary" size="medium" @click="onCancel">취소</va-button>
      <va-button style="margin-left: 10px" @click="onSend">발송</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../components/PageHeader.vue'
  import { requestPost } from '../../../util/api'
  import { useRoute, useRouter } from 'vue-router'
  import { useModal, useToast } from 'vuestic-ui'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const title = ref<string>('')
  const content = ref<string>('')
  const users = ref<any[]>([])
  const isNormalUser = ref<boolean>(true)

  onMounted(async () => {
    users.value = JSON.parse(route.params.users)
    isNormalUser.value = route.params.isNormalUser === 1
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
    if (title.value === '') {
      alert({
        message: '제목을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (content.value === '') {
      alert({
        message: '내용을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var result = await requestPost('user-send-email', {
        title: title.value,
        content: content.value,
        users: users.value.map((user) => user.id),
      })
      console.log(result)
      toast('발송하였습니다.')

      router.back()
    } catch (error) {
      console.log(error)
    }
  }

  const onCancel = () => {
    router.back()
  }
</script>

<style lang="scss"></style>
