<template>
  <va-modal v-model="showModal" no-padding size="large" @close="$emit('closed')">
    <template #content="{ ok }">
      <div class="layout fluid" style="width: 1000px">
        <va-navbar color="#6B737F">
          <template #left>
            <va-navbar-item class="navbar-item-slot">
              <span class="title">부모 카테고리 선택</span>
            </va-navbar-item>
          </template>
          <template #right>
            <va-navbar-item class="navbar-item-slot">
              <va-button @click="ok" icon="close" />
            </va-navbar-item>
          </template>
        </va-navbar>

        <div class="layout" style="padding: 30px">
          <div style="display: flex; flex-direction: row; align-items: center">
            <span style="width: 100px">분류</span>
            <va-select v-model="category1" :options="category1Values" text-by="name" style="flex-grow: 0" />
            <va-select
              style="margin-left: 20px; margin-right: 20px; flex-grow: 0"
              v-model="category2"
              :options="category2Values"
              text-by="name"
            />
          </div>

          <div class="row" style="justify-content: end; margin-top: 20px">
            <va-button preset="secondary" border-color="primary" size="medium" @click="onCancel">취소</va-button>
            <va-button style="margin-left: 10px" @click="onSelect">선택</va-button>
          </div>
        </div>
      </div>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { onMounted, ref, watchEffect } from 'vue'
  import { useModal } from 'vuestic-ui'
  import { ICategory } from './Category'
  import { requestGet } from '../../../../util/api'
  const { init: alert } = useModal()

  const showModal = ref(true)
  const emit = defineEmits(['closed', 'categorySelected'])

  const category1Values = ref<ICategory[]>()
  const category1 = ref<ICategory | undefined>(undefined)
  const category2Values = ref<ICategory[]>()
  const category2 = ref<ICategory | undefined>(undefined)

  watchEffect(async () => {
    if (category1.value !== undefined) {
      try {
        var result = await requestGet('category', {
          parentId: category1.value.id,
        })
        category2Values.value = result.data.items
        category2.value = undefined
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
  })

  onMounted(async () => {
    try {
      var result = await requestGet('category', {
        parentId: null,
      })
      category1Values.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onSelect = async () => {
    if (category1.value === undefined && category2.value === undefined) {
      alert({
        message: '카테고리를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    showModal.value = false
    emit('categorySelected', category1.value, category2.value)
  }

  const onCancel = () => {
    showModal.value = false
  }
</script>

<style lang="scss"></style>
