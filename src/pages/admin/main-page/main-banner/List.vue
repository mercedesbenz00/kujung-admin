<template>
  <page-header title="메인 배너 관리" breadcrumbsDepth1="메인 배너 관리" />
  <div class="layout fluid page-container">
    <div class="row">
      <div style="align-items: center">
        <va-switch v-model="slideAutoTransfer" label="슬라이드 자동전환" left-label size="small" />
        <div
          style="
            display: inline-block;
            width: 2px;
            height: 12px;
            background-color: black;
            margin-left: 20px;
            margin-right: 20px;
          "
        />
        전환시간(초)
        <va-input v-model="transferTime" style="width: 50px; margin-left: 10px" />
      </div>
    </div>
    <va-divider />
    <div class="row">
      <table class="va-table">
        <thead>
          <tr>
            <th></th>
            <th>이미지</th>
            <th>배너명</th>
            <th>타겟</th>
            <th>주소</th>
            <th>사용여부</th>
            <th>수정/삭제</th>
          </tr>
        </thead>
        <draggable v-model="banners" tag="tbody" item-key="id" handle=".handle" @change="onOrderChanged">
          <template #item="{ element }">
            <tr :key="element.id">
              <td class="handle">
                <i class="fa fa-align-justify handle"></i>
              </td>
              <td>
                <va-image :src="element.thumb_url" style="width: 100%; height: auto" />
              </td>
              <td>{{ element.title }}</td>
              <td>{{ ['현재창', '새창', '이동 안함'][element.target] }}</td>
              <td>{{ element.address }}</td>
              <td>{{ element.enabled ? '사용함' : '사용안함' }}</td>
              <td>
                <va-button
                  preset="secondary"
                  border-color="primary"
                  size="medium"
                  :to="{ name: 'main-banner-edit', params: { id: element.id } }"
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
      <va-button :to="{ name: 'main-banner-create' }">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watchEffect } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestDelete, requestGet, requestPost, requestPut } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import draggable from 'vuedraggable'

  const { init } = useModal()
  const { init: toast } = useToast()

  const slideAutoTransfer = ref<boolean>(false)
  const transferTime = ref<Number>(0)
  const banners = ref<any[]>()

  onMounted(async () => {
    try {
      var result = await requestGet('banner-setting/main', {})
      slideAutoTransfer.value = result.data.auto_transition
      transferTime.value = result.data.interval
      console.log(result)

      result = await requestGet('main-banner', {})
      banners.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  watchEffect(async () => {
    try {
      let result = await requestPut('banner-setting/main', {
        auto_transition: slideAutoTransfer.value,
        interval: Number(transferTime.value),
      })
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onDelete = async (banner) => {
    init({
      message: `${banner.title}항목을 정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`main-banner/${banner.id}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          banners.value = [...banners.value!].filter((it) => banner.id !== it.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onOrderChanged = async () => {
    console.log('onOrderChanged', banners.value)
  }
</script>

<style lang="scss"></style>
