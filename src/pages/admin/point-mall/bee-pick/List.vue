<template>
  <page-header title="구정 Bee의 픽" breadcrumbsDepth1="구정 Bee의 픽" />
  <div class="layout fluid page-container">
    <div class="row">
      <table class="va-table va-table">
        <thead>
          <tr>
            <th>#</th>
            <th>이미지</th>
            <th>상품명</th>
            <th>상품 설명</th>
            <th>차감 포인트</th>
            <th>등록일시</th>
            <th>구정 Bee 픽</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id">
            <td>{{ element.id }}</td>
            <td>
              <va-image :src="element.thumb_url" style="width: 100px; height: auto" />
            </td>
            <td>{{ element.name }}</td>
            <td>{{ element.summary }}</td>
            <td>{{ element.point }}</td>
            <td>{{ Common.getDateTime(element.created_at) }}</td>
            <td>
              <va-button @click.stop="onRemoveBeePick(element)">구정 Bee픽 해제</va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestGet, requestPut } from '../../../../util/api'
  import { useToast } from 'vuestic-ui'
  import Common from '../../../../util/common'

  const { init: toast } = useToast()

  const data = ref<any[]>()

  onMounted(async () => {
    try {
      const result = await requestGet('point-product', {
        page: 1,
        needAllCount: false,
        is_bee: true,
      })
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onRemoveBeePick = async (element) => {
    try {
      var result = await requestPut(`point-product/${element.id}`, {
        is_bee: false,
      })
      console.log(result)
      toast('해제하였습니다.')

      result = await requestGet('point-product', {
        page: 1,
        needAllCount: false,
        is_bee: true,
      })
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
