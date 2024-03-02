<template>
  <page-header title="구정 Bee의 추천제품" breadcrumbsDepth1="구정 Bee의 추천제품" />
  <div class="layout fluid page-container">
    <div class="row">
      <table class="va-table va-table">
        <thead>
          <tr>
            <th>#</th>
            <th>이미지</th>
            <th>상품명</th>
            <th>카테고리</th>
            <th>상태</th>
            <th>등록일시</th>
            <th>추천</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td>{{ element.id }}</td>
            <td>
              <va-image :src="element.thumb_url" style="width: 100px; height: auto" />
            </td>
            <td>{{ element.name }}</td>
            <td>{{ element.category }}</td>
            <td>{{ element.display ? '노출' : '미노출' }}</td>
            <td>{{ Common.getDateTime(element.created_at) }}</td>
            <td>
              <va-button v-if="element.recommended" @click.stop="onRemoveRecommend(element)">추천 해제</va-button>
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
  import router from '../../../../router'

  const { init: toast } = useToast()

  const data = ref<any[]>()

  onMounted(async () => {
    try {
      const result = await requestGet('smart-store', {
        recommended: true,
      })
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onRowClick = (id) => {
    router.push({ name: 'smart-store-edit', params: { id: id } })
  }

  const onRemoveRecommend = async (element) => {
    try {
      var result = await requestPut(`smart-store/${element.id}`, {
        recommended: false,
      })
      console.log(result)
      toast('추천 해제하였습니다.')

      data.value = [...data.value!].filter((it) => element.id !== it.id)
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
