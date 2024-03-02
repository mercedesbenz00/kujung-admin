<template>
  <page-header title="탈퇴 회원" breadcrumbsDepth1="탈퇴 회원" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 20px">
      <va-button
        :preset="tabIndex === 0 ? '' : 'secondary'"
        :border-color="tabIndex === 0 ? '' : 'primary'"
        size="medium"
        @click="tabIndex = 0"
        style="flex-grow: 0; margin-right: 10px"
        >탈퇴 대기중 회원</va-button
      >

      <va-button
        :preset="tabIndex === 1 ? '' : 'secondary'"
        :border-color="tabIndex === 1 ? '' : 'primary'"
        size="medium"
        @click="tabIndex = 1"
        style="flex-grow: 0"
        >탈퇴 회원</va-button
      >
    </div>

    <pending-users-view v-if="tabIndex === 0" />
    <leaved-users-view v-if="tabIndex === 1" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import PendingUsersView from './PendingUsersView.vue'
  import LeavedUsersView from './LeavedUsersView.vue'

  const tabIndex = ref<number>(0)
</script>

<style lang="scss"></style>
