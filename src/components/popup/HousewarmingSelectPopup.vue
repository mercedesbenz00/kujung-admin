<template>
  <va-modal v-model="showModal" no-padding size="large" @close="$emit('closed')">
    <template #content="{ ok }">
      <div class="layout fluid" style="width: 1000px">
        <va-navbar color="#6B737F">
          <template #left>
            <va-navbar-item class="navbar-item-slot">
              <span class="title">집들이 선택</span>
            </va-navbar-item>
          </template>
          <template #right>
            <va-navbar-item class="navbar-item-slot">
              <va-button @click="ok" icon="close" />
            </va-navbar-item>
          </template>
        </va-navbar>

        <div class="search-form">
          <div class="row">
            <div class="search-form-label1">날짜</div>
            <div class="flex flex-col search-form-value1">
              <div class="row" style="align-items: center">
                <va-select v-model="dateType" :options="dateTypeValues" style="width: 200px; margin-right: 10px" />
                <va-date-input v-model="from" style="width: 130px" />
                -
                <va-date-input v-model="to" style="width: 130px; margin-right: 10px" />
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
            <div class="search-form-label1">검색어</div>
            <div class="flex flex-col search-form-value1">
              <va-input v-model="keyword" />
            </div>
          </div>
        </div>

        <div class="row" style="justify-content: center">
          <va-button preset="secondary" border-color="primary" size="medium" @click="onSearch">검색</va-button>
          <va-button style="margin-left: 10px" @click="onReset">초기화</va-button>
        </div>

        <div class="row" style="height: 500px; overflow-y: auto">
          <table class="va-table search-result-table">
            <thead>
              <tr>
                <th>#</th>
                <th>이미지</th>
                <th>컬러</th>
                <th>주거면적</th>
                <th>주거공간</th>
                <th>스타일</th>
                <th>가족형태</th>
                <th>태그</th>
                <th>작성자</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="element in data" :key="element.id">
                <td>{{ element.id }}</td>
                <td>
                  <va-image
                    v-if="isLanHousewarming"
                    :src="element.onlineHouseImages?.length > 0 ? element.onlineHouseImages[0].image_url : ''"
                    style="width: 100px; height: auto"
                  />
                  <va-image v-if="!isLanHousewarming" :src="element.thumb_url" style="width: 100px; height: auto" />
                </td>
                <td>{{ element.color_info?.name }}</td>
                <td>{{ element.area_space_info?.name }}</td>
                <td>{{ element.house_type_info?.name }}</td>
                <td>{{ element.house_style_info?.name }}</td>
                <td>{{ element.family_type_info?.name }}</td>
                <td>{{ getTagsNames(element.tags) }}</td>
                <td>{{ element.requester.name }}</td>
                <td>
                  <va-button @click.stop="onSelect(element)">선택</va-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { requestPost } from '../../util/api'
  import { getTagsNames } from '../../interfaces/Tag'

  const props = defineProps<{
    isLanHousewarming: boolean
  }>()
  const emit = defineEmits(['closed', 'housewarmingSelected'])

  const showModal = ref(true)
  const data = ref<any[]>()
  let apiUrlPrefix = props.isLanHousewarming ? 'online-house' : 'expert-house'

  const dateTypeValues = ref<string[]>(['발행요청일시', '발행승인(반려)일시'])
  const dateType = ref<string>('발행요청일시')
  const dateRangeValues = ['오늘', '7일', '15일', '1개월', '3개월', '6개월', '1년']
  const from = ref<Date>()
  const to = ref<Date>()

  const keyword = ref<string>()

  onMounted(async () => {
    try {
      const result = await requestPost(`${apiUrlPrefix}/list`, {
        status: 1,
        needAllCount: true,
      })
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onSelect = (item) => {
    showModal.value = false
    emit('housewarmingSelected', item)
  }

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
        dateType: dateType.value,
        from: from.value,
        to: to.value,
        q_type: 'requester.name',
        q: keyword.value,
      })
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onReset = () => {
    dateType.value = '발행요청일시'
    from.value = undefined
    to.value = undefined
    keyword.value = ''
  }
</script>

<style lang="scss" scoped>
  .search-form {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 10px;
    margin-bottom: 20px;

    &-label1 {
      width: 100px;
      height: auto;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 10px;
      background-color: #e5e5e5;
      border-color: #828282;
      border-width: 1px;
      border-style: solid;
      display: flex;
      align-items: center;
    }

    &-value1 {
      width: 830px;
      height: auto;
      padding-top: 10px;
      padding-bottom: 10px;
      margin-left: -1px;
      padding-left: 10px;
      padding-right: 10px;
      border-color: #828282;
      border-width: 1px;
      border-style: solid;
      display: flex;
      align-items: center;
    }
  }

  .search-result-table {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-color: #828282;
    border-width: 1px;
    border-style: solid;
  }
</style>
