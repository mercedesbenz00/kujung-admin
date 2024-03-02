<template>
  <va-modal v-model="showModal" no-padding size="large" @close="$emit('closed')">
    <template #content="{ ok }">
      <div class="layout fluid" style="width: 1000px">
        <va-navbar color="#6B737F">
          <template #left>
            <va-navbar-item class="navbar-item-slot">
              <span class="title">제품 선택</span>
              <span v-if="categoryString !== ''" class="title">&nbsp;({{ categoryString }})</span>
            </va-navbar-item>
          </template>
          <template #right>
            <va-navbar-item class="navbar-item-slot">
              <va-button @click="ok" icon="close" />
            </va-navbar-item>
          </template>
        </va-navbar>

        <div class="search-form">
          <div v-if="categoryOptionsVisible" class="row">
            <div class="search-form-label1">분류</div>
            <div class="flex flex-col search-form-value1">
              <va-select v-model="category1" :options="category1Values" text-by="name" />
              <va-select
                style="margin-left: 20px; margin-right: 20px"
                v-model="category2"
                :options="category2Values"
                text-by="name"
              />
              <va-select v-model="category3" :options="category3Values" text-by="name" />
            </div>
          </div>
          <div class="row" style="margin-top: -1px">
            <div class="search-form-label1" style="height: auto">태그별</div>
            <div class="flex flex-col search-form-value1" style="display: flex; flex-wrap: wrap; height: auto">
              <va-checkbox
                v-for="it in tags"
                v-model="tag"
                :label="it.name"
                style="margin-right: 20px; margin-top: 5px; margin-bottom: 5px"
                :array-value="it"
              />
            </div>
          </div>
          <div class="row" style="margin-top: -1px">
            <div class="search-form-label1">검색어</div>
            <div class="flex flex-col search-form-value1">
              <va-select style="width: 300px" v-model="keywordType" :options="keywordTypes" />
              <va-input v-model="keyword" style="margin-left: 10px" />
            </div>
          </div>
        </div>

        <div class="row" style="justify-content: center">
          <va-button preset="secondary" border-color="primary" size="medium" @click="onSearch">검색</va-button>
          <va-button style="margin-left: 10px" @click="onReset">초기화</va-button>
        </div>

        <div class="row" style="height: 500px; overflow-y: auto">
          <table class="va-table search-result-table">
            <thead>
              <tr>
                <th>상품코드</th>
                <th>이미지</th>
                <th>상품정보</th>
                <th>태그</th>
                <th>노출</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>
                  <va-image :src="product.thumbnail_url" style="width: 100px; height: auto" />
                </td>
                <td>
                  {{
                    Common.getCategoryString(product.category_level1, product.category_level2, product.catgory_level3)
                  }}
                  <br />
                  {{ product.title }}
                </td>
                <td>{{ product.tags.map((i) => i.name).join(',') }}</td>
                <td>{{ product.hidden ? '미노출' : '노출' }}</td>
                <td>
                  <va-button preset="secondary" border-color="primary" size="medium" @click="onSelect(product)"
                    >선택</va-button
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, onMounted, watchEffect } from 'vue'
  import { requestGet, requestPost } from '../../util/api'
  import { ICategory } from '../../pages/admin/category/product-category/Category'
  import Common from '../../util/common'

  const showModal = ref(true)
  const products = ref<any[]>()

  const categoryOptionsVisible = ref<boolean>(false)
  const categoryString = ref<string>('')

  const category1Values = ref<ICategory[]>()
  const category1 = ref<ICategory | undefined>(undefined)
  const category2Values = ref<ICategory[]>()
  const category2 = ref<ICategory | undefined>(undefined)
  const category3Values = ref<ICategory[]>()
  const category3 = ref<ICategory | undefined>(undefined)

  const tags = ref<any[]>([])
  const tag = ref<any[]>([])

  const keywordTypes = ref<string[]>(['상품명', '상품코드'])
  const keywordType = ref<string>('상품명')
  const keyword = ref<string>()

  const props = defineProps<{
    category1Values: ICategory[]
    category2Values: ICategory[]
    category3Values: ICategory[]
    category1: ICategory | undefined
    category2: ICategory | undefined
    category3: ICategory | undefined
  }>()
  const emit = defineEmits(['closed', 'productSelected'])

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

  watchEffect(async () => {
    if (category2.value !== undefined) {
      try {
        var result = await requestGet('category', {
          parentId: category2.value.id,
        })
        category3Values.value = result.data.items
        category3.value = undefined
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
  })

  onMounted(async () => {
    try {
      if (props.category1 === undefined) {
        var result = await requestGet('category', {
          parentId: null,
        })
        category1Values.value = result.data.items
        console.log(result)
        categoryOptionsVisible.value = true
      } else {
        category1Values.value = props.category1Values
        category2Values.value = props.category2Values
        category3Values.value = props.category3Values
        category1.value = props.category1
        category2.value = props.category2
        category3.value = props.category3
        categoryOptionsVisible.value = false
        categoryString.value = Common.getCategoryString(props.category1, props.category2, props.category3)
      }

      var result = await requestGet('tag', {})
      tags.value = result.data.items
      console.log(result)

      var result = await requestPost('product/list', {
        page: 1,
        take: 100,
      })
      products.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onSelect = (product) => {
    showModal.value = false
    emit('productSelected', product)
  }

  const onSearch = async () => {
    try {
      var result = await requestPost('product/list', {
        category_level1_id: category1.value?.id,
        category_level2_id: category2.value?.id,
        category_level3_id: category3.value?.id,
        tags: tag.value.map((it) => it.id),
        q: keyword.value,
        q_type: keywordType.value === '상품명' ? 'title' : 'id',
        page: 1,
        take: 100,
      })
      products.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onReset = () => {
    category1.value = undefined
    category2.value = undefined
    category3.value = undefined
    tag.value = []
    keyword.value = ''
  }
</script>

<style lang="scss" scoped>
  .search-form {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 10px;
    margin-bottom: 20px;

    &-label1 {
      width: 100px;
      height: 50px;
      padding-left: 10px;
      background-color: #e5e5e5;
      border-color: #828282;
      border-width: 1px;
      border-style: solid;
      display: flex;
      align-items: center;
    }

    &-value1 {
      width: 830px;
      height: 50px;
      margin-left: -1px;
      padding-left: 10px;
      padding-right: 10px;
      border-color: #828282;
      border-width: 1px;
      border-style: solid;
      display: flex;
      align-items: center;
    }
  }

  .search-result-table {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-color: #828282;
    border-width: 1px;
    border-style: solid;
  }
</style>
