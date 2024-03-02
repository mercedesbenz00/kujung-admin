<template>
  <va-navbar color="#FFFEF2">
    <template #left>
      <va-navbar-item class="navbar-item-slot">
        <span class="title">{{ title }}</span>
      </va-navbar-item>
    </template>
    <template #right>
      <va-navbar-item class="navbar-item-slot">
        <va-breadcrumbs>
          <va-breadcrumbs-item :label="breadcrumbsDepth1" />
          <va-breadcrumbs-item v-if="breadcrumbsDepth2 != null" :label="breadcrumbsDepth2" />
        </va-breadcrumbs>
      </va-navbar-item>
    </template>
  </va-navbar>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    breadcrumbsDepth1: string
    breadcrumbsDepth2?: string
  }>()
</script>

<style lang="scss">
  .va-navbar {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .navbar-item-slot {
    .title {
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 24px;
    }
  }
</style>
