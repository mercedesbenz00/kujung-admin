<template>
  <va-sidebar
    :width="width"
    :minimized="minimized"
    :minimized-width="minimizedWidth"
    :animated="animated"
    :color="color"
  >
    <menu-accordion :items="items" />
  </va-sidebar>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import NavigationRoutes, { INavigationRoute, getEnabledRoutes } from './NavigationRoutes'
  import MenuAccordion from './menu/MenuAccordion.vue'
  import { useGlobalStore } from '../../stores/global-store'
  const GlobalStore = useGlobalStore()

  withDefaults(
    defineProps<{
      width?: string
      color?: string
      animated?: boolean
      minimized?: boolean
      minimizedWidth?: string
    }>(),
    {
      width: '16rem',
      color: 'secondary',
      animated: true,
      minimized: false,
      minimizedWidth: undefined,
    },
  )

  const items = ref<INavigationRoute[]>()

  onMounted(() => {
    items.value = getEnabledRoutes(NavigationRoutes.routes, GlobalStore.enabledRouteIds)
  })
</script>

<style lang="scss"></style>
