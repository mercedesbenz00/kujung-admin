<template>
  <page-header title="제품 상단 고정 관리" breadcrumbsDepth1="제품 상단 고정 관리" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">분류</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: column">
          <div style="display: flex; flex-direction: row; margin-bottom: 10px">
            <va-select v-model="category1" :options="category1Values" text-by="name" />
            <va-select
              style="margin-left: 20px; margin-right: 20px"
              v-model="category2"
              :options="category2Values"
              text-by="name"
            />
            <va-select v-model="category3" :options="category3Values" text-by="name" />
          </div>
          <va-checkbox v-model="excludeInvisibleProducts" label="미노출제품 제외" />
        </div>
      </div>
    </div>

    <div class="row" style="justify-content: center">
      <va-button preset="secondary" border-color="primary" size="medium" @click="onSearch">검색</va-button>
      <va-button style="margin-left: 10px" @click="onReset">초기화</va-button>
    </div>
    <va-divider />

    <div class="row" style="display: flex; justify-content: space-between; align-items: center">
      <div>
        전체: <span style="color: red; margin-start: 10px; margin-end: 10px">{{ totalDataCount }}</span>
      </div>
    </div>

    <div class="row">
      <table class="va-table">
        <thead>
          <tr>
            <th>상품코드</th>
            <th>이미지</th>
            <th>분류</th>
            <th>상품명</th>
            <th>태그</th>
            <th>조회수</th>
            <th>위시리스트</th>
            <th>상태</th>
            <th>등록일시</th>
            <th>상단고정</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in data" :key="product.id" @click="onRowClick(product.id)">
            <td>{{ product.id }}</td>
            <td>
              <va-image :src="product.thumbnail_url" style="width: 100px; height: auto" />
            </td>
            <td>
              {{ Common.getCategoryString(product.category_level1, product.category_level2, product.catgory_level3) }}
            </td>
            <td>
              {{ product.title }}
            </td>
            <td>{{ product.tags.map((i) => i.name).join(',') }}</td>
            <td>{{ product.view_count }}</td>
            <td>{{ product.wish_count }}</td>
            <td>{{ product.hidden ? '미노출' : '노출' }}</td>
            <td>{{ Common.getDateTime(product.created_at) }}</td>
            <td>
              <va-button @click.stop="onDelete(product)" size="medium">상단고정 해제</va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <va-divider />
    <div class="row" style="justify-content: end">
      <va-button @click="onAdd">등록</va-button>
    </div>
  </div>

  <product-select-popup
    v-if="showProductSelectPopup"
    :category1-values="category1Values!"
    :category2-values="category2Values!"
    :category3-values="category3Values!"
    :category1="category1"
    :category2="category2"
    :category3="category3"
    @closed="showProductSelectPopup = false"
    @product-selected="onProductSelected"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, watchEffect } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import ProductSelectPopup from '../../../../components/popup/ProductSelectPopup.vue'
  import { requestGet, requestPost, requestPut } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import { useModal, useToast } from 'vuestic-ui'
  import { ICategory } from '../../category/product-category/Category'
  import Common from '../../../../util/common'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const category1Values = ref<ICategory[]>()
  const category1 = ref<ICategory | undefined>(undefined)
  const category2Values = ref<ICategory[]>()
  const category2 = ref<ICategory | undefined>(undefined)
  const category3Values = ref<ICategory[]>()
  const category3 = ref<ICategory | undefined>(undefined)
  const excludeInvisibleProducts = ref<boolean>(false)
  const data = ref<any[]>()
  const totalDataCount = ref<Number>(0)

  const showProductSelectPopup = ref<boolean>(false)

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
      var result = await requestGet('category', {
        parentId: null,
      })
      category1Values.value = result.data.items
      console.log(result)

      var result = await requestPost('product/list', {
        page: 1,
        take: 100,
        top_fixed: true,
        needAllCount: true,
      })
      data.value = result.data.items
      totalDataCount.value = result.data.meta.totalCount
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onSearch = async () => {
    try {
      var param = {
        category_level1_id: category1.value?.id,
        category_level2_id: category2.value?.id,
        category_level3_id: category3.value?.id,
        page: 1,
        take: 100,
        top_fixed: true,
        needAllCount: true,
      }
      if (excludeInvisibleProducts.value === true) {
        param['hidden'] = false
      }

      var result = await requestPost('product/list', param)
      data.value = result.data.items
      totalDataCount.value = result.data.meta.totalCount
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onReset = () => {
    category1.value = undefined
    category2.value = undefined
    category3.value = undefined
    excludeInvisibleProducts.value = false
  }

  const onRowClick = (id) => {
    router.push({ name: 'product-detail', params: { id: id } })
  }

  const onAdd = () => {
    showProductSelectPopup.value = true
  }

  const onProductSelected = async (product) => {
    try {
      await requestPut(`product/${product.id}`, {
        top_fixed: true,
      })

      toast('등록하였습니다.')

      onSearch()
    } catch (error) {
      console.log(error)
    }
  }

  const onDelete = (product) => {
    alert({
      message: `정말로 해제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          await requestPut(`product/${product.id}`, {
            top_fixed: false,
          })
          toast('해제하였습니다.')

          onSearch()
        } catch (error) {
          console.log(error)
        }
      },
    })
  }
</script>

<style lang="scss"></style>
