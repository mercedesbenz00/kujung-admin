<template>
  <page-header title="포트폴리오" breadcrumbsDepth1="포트폴리오" />
  <div class="layout fluid page-container">
    <div>
      <va-button
        v-for="cat in categoryTitles"
        :preset="category == cat ? '' : 'secondary'"
        :border-color="category == cat ? '' : 'primary'"
        @click="onCategoryClick(cat)"
        style="margin-right: 10px"
        >{{ cat }}</va-button
      >
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
            <th>제목</th>
            <th>요약내용</th>
            <th>조회 수</th>
            <th>등록일시</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td>{{ element.id }}</td>
            <td>
              <va-image
                v-if="element.portfolioImages != null && element.portfolioImages.length > 0"
                :src="element.portfolioImages[0].image_url"
                style="width: 100px; height: auto"
              />
            </td>
            <td>{{ element.title }}</td>
            <td>{{ element.summary }}</td>
            <td>{{ element.view_count }}</td>
            <td>{{ Common.getDateTime(element.updated_at) }}</td>
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
      <va-button :to="{ name: 'portfolio-create' }">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestPost } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import Common from '../../../../util/common'
  import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

  const router = useRouter()

  const categoryTitles = ['전체', '브랜드', '컨벤션', '아티스트']
  const category = ref<string>('전체')
  const categoryNames = {
    전체: ['brand', 'convention', 'artist'],
    브랜드: ['brand'],
    컨벤션: ['convention'],
    아티스트: ['artist'],
  }
  const itemsPerPageValues = ['20개씩 보기', '50개씩 보기', '100개씩 보기']
  const itemsPerPage = ref<string>('20개씩 보기')
  const currentPageNumber = ref<Number>(1)
  const totalPageCount = ref<Number>(0)
  const totalDataCount = ref<Number>(0)
  const searchResultCount = ref<Number>(0)
  const data = ref<any[]>()

  const getItemsPerPage = () => {
    const itemsPerPageIndex = itemsPerPageValues.indexOf(itemsPerPage.value)
    const itemsPerPageNumber = [20, 50, 100][itemsPerPageIndex]
    return itemsPerPageNumber
  }

  const search = async () => {
    const result = await requestPost('homepage/portfolio/list', {
      categoryList: categoryNames[category.value],
      page: currentPageNumber.value,
      take: getItemsPerPage(),
      needAllCount: true,
    })
    data.value = result.data.items
    searchResultCount.value = result.data.meta.totalCount
    totalDataCount.value = result.data.meta.allCount
    totalPageCount.value = result.data.meta.pageCount
    console.log(result)
  }

  onMounted(() => {
    search()
  })

  watch([currentPageNumber, itemsPerPage, category], () => {
    search()
  })

  const onCategoryClick = (cat) => {
    category.value = cat
    currentPageNumber.value = 1
  }

  const onRowClick = (id) => {
    router.replace({ name: 'portfolio-detail', params: { id: id } })
  }
</script>

<style lang="scss"></style>
