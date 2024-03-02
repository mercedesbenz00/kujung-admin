<template>
  <page-header title="메인 유튜브 관리" breadcrumbsDepth1="메인 유튜브 관리" />
  <div class="layout fluid page-container">
    <div class="row">
      <table class="va-table">
        <thead>
          <tr>
            <th></th>
            <th>이미지</th>
            <th>제목</th>
            <th>주소</th>
            <th>사용여부</th>
            <th>수정/삭제</th>
          </tr>
        </thead>
        <draggable v-model="data" tag="tbody" item-key="id" handle=".handle" @change="onOrderChanged">
          <template #item="{ element }">
            <tr :key="element.id">
              <td class="handle">
                <i class="fa fa-align-justify handle"></i>
              </td>
              <td>
                <va-image :src="element.thumb_url" style="width: 100%; height: auto" />
              </td>
              <td>{{ element.title }}</td>
              <td>{{ element.video_url }}</td>
              <td>{{ element.enabled ? '사용' : '미사용' }}</td>
              <td>
                <va-button
                  preset="secondary"
                  border-color="primary"
                  size="medium"
                  :to="{ name: 'main-youtube-edit', params: { id: element.id } }"
                  >수정</va-button
                >
                <va-button style="margin-left: 10px" @click="() => onDelete(element)">삭제</va-button>
              </td>
            </tr>
          </template>
        </draggable>
      </table>
    </div>

    <va-divider />
    <div class="row" style="justify-content: end">
      <va-button :to="{ name: 'main-youtube-create' }">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestDelete, requestGet } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import draggable from 'vuedraggable'

  const { init } = useModal()
  const { init: toast } = useToast()

  const data = ref<any[]>()

  onMounted(async () => {
    try {
      const result = await requestGet('main-youtube', {})
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onDelete = async (item) => {
    init({
      message: `정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`main-youtube/${item.id}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          data.value = [...data.value!].filter((it) => item.id !== it.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onOrderChanged = async () => {
    console.log('onOrderChanged', data.value)
  }
</script>

<style lang="scss"></style>
