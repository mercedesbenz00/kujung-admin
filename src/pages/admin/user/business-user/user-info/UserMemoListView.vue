<template>
  <div>
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
          <tr v-for="element in data" :key="element.id">
            <td>{{ element.id }}</td>
            <td>{{ element.content }}</td>
            <td>{{ element.creator.name }}</td>
            <td>{{ Common.getDateTime(element.created_at) }}</td>
            <td>{{ element.modifier === null ? '' : element.modifier.name }}</td>
            <td>{{ Common.getDateTime(element.updated_at) }}</td>
            <td>
              <va-button @click.stop="onDelete(element)">삭제</va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <add-user-memo-popup
    v-if="showAddUserMemoPopup"
    @closed="showAddUserMemoPopup = false"
    :user_id="props.user_id"
    @added="onAdded"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { requestDelete, requestGet, requestPost } from '../../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import AddUserMemoPopup from './AddUserMemoPopup.vue'
  import Common from '../../../../../util/common'

  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const props = defineProps<{
    user_id: number
  }>()

  const showAddUserMemoPopup = ref<boolean>(false)
  const data = ref([])

  onMounted(async () => {
    try {
      const result = await requestPost('user-management/memo/list', { user_id: Number(props.user_id) })
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onDelete = (element) => {
    alert({
      message: '정말로 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`user-management/memo/${element.id}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          data.value = [...data.value!].filter((it) => it.id !== element.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onAddMemo = () => {
    showAddUserMemoPopup.value = true
  }

  const onAdded = async () => {
    try {
      const result = await requestPost('user-management/memo/list', { user_id: Number(props.user_id) })
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
