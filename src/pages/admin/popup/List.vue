<template>
  <page-header title="팝업 관리" breadcrumbsDepth1="팝업 관리" />
  <div class="layout fluid page-container">
    <div class="row">
      <table class="va-table">
        <thead>
          <tr>
            <th>사용여부</th>
            <th>이미지</th>
            <th>팝업명</th>
            <th>타겟</th>
            <th>주소</th>
            <th>우선순위</th>
            <th>수정/삭제</th>
          </tr>
        </thead>
        <tr v-for="element in data" :key="element.id">
          <td>{{ element.enabled ? '사용함' : '사용안함' }}</td>
          <td>
            <va-image :src="element.thumb_url" style="width: 100px; height: auto" />
          </td>
          <td>{{ element.title }}</td>
          <td>{{ ['현재창', '새창', '이동 안함'][element.target] }}</td>
          <td>{{ element.url }}</td>
          <td>{{ element.priority }}</td>
          <td>
            <va-button
              preset="secondary"
              border-color="primary"
              size="medium"
              :to="{ name: 'popup-edit', params: { id: element.id } }"
              >수정</va-button
            >
            <va-button style="margin-left: 10px" @click="() => onDelete(element)">삭제</va-button>
          </td>
        </tr>
      </table>
    </div>

    <va-divider />
    <div class="row" style="justify-content: end">
      <va-button :to="{ name: 'popup-create' }">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../components/PageHeader.vue'
  import { requestDelete, requestGet } from '../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'

  const { init } = useModal()
  const { init: toast } = useToast()

  const data = ref<any[]>()

  onMounted(async () => {
    try {
      var result = await requestGet('popup', {})
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onDelete = async (element) => {
    init({
      message: `${element.title}항목을 정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`popup/${element.id}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          data.value = [...data.value!].filter((it) => element.id !== it.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }
</script>

<style lang="scss"></style>
