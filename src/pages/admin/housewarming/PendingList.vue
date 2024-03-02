<template>
  <page-header v-if="isLanHousewarming" title="랜선 집들이 승인대기" breadcrumbsDepth1="랜선 집들이 승인대기" />
  <page-header v-if="!isLanHousewarming" title="전문가 집들이 승인대기" breadcrumbsDepth1="전문가 집들이 승인대기" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">발행요청일시</div>
        <div class="flex flex-col search-form-value">
          <div class="row" style="align-items: center">
            <va-date-input v-model="from" />
            -
            <va-date-input v-model="to" style="margin-right: 10px" />
            <va-button
              class="category-button"
              v-for="range in dateRangeValues"
              preset="secondary"
              border-color="primary"
              size="medium"
              @click="onDateRangeBtnClick(range)"
              >{{ range }}</va-button
            >
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">컬러별</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row; overflow-x: auto">
          <va-checkbox
            v-for="it in colorValues"
            v-model="color"
            :label="it.name"
            style="margin-right: 20px; flex-shrink: 0"
            :array-value="it"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">스타일별</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row; overflow-x: auto">
          <va-checkbox
            v-for="it in styleValues"
            v-model="style"
            :label="it.name"
            style="margin-right: 20px; flex-shrink: 0"
            :array-value="it"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">주거면적</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row; overflow-x: auto">
          <va-checkbox
            v-for="it in livingSpaceValues"
            v-model="livingSpace"
            :label="it.name"
            style="margin-right: 20px; flex-shrink: 0"
            :array-value="it"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">주거공간</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row; overflow-x: auto">
          <va-checkbox
            v-for="it in houseTypeValues"
            v-model="houseType"
            :label="it.name"
            style="margin-right: 20px; flex-shrink: 0"
            :array-value="it"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">가족형태</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row; overflow-x: auto">
          <va-checkbox
            v-for="it in familyTypeValues"
            v-model="familyType"
            :label="it.name"
            style="margin-right: 20px; flex-shrink: 0"
            :array-value="it"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">태그별</div>
        <div class="flex flex-col search-form-value" style="display: flex; flex-direction: row; overflow-x: auto">
          <va-checkbox
            v-for="it in tags"
            v-model="tag"
            :label="it.name"
            style="margin-right: 20px; flex-shrink: 0"
            :array-value="it"
          />
        </div>
      </div>
      <div v-if="isLanHousewarming" class="row" style="margin-top: -1px">
        <div class="search-form-label">작성자</div>
        <div class="flex flex-col search-form-value">
          <va-input v-model="keyword" />
        </div>
      </div>
      <div v-if="!isLanHousewarming" class="row" style="margin-top: -1px">
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
      <table class="va-table">
        <thead>
          <tr>
            <th>#</th>
            <th>이미지</th>
            <th v-if="!isLanHousewarming">제목</th>
            <th>컬러</th>
            <th>주거면적</th>
            <th>주거공간</th>
            <th>스타일</th>
            <th>가족형태</th>
            <th>태그</th>
            <th>작성자</th>
            <th>상태</th>
            <th>발행 요청일시</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td>{{ element.id }}</td>
            <td>
              <va-image
                v-if="isLanHousewarming"
                :src="element.onlineHouseImages?.length > 0 ? element.onlineHouseImages[0].image_url : ''"
                style="width: 100px; height: auto"
              />
              <va-image v-if="!isLanHousewarming" :src="element.thumb_url" style="width: 100px; height: auto" />
            </td>
            <td v-if="!isLanHousewarming">{{ element.title }}</td>
            <td>{{ element.color_info?.name }}</td>
            <td>{{ element.area_space_info?.name }}</td>
            <td>{{ element.house_type_info?.name }}</td>
            <td>{{ element.house_style_info?.name }}</td>
            <td>{{ element.family_type_info?.name }}</td>
            <td>{{ getTagsNames(element.tags) }}</td>
            <td>{{ element.requester.name }}</td>
            <td>{{ statusValues[element.status] }}</td>
            <td>{{ Common.getDateTime(element.requested_at) }}</td>
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
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../components/PageHeader.vue'
  import { requestGet, requestPost } from '../../../util/api'
  import { useRouter, useRoute } from 'vue-router'
  import Common from '../../../util/common'
  import { ICommonConstant, getConstantsIds } from '../../../interfaces/CommonConstant'
  import { ITag, getTagsIds, getTagsNames } from '../../../interfaces/Tag'
  import SearchResultCountView from '../../../components/views/SearchResultCountView.vue'

  const router = useRouter()
  const route = useRoute()

  const isLanHousewarming = ref<boolean>(route.path.indexOf('lan-house') > 0)
  let apiUrlPrefix = route.path.indexOf('lan-house') > 0 ? 'online-house' : 'expert-house'

  const statusValues = ['발행 대기', '발행 완료', '발행 반려']
  const dateRangeValues = ['오늘', '7일', '15일', '1개월', '3개월', '6개월', '1년']
  const from = ref<Date>()
  const to = ref<Date>()

  const colorValues = ref<ICommonConstant[]>([])
  const color = ref<ICommonConstant[]>([])

  const styleValues = ref<ICommonConstant[]>([])
  const style = ref<ICommonConstant[]>([])

  const livingSpaceValues = ref<ICommonConstant[]>([])
  const livingSpace = ref<ICommonConstant[]>([])

  const houseTypeValues = ref<ICommonConstant[]>([])
  const houseType = ref<ICommonConstant[]>([])

  const familyTypeValues = ref<ICommonConstant[]>([])
  const familyType = ref<ICommonConstant[]>([])

  const tags = ref<ITag[]>([])
  const tag = ref<ITag[]>([])

  const keywordTypes = ref<string[]>(['제목', '작성자'])
  const keywordTypeValues = { 제목: 'expert_houses.title', 작성자: 'requester.name' }
  const keywordType = ref<string>('제목')
  const keyword = ref<string>('')
  const itemsPerPageValues = ['20개씩 보기', '50개씩 보기', '100개씩 보기']
  const itemsPerPage = ref<string>('20개씩 보기')
  const currentPageNumber = ref<Number>(1)
  const totalPageCount = ref<Number>(0)
  const totalDataCount = ref<Number>(0)
  const searchResultCount = ref<Number>(0)
  const data = ref<any[]>()

  watch(route, () => {
    isLanHousewarming.value = route.path.indexOf('lan-house') > 0
    apiUrlPrefix = route.path.indexOf('lan-house') > 0 ? 'online-house' : 'expert-house'
    onSearch()
  })

  const getItemsPerPage = () => {
    const itemsPerPageIndex = itemsPerPageValues.indexOf(itemsPerPage.value)
    const itemsPerPageNumber = [20, 50, 100][itemsPerPageIndex]
    return itemsPerPageNumber
  }

  onMounted(async () => {
    try {
      let result = await requestGet('tag', {})
      tags.value = result.data.items
      console.log(result)

      result = await requestGet('common-constant', {
        typeList: ['color', 'house_style', 'area_space', 'family_type', 'house_type'],
      })
      colorValues.value = result.data[0].items
      styleValues.value = result.data[1].items
      livingSpaceValues.value = result.data[2].items
      familyTypeValues.value = result.data[3].items
      houseTypeValues.value = result.data[4].items
      console.log(result)

      onSearch()
    } catch (error) {
      console.log(error)
    }
  })

  const onDateRangeBtnClick = (range) => {
    let rangeIndex = dateRangeValues.indexOf(range)
    let rangeDays = [0, 7, 15, 30, 90, 180, 365][rangeIndex]
    to.value = new Date()

    var fromDate = new Date()
    fromDate.setHours(0, 0, 0, 0)
    fromDate.setDate(fromDate.getDate() - rangeDays)
    from.value = fromDate
  }

  const onSearch = async () => {
    try {
      var result = await requestPost(`${apiUrlPrefix}/list`, {
        status: 0,
        from: from.value,
        to: to.value,
        q: keyword.value,
        q_type: isLanHousewarming.value === true ? 'requester.name' : keywordTypeValues[keywordType.value],
        tags: getTagsIds(tag.value),
        color_list: getConstantsIds(color.value),
        family_type_list: getConstantsIds(familyType.value),
        style_list: getConstantsIds(style.value),
        area_space_list: getConstantsIds(livingSpace.value),
        house_type_list: getConstantsIds(houseType.value),
        page: currentPageNumber.value,
        take: getItemsPerPage(),
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

  watch([currentPageNumber, itemsPerPage], async () => {
    onSearch()
  })

  const onReset = () => {
    from.value = undefined
    to.value = undefined
    tag.value = []
    color.value = []
    style.value = []
    livingSpace.value = []
    familyType.value = []
    houseType.value = []
    keyword.value = ''
    keywordType.value = '제목'
  }

  const onRowClick = (id) => {
    if (isLanHousewarming.value) {
      router.push({ name: 'lan-housewarming-detail', params: { id: id } })
    } else {
      router.push({ name: 'expert-housewarming-detail', params: { id: id } })
    }
  }
</script>

<style lang="scss"></style>
