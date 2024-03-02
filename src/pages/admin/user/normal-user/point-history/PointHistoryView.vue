<template>
  <div>
    <h6>포인트 내역</h6>
  </div>

  <div class="row" style="justify-content: space-between; align-items: center; margin-top: 10px; margin-bottom: 10px">
    <span
      >현재 보유 포인트: <span style="color: blue">{{ point }}p</span></span
    >
    <va-button size="medium" @click="onAdd">포인트 적립/차감</va-button>
  </div>

  <div class="row">
    <table class="va-table va-table">
      <thead>
        <tr>
          <th>적립일시</th>
          <th>적립유형</th>
          <th>포인트 메모</th>
          <th>적립/차감</th>
          <th>포인트</th>
          <th>수정</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="element in data" :key="element.id">
          <td>{{ Common.getDateTime(element.created_at) }}</td>
          <td>{{ Common.getPointHistoryType(element.type) }}</td>
          <td>{{ element.memo }}</td>
          <td>{{ element.point > 0 ? '적립' : '차감' }}</td>
          <td>{{ element.point }}p</td>
          <td>
            <va-button preset="secondary" border-color="primary" size="medium" @click="onEdit(element)">수정</va-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <va-divider />

  <add-point-popup
    v-if="showPointAddPopup"
    @closed="showPointAddPopup = false"
    :userInfo="props.userInfo"
    @added="onAdded"
  />

  <edit-point-popup
    v-if="showPointEditPopup"
    @closed="showPointEditPopup = false"
    :userInfo="props.userInfo"
    :pointHistoryInfo="JSON.stringify(pointHistoryInfo)"
    @edited="onEdited"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { requestGet } from '../../../../../util/api'
  import AddPointPopup from './AddPointPopup.vue'
  import EditPointPopup from './EditPointPopup.vue'
  import Common from '../../../../../util/common'

  const props = defineProps<{
    userInfo: string
  }>()
  var userInfo = JSON.parse(props.userInfo)
  const point = ref<number>(0)
  const data = ref<any[]>()
  const showPointAddPopup = ref<boolean>(false)
  const showPointEditPopup = ref<boolean>(false)
  const pointHistoryInfo = ref()

  onMounted(async () => {
    try {
      let result = await requestGet('point-log', {
        user_id: userInfo.id,
        sortBy: "created_at",
        order: "DESC"
      })
      data.value = result.data.items
      console.log(result)

      point.value = userInfo.point
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onAdd = () => {
    showPointAddPopup.value = true
  }

  const onAdded = async () => {
    try {
      let result = await requestGet('point-log', {
        user_id: userInfo.id,
      })
      data.value = result.data.items
      console.log(result)

      result = await requestGet(`user-management/${userInfo.id}`, {})
      point.value = result.data.point
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onEdit = (element) => {
    showPointEditPopup.value = true
    pointHistoryInfo.value = element
  }

  const onEdited = () => {
    onAdded()
  }
</script>

<style lang="scss"></style>
