<template>
  <va-accordion v-model="accordionValue" class="sidebar-accordion va-sidebar__menu__inner" multiple>
    <va-collapse v-for="(route, idx) in items" :key="idx">
      <template #header>
        <va-sidebar-item
          :active="isRouteActive(route)"
          :to="route.children ? undefined : { name: route.name }"
          activeColor="#6B737F"
        >
          <va-sidebar-item-content>
            <va-sidebar-item-title>
              {{ route.displayName }}
            </va-sidebar-item-title>

            <va-icon v-if="route.children" :name="accordionValue[idx] ? 'expand_less' : 'expand_more'" />
          </va-sidebar-item-content>
        </va-sidebar-item>
      </template>
      <template v-for="(child, index) in route.children" :key="index">
        <va-sidebar-item :active="isRouteActive(child)" :to="{ name: child.name }" activeColor="#6B737F">
          <va-sidebar-item-content>
            <div class="va-sidebar-item__icon" />

            <va-sidebar-item-title>
              {{ child.displayName }}
            </va-sidebar-item-title>
          </va-sidebar-item-content>
        </va-sidebar-item>
      </template>
    </va-collapse>
  </va-accordion>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { INavigationRoute } from '../NavigationRoutes'
  import { useRoute } from 'vue-router'

  const props = withDefaults(
    defineProps<{
      items?: INavigationRoute[]
    }>(),
    {
      items: () => [],
    },
  )

  const accordionValue = ref<boolean[]>([])

  onMounted(() => {
    accordionValue.value = props.items.map((item) => isItemExpanded(item))
  })

  // function isGroup(item: INavigationRoute) {
  //   return !!item.children
  // }

  function isRouteActive(item: INavigationRoute) {
    return item.name === useRoute().name
  }

  function isItemExpanded(item: INavigationRoute): boolean {
    if (!item.children) {
      return false
    }

    const isCurrentItemActive = isRouteActive(item)
    const isChildActive = !!item.children.find((child) =>
      child.children ? isItemExpanded(child) : isRouteActive(child),
    )

    return isCurrentItemActive || isChildActive
  }
</script>

<style lang="scss">
  .va-sidebar {
    &__menu {
      padding: 2rem 0;
    }

    &-item {
      &__icon {
        margin-left: 1rem;
        width: 0.25rem;
        height: 0.25rem;
        background-color: #fff;
        border-radius: 50%;
        display: inline-block;
      }
    }
  }

  .va-sidebar-item {
    color: white;
    font-weight: 200;

    &-content {
      min-height: 0px;
      --va-sidebar-item-content-padding: 10px;
    }

    &--active {
      font-weight: 700;
    }
  }
</style>
