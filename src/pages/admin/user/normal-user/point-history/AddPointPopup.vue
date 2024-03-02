<template>
  <va-modal v-model="showModal" no-padding size="large" @close="$emit('closed')">
    <template #content="{ ok }">
      <div class="layout fluid" style="width: 1000px">
        <va-navbar color="#6B737F">
          <template #left>
            <va-navbar-item class="navbar-item-slot">
              <span class="title">포인트 적립/차감</span>
            </va-navbar-item>
          </template>
          <template #right>
            <va-navbar-item class="navbar-item-slot">
              <va-button @click="ok" icon="close" />
            </va-navbar-item>
          </template>
        </va-navbar>

        <div class="layout va-gutter-5">
          <div class="search-form">
            <div class="row">
              <div class="search-form-label">이름</div>
              <div class="flex flex-col search-form-value-small">
                {{ userInfo.name }}
              </div>

              <div class="search-form-label">닉네임</div>
              <div class="flex flex-col search-form-value-small">
                {{ userInfo.nickname }}
              </div>
            </div>

            <div class="row">
              <div class="search-form-label">휴대폰번호</div>
              <div class="flex flex-col search-form-value-small">
                {{ userInfo.phone }}
              </div>

              <div class="search-form-label">이메일</div>
              <div class="flex flex-col search-form-value-small">
                {{ userInfo.email }}
              </div>
            </div>

            <div class="row">
              <div class="search-form-label">적립 유형</div>
              <div class="flex flex-col search-form-value">직접등록</div>
            </div>

            <div class="row">
              <div class="search-form-label">적립/차감</div>
              <div class="flex flex-col search-form-value">
                <va-select v-model="subtype" :options="subtypeValues" style="width: 150px" />
              </div>
            </div>

            <div class="row">
              <div class="search-form-label">포인트</div>
              <div class="flex flex-col search-form-value">
                <div style="flex-direction: row; align-items: center">
                  <va-input v-model="point" style="width: 150px; margin-right: 10px" />p
                </div>
              </div>
            </div>

            <div class="row">
              <div class="search-form-label">포인트 메모</div>
              <div class="flex flex-col search-form-value">
                <va-input v-model="memo" />
              </div>
            </div>

            <div class="row" style="justify-content: end; margin-top: 20px">
              <va-button preset="secondary" border-color="primary" size="medium" @click="onCancel">취소</va-button>
              <va-button style="margin-left: 10px" @click="onAdd">등록</va-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { requestPost } from '../../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const showModal = ref(true)
  const emit = defineEmits(['closed', 'added'])
  const props = defineProps<{
    userInfo: string
  }>()

  const userInfo = ref(JSON.parse(props.userInfo))
  const subtypeValues = ['적립(+)', '차감(-)']
  const subtype = ref<string>('적립(+)')
  const point = ref<string>('0')
  const memo = ref<string>('')

  const onAdd = async () => {
    if (point.value === '') {
      alert({
        message: '포인트를 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (Number.isNaN(Number(point.value))) {
      alert({
        message: '포인트를 정확히 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (memo.value === '') {
      alert({
        message: '메모를 작성해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var result = await requestPost('point-log', {
        user_id: userInfo.value.id,
        point: Number(point.value) * (subtype.value === '적립(+)' ? 1 : -1),
        memo: memo.value,
      })
      console.log(result)
      toast('등록하였습니다.')

      showModal.value = false
      emit('added')
    } catch (error) {
      console.log(error)
    }
  }

  const onCancel = () => {
    showModal.value = false
  }
</script>

<style lang="scss"></style>
