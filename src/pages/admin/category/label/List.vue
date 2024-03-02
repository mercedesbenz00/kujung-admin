<template>
  <page-header title="라벨 관리" breadcrumbsDepth1="라벨 관리" />
  <div class="layout fluid page-container">
    <div class="row" style="justify-content: end">
      <va-button :to="{ name: 'label-create' }">등록</va-button>
    </div>
    <va-divider />
    <div class="row">
      <div
        v-for="item in data"
        style="
          width: 220px;
          border-color: #e5e5e5;
          border-width: 1px;
          border-style: solid;
          margin-right: 10px;
          margin-bottom: 10px;
        "
      >
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 150px">
          <va-image :src="item.image_url" style="width: 100px; height: auto" />
        </div>
        <div
          style="background-color: #e5e5e5; padding: 20px; display: flex; flex-direction: column; align-items: center"
        >
          <div>{{ item.name }}</div>
          <div style="margin-top: 20px">
            <va-button preset="secondary" border-color="primary" size="medium" @click="() => onDelete(item)"
              >삭제</va-button
            >
            <va-button style="margin-left: 10px" :to="{ name: 'label-edit', params: { id: item.id } }">수정</va-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestDelete, requestGet } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'

  const { init } = useModal()
  const { init: toast } = useToast()

  const data = ref<any[]>()

  onMounted(async () => {
    try {
      var result = await requestGet('label', {})
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onDelete = async (element) => {
    init({
      message: `${element.name}항목을 정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`label/${element.id}`, {})
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
