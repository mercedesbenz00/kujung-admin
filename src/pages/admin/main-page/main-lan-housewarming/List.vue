<template>
  <page-header title="랜선집들이 메인 노출 관리" breadcrumbsDepth1="랜선집들이 메인 노출 관리" />
  <div class="layout fluid page-container">
    <div class="row">
      <table class="va-table">
        <thead>
          <tr>
            <th></th>
            <th>이미지</th>
            <th>컬러</th>
            <th>주거면적</th>
            <th>주거공간</th>
            <th>스타일</th>
            <th>가족형태</th>
            <th>태그</th>
            <th>작성자</th>
            <th>상태</th>
            <th>발행요청일시</th>
            <th>발행승인(반려)일시</th>
            <th>메인노출</th>
          </tr>
        </thead>
        <draggable v-model="data" tag="tbody" item-key="id" handle=".handle" @change="onOrderChanged">
          <template #item="{ element }">
            <tr :key="element.id">
              <td class="handle">
                <i class="fa fa-align-justify handle"></i>
              </td>
              <td>
                <va-image
                  :src="element.onlineHouseImages?.length > 0 ? element.onlineHouseImages[0].image_url : ''"
                  style="width: 100px; height: auto"
                />
              </td>
              <td>{{ element.color_info?.name }}</td>
              <td>{{ element.area_space_info?.name }}</td>
              <td>{{ element.house_type_info?.name }}</td>
              <td>{{ element.house_style_info?.name }}</td>
              <td>{{ element.family_type_info?.name }}</td>
              <td>{{ getTagsNames(element.tags) }}</td>
              <td>{{ element.requester.name }}</td>
              <td>{{ statusValues[element.status] }}</td>
              <td>{{ Common.getDateTime(element.requested_at) }}</td>
              <td>{{ element.approved_at !== null ? Common.getDateTime(element.approved_at) : '' }}</td>

              <td>
                <va-button @click="() => onDelete(element)">메인 노출 해제</va-button>
              </td>
            </tr>
          </template>
        </draggable>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestPost, requestPut } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import draggable from 'vuedraggable'
  import Common from '../../../../util/common'
  import { ICommonConstant, getConstantsIds } from '../../../../interfaces/CommonConstant'
  import { ITag, getTagsIds, getTagsNames } from '../../../../interfaces/Tag'

  const { init } = useModal()
  const { init: toast } = useToast()
  const statusValues = ['발행 대기', '발행 완료', '발행 반려']
  const data = ref<any[]>()

  onMounted(async () => {
    try {
      const result = await requestPost(`online-house/list`, {
        main_display: true,
        sortBy : "created_at",
        order : "DESC",
      })
      data.value = result.data.items
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onDelete = async (item) => {
    init({
      message: `정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestPut(`online-house/${item.id}`, {
            main_display: false,
          })
          console.log(result)
          toast('삭제하였습니다.')

          data.value = [...data.value!].filter((it) => item.id !== it.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onOrderChanged = async () => {
    console.log('onOrderChanged', data.value)
  }
</script>

<style lang="scss"></style>
