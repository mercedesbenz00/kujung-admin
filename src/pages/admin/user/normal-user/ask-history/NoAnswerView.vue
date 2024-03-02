<template>
  <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
    <h6>1:1 문의 - 답변</h6>
    <va-button size="medium" @click="onAddAnswer">답변 등록</va-button>
  </div>

  <div class="search-form" style="margin-top: 20px">
    <div class="row">
      <div class="search-form-label">처리상태</div>
      <div class="flex flex-col search-form-value">답변대기</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['addAnswer'])

  const onAddAnswer = () => {
    emit('addAnswer')
  }
</script>

<style lang="scss"></style>
