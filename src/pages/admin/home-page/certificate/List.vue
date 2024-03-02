<template>
  <page-header title="인증서" breadcrumbsDepth1="인증서" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">분류</div>
        <div class="flex flex-col search-form-value">
          <div class="row">
            <va-button
              class="category-button"
              v-for="cat in categories"
              :preset="isCategorySelected(cat) ? '' : 'secondary'"
              :border-color="isCategorySelected(cat) ? '' : 'primary'"
              size="medium"
              @click="onCategoryClick(cat)"
              >{{ cat.name }}</va-button
            >
          </div>
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">검색어</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row">
          <va-select v-model="keywordType" :options="keywordTypes" style="width: 200px; margin-right: 10px" />
          <va-input v-model="keyword" />
        </div>
      </div>
    </div>

    <div class="row" style="justify-content: center">
      <va-button preset="secondary" border-color="primary" size="medium" @click="onSearch">검색</va-button>
      <va-button style="margin-left: 10px" @click="onReset">초기화</va-button>
    </div>
    <va-divider />

    <div class="row" style="display: flex; justify-content: space-between; align-items: center">
      <search-result-count-view :totalDataCount="totalDataCount" :searchResultCount="searchResultCount" />
      <va-select v-model="itemsPerPage" :options="itemsPerPageValues" style="width: 150px" />
    </div>

    <div class="row">
      <table class="va-table va-table--clickable">
        <thead>
          <tr>
            <th>#</th>
            <th>분류</th>
            <th>썸네일 이미지</th>
            <th>제목</th>
            <th>품목</th>
            <th>제품명</th>
            <th>등록일시</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td>{{ element.id }}</td>
            <td>{{ element.certification_type_info.name }}</td>
            <td>
              <va-image :src="element.thumb_url" style="width: 100px; height: auto" />
            </td>
            <td>{{ element.title }}</td>
            <td>{{ element.variety }}</td>
            <td>{{ element.product_name }}</td>
            <td>{{ Common.getDateTime(element.updated_at) }}</td>
            <td>
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
      <va-button :to="{ name: 'certificate-create' }">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestDelete, requestGet, requestPost } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import { useModal, useToast } from 'vuestic-ui'
  import { ICommonConstant } from '../../../../interfaces/CommonConstant'
  import Common from '../../../../util/common'
  import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const categories = ref<ICommonConstant[]>([])
  const category = ref<ICommonConstant | null>(null)
  const keywordTypes = ['제목', '품목', '제품명']
  const keywordType = ref<string>('제목')
  const keywordTypeValues = {
    제목: 'title',
    품목: 'variety',
    제품명: 'product_name',
  }
  const keyword = ref<string>('')
  const itemsPerPageValues = ['20개씩 보기', '50개씩 보기', '100개씩 보기']
  const itemsPerPage = ref<string>('20개씩 보기')
  const currentPageNumber = ref<Number>(1)
  const totalPageCount = ref<Number>(0)
  const totalDataCount = ref<Number>(0)
  const searchResultCount = ref<Number>(0)
  const data = ref<any[]>()

  watch([currentPageNumber, itemsPerPage, category], async () => {
    onSearch()
  })

  onMounted(async () => {
    try {
      let result = await requestGet('common-constant', {
        typeList: ['certification_type'],
      })
      categories.value = result.data[0].items
      category.value = categories.value[0]

      onSearch()
    } catch (error) {
      console.log(error)
    }
  })

  const getItemsPerPage = () => {
    const itemsPerPageIndex = itemsPerPageValues.indexOf(itemsPerPage.value)
    const itemsPerPageNumber = [20, 50, 100][itemsPerPageIndex]
    return itemsPerPageNumber
  }

  const isCategorySelected = (cat) => {
    return category.value.id === cat.id
  }

  const onCategoryClick = (cat) => {
    category.value = cat
  }

  const onSearch = async () => {
    try {
      currentPageNumber.value = 1
      var result = await requestPost('homepage/certification/list', {
        certification_type_list: [category.value.id],
        q_type: keywordTypeValues[keywordType.value],
        q: keyword.value,
        page: currentPageNumber.value,
        itemsPerPage: getItemsPerPage(),
        needAllCount: true,
      })
      data.value = result.data.items
      searchResultCount.value = result.data.meta.totalCount
      totalDataCount.value = result.data.meta.allCount
      totalPageCount.value = result.data.meta.pageCount
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onReset = () => {
    category.value = categories.value[0]
    keywordType.value = '제목'
    keyword.value = ''
  }

  const onRowClick = (id) => {
    router.replace({ name: 'certificate-edit', params: { id: id } })
  }

  const onDelete = (element) => {
    alert({
      message: `${element.title}항목을 정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`homepage/certification/${element.id}`, {})
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

<style lang="scss" scoped>
  .category-button {
    height: 30px;
    margin-right: 10px;
  }
</style>
