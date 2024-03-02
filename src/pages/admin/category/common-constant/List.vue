<template>
  <page-header title="속성" breadcrumbsDepth1="속성" />
  <div class="layout fluid page-container">
    <div>
      <va-button
        v-for="cat in categories"
        :preset="category == cat ? '' : 'secondary'"
        :border-color="category == cat ? '' : 'primary'"
        @click="onCategoryClick(cat)"
        style="margin-right: 10px"
        >{{ cat }}</va-button
      >
    </div>

    <div class="row" style="display: flex; justify-content: end">
      <div>
        <va-input v-model="keyword" style="width: 200px; margin-right: 10px" />
        <va-button @click="onSearch">검색</va-button>
      </div>
    </div>

    <div class="row">
      <table class="va-table va-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>우선순위</th>
            <th>노출여부</th>
            <th>메인노출</th>
            <th>수정/삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" :key="element.id">
            <td>{{ element.name }}</td>
            <td>{{ element.priority }}</td>
            <td>{{ element.display ? '노출' : '미노출' }}</td>
            <td>
              <va-button v-if="element.main_display" color="info" @click="onMainDisplayOff(element)"
                >메인노출 해제</va-button
              >
              <va-button v-if="element.main_display === false" color="warning" @click="onMainDisplayOn(element)"
                >메인노출</va-button
              >
            </td>
            <td>
              <va-button preset="secondary" border-color="primary" size="medium" @click="onEdit(element)"
                >수정</va-button
              >
              <va-button size="medium" @click="onDelete(element)" style="margin-start: 10px">삭제</va-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <va-divider />
    <div class="row">
      <va-input v-model="name" placeholder="이름을 입력해주세요." />
      <va-input
        v-model="priority"
        placeholder="우선순위를 입력해주세요."
        style="margin-start: 40px; margin-end: 40px"
      />
      <va-radio
        v-for="(option, index) in displayOptions"
        :key="index"
        v-model="display"
        :option="option"
        style="margin-right: 1rem; margin-top: 0px"
      />
      <va-button style="margin-start: 40px" @click="onAdd">등록</va-button>
    </div>
  </div>

  <common-constant-edit-popup
    v-if="showCommonConstantEditPopup"
    @saved="onEdited"
    @closed="showCommonConstantEditPopup = false"
    :constant="commonConstantToEdit"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestDelete, requestGet, requestPost, requestPut } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import { ICommonConstant } from '../../../../interfaces/CommonConstant'
  import CommonConstantEditPopup from './CommonConstantEditPopup.vue'

  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const categories = [
    '연령대',
    '컬러',
    '스타일',
    '주거면적',
    '주거공간',
    '가족형태',
    '인테리어 분위기',
    '질문유형',
    '지역',
    '인증서 타입',
  ]
  const categoryValues: Record<string, string> = {
    연령대: 'age_range',
    컬러: 'color',
    스타일: 'house_style',
    주거면적: 'area_space',
    주거공간: 'house_type',
    가족형태: 'family_type',
    '인테리어 분위기': 'interior_feeling',
    질문유형: 'question_type',
    지역: 'area_code',
    '인증서 타입': 'certification_type',
  }
  const category = ref<string>('컬러')

  const keyword = ref<string>('')

  const data = ref<ICommonConstant[]>()
  const commonConstantToEdit = ref<ICommonConstant>()

  const name = ref<string>('')
  const priority = ref<string>('0')
  const display = ref<string>('노출')
  const displayOptions = ['노출', '미노출']

  const showCommonConstantEditPopup = ref<boolean>(false)

  onMounted(async () => {
    onSearch()
  })

  const onCategoryClick = (cat: string) => {
    category.value = cat
    keyword.value = ''
    onSearch()
  }

  const onSearch = async () => {
    try {
      const result = await requestGet('common-constant', {
        typeList: [categoryValues[category.value]],
        q: keyword.value,
      })
      console.log(result)
      data.value = result.data[0].items
    } catch (error) {
      console.log(error)
    }
  }

  const onMainDisplayOff = async (element: ICommonConstant) => {
    try {
      await requestPut(`common-constant/${element.id}`, {
        main_display: false,
      })
      toast('변경하였습니다.')

      onSearch()
    } catch (error) {
      console.log(error)
    }
  }

  const onMainDisplayOn = async (element: ICommonConstant) => {
    try {
      await requestPut(`common-constant/${element.id}`, {
        main_display: true,
      })
      toast('변경하였습니다.')

      onSearch()
    } catch (error) {
      console.log(error)
    }
  }

  const onEdit = (element: ICommonConstant) => {
    commonConstantToEdit.value = element
    showCommonConstantEditPopup.value = true
  }

  const onEdited = async () => {
    onSearch()
  }

  const onDelete = (element: ICommonConstant) => {
    alert({
      message: '정말로 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`common-constant/${element.id}`, {})
          console.log(result)
          toast('삭제하였습니다.')

          data.value = [...data.value!].filter((it) => it.id !== element.id)
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onAdd = async () => {
    if (name.value === '') {
      alert({
        message: '이름을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (priority.value === '') {
      alert({
        message: '우선순위를 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      await requestPost('common-constant', {
        name: name.value,
        type: categoryValues[category.value],
        priority: Number(priority.value),
        display: display.value === '노출',
        main_display: false,
      })
      toast('등록하였습니다.')

      name.value = ''
      priority.value = '0'
      display.value = '노출'

      onSearch()
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
