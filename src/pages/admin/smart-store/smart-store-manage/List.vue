<template>
  <page-header title="스마트 스토어 관리" breadcrumbsDepth1="스마트 스토어 관리" />
  <div class="layout fluid page-container">
    <div class="row" style="display: flex; justify-content: end">
      <div>
        <va-input v-model="keyword" style="width: 200px; margin-right: 10px" />
        <va-button @click="onSearch">검색</va-button>
      </div>
    </div>

    <div class="row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px">
      <search-result-count-view :totalDataCount="totalDataCount" :searchResultCount="searchResultCount" />
      <va-select v-model="itemsPerPage" :options="itemsPerPageValues" style="width: 150px" />
    </div>

    <div class="row">
      <table class="va-table va-table--clickable">
        <thead>
          <tr>
            <th>#</th>
            <th>이미지</th>
            <th>상품명</th>
            <th>카테고리</th>
            <th>상태</th>
            <th>등록일시</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td>{{ element.id }}</td>
            <td>
              <va-image :src="element.thumb_url" style="width: 100px; height: auto" />
            </td>
            <td>{{ element.name }}</td>
            <td>{{ element.category }}</td>
            <td>{{ element.display ? '노출' : '미노출' }}</td>
            <td>{{ Common.getDateTime(element.created_at) }}</td>
            <td>
              <va-button v-if="element.recommended" @click.stop="onRemoveRecommend(element)">추천 해제</va-button>
              <va-button
                v-if="!element.recommended"
                preset="secondary"
                border-color="primary"
                @click.stop="onAddRecommend(element)"
                >추천 등록</va-button
              >
              <va-button style="margin-left: 10px" @click.stop="onDelete(element)">삭제</va-button>
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
      <va-button :to="{ name: 'smart-store-create' }">등록</va-button>
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

  onMounted(async () => {
    onSearch()
  })

  const onSearch = async () => {
    try {
      const result = await requestGet('smart-store', {
        page: currentPageNumber.value,
        take: getItemsPerPage(),
        q: keyword.value,
        needAllCount: true,
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

  const onRowClick = (id) => {
    router.push({ name: 'smart-store-edit', params: { id: id } })
  }

  const onAddRecommend = async (element) => {
    try {
      var result = await requestPut(`smart-store/${element.id}`, {
        recommended: true,
      })
      console.log(result)
      toast('추천하였습니다.')

      onSearch()
    } catch (error) {
      console.log(error)
    }
  }

  const onRemoveRecommend = async (element) => {
    try {
      var result = await requestPut(`smart-store/${element.id}`, {
        recommended: false,
      })
      console.log(result)
      toast('추천 해제하였습니다.')

      onSearch()
    } catch (error) {
      console.log(error)
    }
  }

  const onDelete = (element) => {
    alert({
      message: `${element.name}항목을 정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`smart-store/${element.id}`, {
            id: element.id,
          })
          console.log(result)
          toast('삭제하였습니다.')

          data.value = [...data.value!].filter((it) => element.id !== it.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }
</script>

<style lang="scss"></style>
