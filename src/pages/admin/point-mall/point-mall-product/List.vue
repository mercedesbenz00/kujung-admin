<template>
  <page-header title="포인트몰 상품 관리" breadcrumbsDepth1="포인트몰 상품 관리" />
  <div class="layout fluid page-container">
    <div class="row" style="display: flex; justify-content: end">
      <div>
        <va-select v-model="keywordType" :options="keywordTypes" style="width: 200px; margin-right: 10px" />
        <va-input v-model="keyword" style="width: 200px; margin-right: 10px" />
        <va-button @click="onSearch">검색</va-button>
      </div>
    </div>

    <div class="row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px">
      <search-result-count-view :totalDataCount="totalDataCount" :searchResultCount="searchResultCount" />
      <va-select v-model="itemsPerPage" :options="itemsPerPageValues" style="width: 150px" />
    </div>

    <div class="row">
      <table class="va-table">
        <thead>
          <tr>
            <th>#</th>
            <th>이미지</th>
            <th>상품명</th>
            <th>상품 설명</th>
            <th>차감 포인트</th>
            <th>점수</th>
            <th>등록일시</th>
            <th>구정 Bee 픽</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id">
            <td>{{ element.id }}</td>
            <td>
              <va-image :src="element.thumb_url" style="width: 100px; height: auto" />
            </td>
            <td>{{ element.name }}</td>
            <td>{{ element.summary }}</td>
            <td>{{ element.point }}</td>
            <td>{{ element.view_point }}</td>
            <td>{{ Common.getDateTime(element.created_at) }}</td>
            <td>
              <va-button v-if="element.is_bee" @click.stop="onRemoveBeePick(element)">구정 Bee픽 해제</va-button>
              <va-button
                v-if="element.is_bee === false"
                preset="secondary"
                border-color="primary"
                @click.stop="onAddBeePick(element)"
                >구정 Bee픽 등록</va-button
              >
              <va-button
                preset="secondary"
                border-color="primary"
                @click.stop="onEdit(element)"
                style="margin-left: 10px; margin-right: 10px"
                >수정</va-button
              >
              <va-button @click.stop="onDelete(element)">삭제</va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="row" style="display: flex; justify-content: center">
      <va-pagination
        v-model="currentPageNumber"
        :pages="totalPageCount"
        :visible-pages="5"
        buttons-preset="secondary"
      />
    </div>

    <va-divider />
    <div class="row" style="justify-content: end">
      <va-button :to="{ name: 'point-mall-product-create' }">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestDelete, requestGet, requestPut } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import { useRouter } from 'vue-router'
  import Common from '../../../../util/common'
  import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const keywordTypes = ['상품명', '상품설명']
  const keywordTypeValues = { 상품명: 'name', 상품설명: 'summary' }
  const keywordType = ref<string>('상품명')
  const keyword = ref<string>('')

  const itemsPerPageValues = ['20개씩 보기', '50개씩 보기', '100개씩 보기']
  const itemsPerPage = ref<string>('20개씩 보기')
  const currentPageNumber = ref<Number>(1)
  const totalPageCount = ref<Number>(0)
  const totalDataCount = ref<Number>(0)
  const searchResultCount = ref<Number>(0)
  const data = ref<any[]>()

  watch([currentPageNumber, itemsPerPage], () => {
    onSearch()
  })

  const getItemsPerPage = () => {
    const itemsPerPageIndex = itemsPerPageValues.indexOf(itemsPerPage.value)
    const itemsPerPageNumber = [20, 50, 100][itemsPerPageIndex]
    return itemsPerPageNumber
  }

  onMounted(() => {
    onSearch()
  })

  const onSearch = async () => {
    try {
      const result = await requestGet('point-product', {
        page: currentPageNumber.value,
        q_type: keywordTypeValues[keywordType.value],
        q: keyword.value,
        needAllCount: true,
        take: getItemsPerPage(),
      })
      data.value = result.data.items
      searchResultCount.value = result.data.meta.totalCount
      totalPageCount.value = result.data.meta.pageCount
      totalDataCount.value = result.data.meta.allCount
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onEdit = (element) => {
    router.replace({ name: 'point-mall-product-edit', params: { id: element.id } })
  }

  const onDelete = (element) => {
    alert({
      message: `${element.name}항목을 정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`point-product/${element.id}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          data.value = [...data.value!].filter((it) => element.id !== it.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onAddBeePick = async (element) => {
    try {
      var result = await requestPut(`point-product/${element.id}`, {
        is_bee: true,
      })
      console.log(result)
      toast('등록하였습니다.')

      onSearch()
    } catch (error) {
      console.log(error)
    }
  }

  const onRemoveBeePick = async (element) => {
    try {
      var result = await requestPut(`point-product/${element.id}`, {
        is_bee: false,
      })
      console.log(result)
      toast('해제하였습니다.')

      onSearch()
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
