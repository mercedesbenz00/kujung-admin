<template>
  <page-header title="all about space" breadcrumbsDepth1="all about space" />
  <div class="layout fluid page-container">
    <div class="row">
      <table class="va-table">
        <thead>
          <tr>
            <th></th>
            <th>상품코드</th>
            <th>이미지</th>
            <th>분류</th>
            <th>상품명</th>
            <th>태그</th>
            <th>조회수</th>
            <th>위시리스트</th>
            <th>등록일시</th>
            <th>상단고정</th>
          </tr>
        </thead>
        <draggable v-model="products" tag="tbody" item-key="id" handle=".handle" @change="onOrderChanged">
          <template #item="{ element }">
            <tr :key="element.id">
              <td class="handle">
                <i class="fa fa-align-justify handle"></i>
              </td>
              <td>{{ element.id }}</td>
              <td>
                <va-image :src="element.thumbnail_url" style="width: 100px; height: auto" />
              </td>
              <td>
                {{
                  Common.getCategoryString(element.category_level1, element.category_level2, element.category_level3)
                }}
              </td>
              <td>{{ element.title }}</td>
              <td>{{ getTagsNames(element.tags) }}</td>
              <td>{{ element.view_count }}</td>
              <td>{{ element.wish_count }}</td>
              <td>{{ Common.getDateTime(element.created_at) }}</td>
              <td>
                <va-button @click="() => onDelete(element)">추천상품 메인 노출 해제</va-button>
              </td>
            </tr>
          </template>
        </draggable>
      </table>
    </div>

    <va-divider />
    <div class="row" style="justify-content: end">
      <va-button @click="onRegister">등록</va-button>
    </div>
  </div>

  <product-select-popup
    v-if="showProductSelectPopup"
    @closed="showProductSelectPopup = false"
    @product-selected="onProductSelected"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import ProductSelectPopup from '../../../../components/popup/ProductSelectPopup.vue'
  import { requestPost, requestPut } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import draggable from 'vuedraggable'
  import Common from '../../../../util/common'
  import { getTagsNames } from '../../../../interfaces/Tag'

  const { init } = useModal()
  const { init: toast } = useToast()

  const products = ref<any[]>()
  const showProductSelectPopup = ref<boolean>(false)

  onMounted(async () => {
    try {
      var result = await requestPost('product/list', {
        recommended: true,
      })
      products.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onRegister = () => {
    showProductSelectPopup.value = true
  }

  const onDelete = async (product) => {
    init({
      message: `${product.title}항목을 정말로 해제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestPut(`product/${product.id}`, {
            recommended: false,
          })
          console.log(result)
          toast('해제하였습니다.')

          products.value = [...products.value!].filter((it) => product.id !== it.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onOrderChanged = async () => {
    console.log('onOrderChanged', products.value)
  }

  const onProductSelected = async (product) => {
    try {
      let result = await requestPut(`product/${product.id}`, {
        recommended: true,
      })
      console.log(result)

      toast('등록하였습니다.')

      result = await requestPost('product/list', {
        recommended: true,
      })
      products.value = result.data.items
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
