<template>
  <va-accordion v-model="accordionValue" multiple>
    <va-collapse v-for="(depth1, idx) in categories" :key="idx">
      <template #header>
        <va-sidebar-item :active="isCategoryActive(depth1)" @click="onCategoryItemClick(depth1)">
          <va-sidebar-item-content>
            <va-icon name="folder" />

            <va-sidebar-item-title>
              {{ depth1.name }}
            </va-sidebar-item-title>

            <va-icon :name="depth1.hidden ? 'visibility_off' : 'visibility'" />
            <va-icon v-if="depth1.children" :name="accordionValue[idx] ? 'expand_less' : 'expand_more'" />
          </va-sidebar-item-content>
        </va-sidebar-item>
      </template>
      <va-collapse v-for="(depth2, idx) in depth1.children" :key="idx">
        <template #header>
          <va-sidebar-item :active="isCategoryActive(depth2)" @click="onCategoryItemClick(depth2)">
            <va-sidebar-item-content style="margin-left: 10px">
              <va-icon name="folder" />

              <va-sidebar-item-title>
                {{ depth2.name }}
              </va-sidebar-item-title>

              <va-icon :name="depth2.hidden ? 'visibility_off' : 'visibility'" />
              <va-icon v-if="depth2.children" :name="accordionValue[idx] ? 'expand_less' : 'expand_more'" />
            </va-sidebar-item-content>
          </va-sidebar-item>
        </template>

        <va-sidebar-item
          v-for="(depth3, idx) in depth2.children"
          :key="idx"
          :active="isCategoryActive(depth3)"
          @click="onCategoryItemClick(depth3)"
        >
          <va-sidebar-item-content style="margin-left: 20px">
            <va-icon name="folder" />

            <va-sidebar-item-title>
              {{ depth3.name }}
            </va-sidebar-item-title>

            <va-icon :name="depth3.hidden ? 'visibility_off' : 'visibility'" />
          </va-sidebar-item-content>
        </va-sidebar-item>
      </va-collapse>
    </va-collapse>
  </va-accordion>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { ICategory } from './Category'

  const props = withDefaults(
    defineProps<{
      categories?: ICategory[]
    }>(),
    {
      categories: () => [],
    },
  )

  const emit = defineEmits(['categoryItemClick'])

  const accordionValue = ref<boolean[]>([])
  const selectedItem = ref<ICategory>()

  onMounted(() => {
    accordionValue.value = props.categories.map((item) => isItemExpanded(item))
  })

  const onCategoryItemClick = (categoryItem: ICategory) => {
    selectedItem.value = categoryItem
    emit('categoryItemClick', categoryItem)
  }

  function isCategoryActive(item: ICategory) {
    if (selectedItem.value === undefined) {
      return false
    }
    {
      return item.id === selectedItem.value.id
    }
  }

  function isItemExpanded(item: ICategory): boolean {
    if (!item.children) {
      return false
    }

    const isCurrentItemActive = isCategoryActive(item)
    const isChildActive = !!item.children.find((child) =>
      child.children ? isItemExpanded(child) : isCategoryActive(child),
    )

    return isCurrentItemActive || isChildActive
  }
</script>

<style lang="scss" scoped>
  .va-sidebar-item {
    margin-top: -1px;
    border-style: solid;
    border-width: 1px;
    border-color: #e5e5e5;
  }
</style>
