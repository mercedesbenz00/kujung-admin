<template>
  <page-header title="제품 관리" breadcrumbsDepth1="제품 관리" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">분류</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row">
          <va-select v-model="category1" :options="category1Values" text-by="name" />
          <va-select style="margin-left: 20px; margin-right: 20px" v-model="category2" :options="category2Values"
            text-by="name" />
          <va-select v-model="category3" :options="category3Values" text-by="name" />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">등록일</div>
        <div class="flex flex-col search-form-value">
          <div class="row" style="align-items: center">
            <va-date-input v-model="registDateFrom" />
            -
            <va-date-input v-model="registDateTo" style="margin-right: 10px" />
            <va-button class="category-button" v-for="range in registDateRangeValues" preset="secondary"
              border-color="primary" size="medium" @click="onRegistDateRangeBtnClick(range)">{{ range }}</va-button>
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">태그별</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row; overflow-x: auto">
          <va-checkbox v-for="it in tags" v-model="tag" :label="it.name" style="margin-right: 20px; flex-shrink: 0"
            :array-value="it" />
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">검색어</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row">
          <va-select style="width: 300px" v-model="keywordType" :options="keywordTypes" />
          <va-input v-model="keyword" style="margin-left: 10px" />
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
      <table class="va-table">
        <thead>
          <tr>
            <th>
              <va-checkbox v-model="checkAll" />
            </th>
            <th>상품코드</th>
            <th>이미지</th>
            <th>분류</th>
            <th>상품명</th>
            <th>태그</th>
            <th>점수</th>
            <th>조회수</th>
            <th>위시리스트</th>
            <th>상태</th>
            <th>등록일시</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in data" :key="product.id" @click="onRowClick(product.id)">
            <td><va-checkbox v-model="checkedIds" :array-value="product.id" @click.stop="" /></td>
            <td>{{ product.id }}</td>
            <td>
              <va-image :src="Common.getThumbnailUrl(product.thumbnail_url)" style="width: 100px; height: auto" />
            </td>
            <td>
              {{ Common.getCategoryString(product.category_level1, product.category_level2, product.catgory_level3) }}
            </td>
            <td>
              {{ product.title }}
            </td>
            <td>{{ product.tags.map((i) => i.name).join(',') }}</td>
            <td>{{ product.view_point }}</td>
            <td>{{ product.view_count }}</td>
            <td>{{ product.wish_count }}</td>
            <td>{{ product.hidden ? '미노출' : '노출' }}</td>
            <td>{{ Common.getDateTime(product.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="row" style="justify-content: start">
      <va-button preset="secondary" border-color="primary" size="medium" @click="onDeleteChecked">선택 삭제</va-button>
    </div>

    <div class="row" style="display: flex; justify-content: center">
      <va-pagination v-model="currentPageNumber" :pages="totalPageCount" :visible-pages="5" buttons-preset="secondary" />
    </div>

    <va-divider />
    <div class="row" style="justify-content: end">
      <va-button :to="{ name: 'product-create' }">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect, watch } from 'vue'
import PageHeader from '../../../../components/PageHeader.vue'
import { requestGet, requestPost } from '../../../../util/api'
import { useRouter } from 'vue-router'
import { useModal, useToast } from 'vuestic-ui'
import { ICategory } from '../../category/product-category/Category'
import Common from '../../../../util/common'
import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

const { init: alert } = useModal()
const { init: toast } = useToast()
const router = useRouter()

const category1Values = ref<ICategory[]>()
const category1 = ref<ICategory | undefined>(undefined)
const category2Values = ref<ICategory[]>()
const category2 = ref<ICategory | undefined>(undefined)
const category3Values = ref<ICategory[]>()
const category3 = ref<ICategory | undefined>(undefined)
const registDateRangeValues = ['오늘', '7일', '15일', '1개월', '3개월', '6개월', '1년']
const registDateFrom = ref<Date>()
const registDateTo = ref<Date>()
const tags = ref<any[]>([])
const tag = ref<any[]>([])

const keywordTypes = ref<string[]>(['상품명', '상품코드'])
const keywordType = ref<string>('상품명')
const keyword = ref<string>()
const itemsPerPageValues = ['20개씩 보기', '50개씩 보기', '100개씩 보기']
const itemsPerPage = ref<string>('20개씩 보기')
const currentPageNumber = ref<Number>(1)
const totalPageCount = ref<Number>(0)
const totalDataCount = ref<Number>(0)
const searchResultCount = ref<Number>(0)
const data = ref<any[]>()
const checkAll = ref<boolean>(false)
const checkedIds = ref<number[]>([])

watch([currentPageNumber, itemsPerPage], () => {
  onSearch()
})

watchEffect(() => {
  if (data.value !== undefined) {
    if (checkAll.value) {
      let ids = data.value.map((item) => item.id)
      checkedIds.value = [...ids]
    } else {
      checkedIds.value = []
    }
  }
})

const getItemsPerPage = () => {
  const itemsPerPageIndex = itemsPerPageValues.indexOf(itemsPerPage.value)
  const itemsPerPageNumber = [20, 50, 100][itemsPerPageIndex]
  return itemsPerPageNumber
}

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

    var result = await requestGet('tag', {})
    tags.value = result.data.items
    console.log(result)

    onSearch()
  } catch (error) {
    console.log(error)
  }
})

const onRegistDateRangeBtnClick = (range) => {
  let rangeIndex = registDateRangeValues.indexOf(range)
  let rangeDays = [0, 7, 15, 30, 90, 180, 365][rangeIndex]
  registDateTo.value = new Date()

  var fromDate = new Date()
  fromDate.setHours(0, 0, 0, 0)
  fromDate.setDate(fromDate.getDate() - rangeDays)
  registDateFrom.value = fromDate
}

const onSearch = async () => {
  try {
    var result = await requestPost('product/list', {
      category_level1_id: category1.value?.id,
      category_level2_id: category2.value?.id,
      category_level3_id: category3.value?.id,
      from: registDateFrom.value,
      to: Common.getToDate(registDateTo.value),
      tags: tag.value.map((it) => it.id),
      q: keyword.value,
      q_type: keywordType.value === '상품명' ? 'title' : 'id',
      page: currentPageNumber.value,
      take: getItemsPerPage(),
      needAllCount: true,
      sortBy : "created_at",
      order : "DESC",
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
  category1.value = undefined
  category2.value = undefined
  category3.value = undefined

  registDateFrom.value = undefined
  registDateTo.value = undefined
  tag.value = []
  keywordType.value = ''
  keyword.value = ''
}

const onDeleteChecked = () => {
  if (checkedIds.value.length === 0) {
    alert({
      message: '제품을 선택해 주세요.',
      okText: '확인',
      cancelText: null,
    })
    return
  }

  alert({
    message: `정말로 삭제하시겠습니까?`,
    okText: '삭제',
    cancelText: '취소',
    onOk: async () => {
      try {
        let result = await requestPost('product/delete/multi', {
          ids: checkedIds.value,
        })
        console.log(result)
        toast('삭제하였습니다.')

        onSearch()
      } catch (error) {
        console.log(error)
      }
    },
  })
}

const onRowClick = (id) => {
  router.push({ name: 'product-detail', params: { id: id } })
}
</script>

<style lang="scss"></style>
