<template>
  <list v-if="subviewName === 'list'" :user_id="props.user_id" @show-detail="onShowDetail" />
  <detail v-if="subviewName === 'detail'" :id="detailId!" :user_id="props.user_id" @go-back="subviewName = 'list'" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import List from './List.vue'
  import Detail from './Detail.vue'

  const props = defineProps<{
    user_id: number
  }>()

  const subviewName = ref<string>('list')
  const detailId = ref<number>()

  const onShowDetail = (id) => {
    subviewName.value = 'detail'
    detailId.value = id
  }
</script>

<style lang="scss"></style>
