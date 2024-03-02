<template>
  <div>
    전체: <span style="color: red; margin-start: 10px; margin-end: 10px">{{ totalDataCount }}</span> | 검색:
    <span style="color: red; margin-start: 10px; margin-end: 10px">{{ searchResultCount }}</span>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    totalDataCount: number
    searchResultCount: number
  }>()
</script>

<style lang="scss"></style>
