<template>
  <page-header title="추천 상품 관리" breadcrumbsDepth1="추천 상품 관리" />
  <div class="layout fluid page-container">
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
            <th>추천</th>
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
              <va-button @click.stop="onDelete(product)" size="medium" color="info">추천상품 해제</va-button>
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
    @closed="showProductSelectPopup = false"
    @product-selected="onProductSelected"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import ProductSelectPopup from '../../../../components/popup/ProductSelectPopup.vue'
  import { requestPost, requestPut } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import { useModal, useToast } from 'vuestic-ui'
  import Common from '../../../../util/common'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const data = ref<any[]>()
  const totalDataCount = ref<Number>(0)

  const showProductSelectPopup = ref<boolean>(false)

  onMounted(async () => {
    try {
      var result = await requestPost('product/list', {
        page: 1,
        take: 100,
        recommended: true,
        needAllCount: true,
      })
      data.value = result.data.items
      totalDataCount.value = result.data.meta.totalCount
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onRowClick = (id) => {
    router.push({ name: 'product-detail', params: { id: id } })
  }

  const onAdd = () => {
    showProductSelectPopup.value = true
  }

  const onProductSelected = async (product) => {
    try {
      await requestPut(`product/${product.id}`, {
        recommended: true,
      })

      toast('등록하였습니다.')

      var result = await requestPost('product/list', {
        page: 1,
        take: 100,
        recommended: true,
        needAllCount: true,
      })
      data.value = result.data.items
      totalDataCount.value = result.data.meta.totalCount
    } catch (error) {
      console.log(error)
    }
  }

  const onDelete = (product) => {
    alert({
      message: `정말로 해제하시겠습니까?`,
      okText: '해제',
      cancelText: '취소',
      onOk: async () => {
        try {
          await requestPut(`product/${product.id}`, {
            recommended: false,
          })
          toast('해제하였습니다.')

          var result = await requestPost('product/list', {
            page: 1,
            take: 100,
            recommended: true,
            needAllCount: true,
          })
          data.value = result.data.items
          totalDataCount.value = result.data.meta.totalCount
        } catch (error) {
          console.log(error)
        }
      },
    })
  }
</script>

<style lang="scss"></style>
