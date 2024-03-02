<template>
  <va-modal v-model="showModal" no-padding size="large" @close="$emit('closed')">
    <template #content="{ ok }">
      <div class="layout fluid" style="width: 1000px">
        <va-navbar color="#6B737F">
          <template #left>
            <va-navbar-item class="navbar-item-slot">
              <span class="title">메모 등록</span>
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
              <div class="search-form-label">내용*</div>
              <div class="flex flex-col search-form-value">
                <va-input
                  type="textarea"
                  v-model="content"
                  rows="3"
                  style="margin-top: 10px"
                  placeholder="내용을 입력해주세요."
                />
              </div>
            </div>

            <div class="row" style="justify-content: end; margin-top: 20px">
              <va-button preset="secondary" border-color="primary" size="medium" @click="onCancel">취소</va-button>
              <va-button style="margin-left: 10px" @click="onSave">등록</va-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { requestPost } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const showModal = ref(true)
  const emit = defineEmits(['closed', 'added'])
  const props = defineProps<{
    id: number
  }>()

  const content = ref<string>('')

  const onSave = async () => {
    if (content.value === '') {
      alert({
        message: '내용을 작성해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var result = await requestPost('point-product-order/memo', {
        point_product_order_id: Number(props.id),
        content: content.value,
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
