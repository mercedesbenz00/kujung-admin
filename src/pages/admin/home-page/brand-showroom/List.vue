<template>
  <page-header title="브랜드 쇼룸" breadcrumbsDepth1="브랜드 쇼룸" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">지역</div>
        <div class="flex flex-col search-form-value">
          <div class="row">
            <va-button
              class="area-button"
              v-for="area in allAreas"
              :preset="isAreaSelected(area) ? '' : 'secondary'"
              :border-color="isAreaSelected(area) ? '' : 'primary'"
              size="medium"
              @click="onAreaClick(area)"
              >{{ area.name }}</va-button
            >
          </div>
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">대리점명</div>
        <div class="flex flex-col search-form-value">
          <va-input v-model="name" />
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
            <th>대리점 이미지</th>
            <th>대리점명</th>
            <th>주소</th>
            <th>전화번호</th>
            <th>우선순위</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td>{{ element.id }}</td>
            <td>
              <va-image :src="element.image_url" style="width: 100px; height: auto" />
            </td>
            <td>
              {{ element.name }}
              <va-chip v-if="element.is_gold" color="warning">GOLD</va-chip>
            </td>
            <td>{{ element.addr }}&nbsp;{{ element.addr_sub }}</td>
            <td>{{ element.phone }}</td>
            <td>{{ element.priority }}</td>
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
      <va-button :to="{ name: 'brand-showroom-create' }">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestGet, requestPost } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import { ICommonConstant, getConstantsIds } from '../../../../interfaces/CommonConstant'
  import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

  const router = useRouter()

  const allAreas = ref<ICommonConstant[]>([])
  const selectedAreas = ref<ICommonConstant[]>([])
  const name = ref<string>()
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

  const isAreaSelected = (area: ICommonConstant) => {
    return selectedAreas.value.findIndex((it) => it.id === area.id) !== -1
  }

  onMounted(async () => {
    try {
      let result = await requestGet('common-constant', {
        typeList: ['area_code'],
      })
      allAreas.value = result.data[0].items

      onSearch()
    } catch (error) {
      console.log(error)
    }
  })

  const onAreaClick = (area: ICommonConstant) => {
    if (selectedAreas.value.findIndex((it) => it.id === area.id) === -1) {
      selectedAreas.value = [...selectedAreas.value].concat(area)
    } else {
      selectedAreas.value = [...selectedAreas.value].filter((it) => area.id !== it.id)
    }
  }

  const onSearch = async () => {
    try {
      var result = await requestPost('homepage/agency-store/list', {
        order:"DESC",
        sortBy: "priority",
        q: name.value,
        area_list: getConstantsIds(selectedAreas.value),
        page: currentPageNumber.value,
        take: getItemsPerPage(),
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

  watch([currentPageNumber, itemsPerPage], async () => {
    onSearch()
  })

  const onReset = () => {
    selectedAreas.value = []
    name.value = ''
  }

  const onRowClick = (id) => {
    router.replace({ name: 'brand-showroom-detail', params: { id: id } })
  }
</script>

<style lang="scss" scoped>
  .area-button {
    height: 30px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
