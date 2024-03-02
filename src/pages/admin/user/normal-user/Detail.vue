<template>
  <page-header title="회원상세" breadcrumbsDepth1="일반 회원" breadcrumbsDepth2="회원 상세" />
  <div class="layout fluid page-container va-gutter-5">
    <div class="row">
      <div class="flex" style="width: 200px; display: flex; flex-direction: column; align-items: stretch">
        <va-button
          v-for="title in tabTitles"
          :preset="title === tabTitles[tabIndex] ? '' : 'secondary'"
          :border-color="title === tabTitles[tabIndex] ? '' : 'primary'"
          size="medium"
          @click="tabIndex = tabTitles.indexOf(title)"
          style="flex-grow: 0"
          >{{ title }}</va-button
        >

        <va-button
          preset="secondary"
          border-color="primary"
          size="medium"
          @click="onGotoList"
          style="margin-top: 40px; flex-grow: 0"
          >목록으로</va-button
        >
      </div>

      <div class="flex xs9">
        <user-info-view
          v-if="tabIndex === 0 && editing === false"
          :user_id="route.params.user_id"
          @edit="editing = true"
        />
        <user-memo-list-view v-if="tabIndex === 0 && editing === false" :user_id="route.params.user_id" />
        <user-info-edit-view
          v-if="tabIndex === 0 && editing === true"
          :userInfo="JSON.stringify(userInfo)"
          @canceled="editing = false"
          @saved="onUserInfoEdited"
        />

        <online-housewarming-history-view v-if="tabIndex === 1" :user_id="route.params.user_id" />

        <ask-history-view v-if="tabIndex === 2" :user_id="route.params.user_id" />

        <point-history-view v-if="tabIndex === 3" :user-info="JSON.stringify(userInfo)" />

        <point-product-order-history-view v-if="tabIndex === 4" :user_id="route.params.user_id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { requestGet } from '../../../../util/api'
  import PageHeader from '../../../../components/PageHeader.vue'
  import UserInfoView from './user-info/UserInfoView.vue'
  import UserMemoListView from './user-info/UserMemoListView.vue'
  import UserInfoEditView from './user-info/UserInfoEditView.vue'
  import OnlineHousewarmingHistoryView from './OnlineHousewarmingHistoryView.vue'
  import AskHistoryView from './ask-history/AskHistoryView.vue'
  import PointHistoryView from './point-history/PointHistoryView.vue'
  import PointProductOrderHistoryView from './point-product-order-history/PointProductOrderHistoryView.vue'

  const router = useRouter()
  const route = useRoute()

  const tabTitles = ['회원 정보', '온라인 집들이 내역', '1:1문의 내역', '포인트 내역', '포인트 상품 주문 내역']

  const tabIndex = ref<number>(0)
  const userInfo = ref()
  const editing = ref<boolean>(false)

  onMounted(async () => {
    try {
      let lastOpenedTab = localStorage.getItem('normal-user.detail.lastOpenedTab')
      if (lastOpenedTab !== null) {
        tabIndex.value = Number(lastOpenedTab)
        localStorage.removeItem('normal-user.detail.lastOpenedTab')
      }

      const result = await requestGet(`user-management/${route.params.user_id}`, {})
      userInfo.value = result.data
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onGotoList = () => {
    router.back()
  }

  const onUserInfoEdited = async () => {
    editing.value = false
    try {
      const result = await requestGet(`user-management/${route.params.user_id}`, {})
      userInfo.value = result.data
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
