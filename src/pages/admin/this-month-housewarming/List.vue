<template>
  <page-header title="이달의 랜덤 집들이" breadcrumbsDepth1="이달의 랜덤 집들이" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 20px">
      <va-button
        :preset="tabIndex === 0 ? '' : 'secondary'"
        :border-color="tabIndex === 0 ? '' : 'primary'"
        size="medium"
        @click="tabIndex = 0"
        style="flex-grow: 0; margin-right: 10px"
        >전문가 집들이</va-button
      >

      <va-button
        :preset="tabIndex === 1 ? '' : 'secondary'"
        :border-color="tabIndex === 1 ? '' : 'primary'"
        size="medium"
        @click="tabIndex = 1"
        style="flex-grow: 0"
        >랜선 집들이</va-button
      >
    </div>

    <table class="va-table">
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
          <th>해제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
          <td>{{ element.id }}</td>
          <td>
            <va-image
              v-if="tabIndex === 1"
              :src="element.onlineHouseImages?.length > 0 ? element.onlineHouseImages[0].image_url : ''"
              style="width: 100px; height: auto"
            />
            <va-image v-if="tabIndex === 0" :src="element.thumb_url" style="width: 100px; height: auto" />
          </td>
          <td>{{ element.color_info?.name }}</td>
          <td>{{ element.area_space_info?.name }}</td>
          <td>{{ element.house_type_info?.name }}</td>
          <td>{{ element.house_style_info?.name }}</td>
          <td>{{ element.family_type_info?.name }}</td>
          <td>{{ getTagsNames(element.tags) }}</td>
          <td>{{ element.requester.name }}</td>
          <td>
            <va-button @click.stop="onUnselect(element)">해제</va-button>
          </td>
        </tr>
      </tbody>
    </table>

    <va-divider />
    <div class="row" style="justify-content: end">
      <va-button @click="onAdd">등록</va-button>
    </div>
  </div>

  <housewarming-select-popup
    v-if="showHousewarmingSelectPopup"
    :is-lan-housewarming="tabIndex === 1"
    @closed="showHousewarmingSelectPopup = false"
    @housewarming-selected="onHousewarmingSelected"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../components/PageHeader.vue'
  import HousewarmingSelectPopup from '../../../components/popup/HousewarmingSelectPopup.vue'
  import { requestPost, requestPut } from '../../../util/api'
  import { useRouter } from 'vue-router'
  import { getTagsNames } from '../../../interfaces/Tag'

  const router = useRouter()

  const tabIndex = ref<number>(0)
  const data = ref<any[]>()

  const showHousewarmingSelectPopup = ref<boolean>(false)

  const search = async () => {
    try {
      let apiUrlPrefix = tabIndex.value === 1 ? 'online-house' : 'expert-house'
      const result = await requestPost(`${apiUrlPrefix}/list`, {
        is_this_month: true,
        status: 1,
        needAllCount: true,
        sortBy : "created_at",
        order : "DESC",
      })
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  watch(tabIndex, () => {
    search()
  })

  onMounted(() => {
    search()
  })

  const onRowClick = (id) => {
    if (tabIndex.value === 1) {
      router.push({ name: 'lan-housewarming-detail', params: { id: id } })
    } else {
      router.push({ name: 'expert-housewarming-detail', params: { id: id } })
    }
  }

  const onUnselect = async (element) => {
    try {
      let apiUrlPrefix = tabIndex.value === 1 ? 'online-house' : 'expert-house'
      await requestPut(`${apiUrlPrefix}/${element.id}`, {
        is_this_month: false,
      })

      search()
    } catch (error) {
      console.log(error)
    }
  }

  const onAdd = () => {
    showHousewarmingSelectPopup.value = true
  }

  const onHousewarmingSelected = async (element) => {
    try {
      let apiUrlPrefix = tabIndex.value === 1 ? 'online-house' : 'expert-house'
      console.log(`${apiUrlPrefix}/${element.id}`)
      await requestPut(`${apiUrlPrefix}/${element.id}`, {
        is_this_month: true,
      })

      search()
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
