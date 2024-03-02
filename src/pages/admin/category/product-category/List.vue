<template>
  <page-header title="제품 분류 관리" breadcrumbsDepth1="제품 분류 관리" />
  <div class="layout fluid page-container va-gutter-5" style="padding: 30px">
    <div class="row">
      <div
        class="flex"
        style="display: flex; flex-direction: column; align-items: end; width: 300px; margin-left: 30px"
      >
        <va-button
          preset="secondary"
          border-color="primary"
          size="medium"
          @click="onCreateCategoryDepth1"
          style="margin-bottom: 10px; flex-grow: 0"
        >
          대분류 생성
        </va-button>
        <category-treeview :categories="categories" @categoryItemClick="onCategoryItemClick" />
      </div>
      <div class="flex xs8">
        <category-detail
          v-if="selectedItem !== undefined && selectedItem.id !== '' && editing === false"
          :category="selectedItem"
          @create="onCreateCategory"
          @deleted="onCategoryDeleted"
          @edit="onEditCategory"
          @duplicate="onDuplicate"
        />
        <category-edit
          v-if="selectedItem !== undefined && selectedItem.id !== '' && editing === true"
          :category="selectedItem"
          @canceled="editing = false"
          @saved="onCategoryEdited"
        />
        <create-category
          v-if="selectedItem !== undefined && selectedItem.id === ''"
          :parentId="selectedItem.parentId"
          :category="selectedItem"
          :depth="selectedItem.depth"
          @created="onCategoryCreated"
          @deleted="onCategoryDeleted"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestGet } from '../../../../util/api'
  import { ICategory } from './Category'
  import CategoryTreeview from './CategoryTreeview.vue'
  import CategoryDetail from './CategoryDetail.vue'
  import CategoryEdit from './CategoryEdit.vue'
  import CreateCategory from './CreateCategory.vue'

  const categories = ref<ICategory[]>([])
  const selectedItem = ref<ICategory>()
  const editing = ref<boolean>(false)

  onMounted(async () => {
    try {
      const result = await requestGet('category/tree', {})
      categories.value = result.data
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onCreateCategoryDepth1 = () => {
    editing.value = false

    categories.value = [
      ...categories.value,
      {
        id: '',
        name: '',
        parentId: undefined,
        depth: 0,
        image_url: '',
        desc: '',
        tags: '',
        categoryImages: [],
        categoryYoutubes: [],
        hidden: false,
        children: [],
      },
    ]
  }

  const onCreateCategory = () => {
    editing.value = false

    var item = { ...selectedItem.value }
    item.children = [
      ...item.children,
      {
        id: '',
        name: '',
        parentId: selectedItem!.value.id,
        depth: selectedItem.value!.depth + 1,
        image_url: '',
        desc: '',
        tags: '',
        categoryImages: [],
        categoryYoutubes: [],
        hidden: false,
        children: [],
      },
    ]
    selectedItem.value = item

    console.log(selectedItem.value?.depth)

    if (selectedItem.value?.depth === 0) {
      categories.value = categories.value.map((category) => {
        if (category.id === selectedItem!.value.id) {
          var item = { ...category }
          item.children = [
            ...item.children,
            {
              id: '',
              name: '',
              parentId: selectedItem!.value.id,
              depth: selectedItem.value!.depth + 1,
              image_url: '',
              desc: '',
              tags: '',
              categoryImages: [],
              categoryYoutubes: [],
              hidden: false,
              children: [],
            },
          ]

          return item
        } else {
          return category
        }
      })
    } else if (selectedItem.value?.depth === 1) {
      categories.value = categories.value.map((category) => {
        console.log(selectedItem!.value.parentId)
        if (category.id === selectedItem!.value.parentId) {
          var item = { ...category }
          item.children = item.children?.map((child) => {
            if (child.id === selectedItem!.value.id) {
              var childItem = { ...child }
              childItem.children = [
                ...childItem.children,
                {
                  id: '',
                  name: '',
                  parentId: selectedItem!.value.id,
                  depth: selectedItem.value!.depth + 1,
                  image_url: '',
                  desc: '',
                  tags: '',
                  categoryImages: [],
                  categoryYoutubes: [],
                  hidden: false,
                  children: [],
                },
              ]
              return childItem
            } else {
              return child
            }
          })

          return item
        } else {
          return category
        }
      })
    }
  }

  const onCategoryCreated = async (category) => {
    try {
      selectedItem.value = category

      const result = await requestGet('category/tree', {})
      categories.value = result.data
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onCategoryDeleted = async () => {
    try {
      const result = await requestGet('category/tree', {})
      categories.value = result.data
      console.log(result)

      if (categories.value.length > 0) {
        selectedItem.value = categories.value[0]
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onEditCategory = () => {
    editing.value = true
  }

  const onCategoryEdited = async () => {
    try {
      editing.value = false
      var result = await requestGet('category/tree', {})
      categories.value = result.data
      console.log(result)

      result = await requestGet(`category/${selectedItem.value!.id}`, {})
      selectedItem.value = result.data
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onDuplicate = (category1: ICategory | undefined, category2: ICategory | undefined) => {
    var parentCategory = category2 !== undefined ? category2 : category1
    var newItem = { ...selectedItem.value! }
    newItem.parentId = parentCategory!.id
    newItem.id = ''

    editing.value = false

    var item = { ...parentCategory! }
    item.children = [...(item.children === undefined ? [] : item.children), newItem]
    selectedItem.value = item

    if (parentCategory!.depth === 0) {
      categories.value = categories.value.map((category) => {
        if (category.id === parentCategory!.id) {
          var item = { ...category }
          item.children = [...(item.children === undefined ? [] : item.children), newItem]

          return item
        } else {
          return category
        }
      })
    } else if (parentCategory!.depth === 1) {
      categories.value = categories.value.map((category) => {
        if (category.id === parentCategory!.parentId) {
          var item = { ...category }
          item.children = item.children?.map((child) => {
            if (child.id === parentCategory!.id) {
              var childItem = { ...child }
              childItem.children = [...(childItem.children === undefined ? [] : childItem.children), newItem]
              return childItem
            } else {
              return child
            }
          })

          return item
        } else {
          return category
        }
      })
    }
  }

  const onCategoryItemClick = (categoryItem: ICategory) => {
    editing.value = false
    selectedItem.value = categoryItem
  }
</script>

<style lang="scss"></style>
