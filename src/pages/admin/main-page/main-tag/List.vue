<template>
  <page-header title="태그 메인 노출 관리" breadcrumbsDepth1="태그 메인 노출 관리" />
  <div class="layout fluid page-container">
    <div class="row">
      <table class="va-table">
        <thead>
          <tr>
            <th></th>
            <th>태그명</th>
            <th>우선순위</th>
            <th>노출여부</th>
            <th>메인노출</th>
          </tr>
        </thead>
        <draggable v-model="data" tag="tbody" item-key="id" handle=".handle" @change="onOrderChanged">
          <template #item="{ element }">
            <tr :key="element.id">
              <td class="handle">
                <i class="fa fa-align-justify handle"></i>
              </td>
              <td>{{ element.name }}</td>
              <td>{{ element.priority }}</td>
              <td>{{ element.display ? '노출' : '미노출' }}</td>
              <td>
                <va-button @click="() => onDelete(element)">메인 노출 해제</va-button>
              </td>
            </tr>
          </template>
        </draggable>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestGet, requestPost, requestPut } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import draggable from 'vuedraggable'

  const { init } = useModal()
  const { init: toast } = useToast()

  const data = ref<any[]>()

  onMounted(async () => {
    try {
      const result = await requestGet('tag', {
        main_display: true,
      })
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
          await requestPut(`tag/${item.id}`, {
            main_display: false,
          })
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
