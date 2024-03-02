<template>
  <page-header title="이벤트" breadcrumbsDepth1="이벤트" />
  <div class="layout fluid page-container">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">진행상태</div>
        <div class="flex flex-col search-form-value-small">
          <div class="row">
            <va-radio
              v-for="(option, index) in statuses"
              :key="index"
              v-model="status"
              :option="option"
              style="margin-right: 1rem; margin-top: 0px"
            />
          </div>
        </div>
        <div class="search-form-label" style="margin-left: -1px">사용유무</div>
        <div class="flex flex-col search-form-value-small">
          <div class="row">
            <va-radio
              v-for="(option, index) in usages"
              :key="index"
              v-model="usage"
              :option="option"
              style="margin-right: 1rem; margin-top: 0px"
            />
          </div>
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">제목</div>
        <div class="flex flex-col search-form-value">
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
            <th>제목</th>
            <th>이벤트 기간</th>
            <th>진행상태</th>
            <th>사용유무</th>
            <th>등록일시</th>
            <th>수정/삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id" @click="onRowClick(element.id)">
            <td>{{ element.id }}</td>
            <td>{{ element.title }}</td>
            <td>
              {{ Common.getDateTime(element.start_at).substring(0, 10) }} <br />
              ~ {{ Common.getDateTime(element.end_at).substring(0, 10) }}
            </td>
            <td>{{ Common.getDateStatusString(element.start_at, element.end_at) }}</td>
            <td>{{ element.enabled ? '사용' : '미사용' }}</td>
            <td>{{ Common.getDateTime(element.created_at) }}</td>
            <td>
              <va-button preset="secondary" border-color="primary" size="medium" @click.stop="onEdit(element)"
                >수정</va-button
              >
              <va-button @click.stop="onDelete(element)" style="margin-left: 10px">삭제</va-button>
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
      <va-button :to="{ name: 'event-create' }">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestDelete, requestGet } from '../../../../util/api'
  import { useRouter } from 'vue-router'
  import { useModal, useToast } from 'vuestic-ui'
  import Common from '../../../../util/common'
  import SearchResultCountView from '../../../../components/views/SearchResultCountView.vue'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()

  const statuses = ['전체', '진행중', '진행예정', '종료된']
  const status = ref<string>('전체')
  const statusValues = {
    전체: 0,
    진행중: 1,
    진행예정: 2,
    종료된: 3,
  }
  const usages = ['전체', '사용', '미사용']
  const usage = ref<string>('전체')
  const usageValues = {
    전체: undefined,
    사용: true,
    미사용: false,
  }
  const keyword = ref<string>('')
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

  onMounted(() => {
    onSearch()
  })

  const onSearch = async () => {
    try {
      var result = await requestGet('homepage/event', {
        status: statusValues[status.value],
        enabled: usageValues[usage.value],
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

  watch([currentPageNumber, itemsPerPage], async () => {
    onSearch()
  })

  const onReset = () => {
    status.value = '전체'
    usage.value = '전체'
    keyword.value = ''
  }

  const onRowClick = (id) => {
    router.replace({ name: 'event-detail', params: { id: id } })
  }

  const onDelete = (element) => {
    alert({
      message: `정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`homepage/event/${element.id}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          data.value = [...data.value!].filter((it) => element.id !== it.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onEdit = (element) => {
    router.replace({ name: 'event-edit', params: { id: element.id } })
  }
</script>

<style lang="scss"></style>
