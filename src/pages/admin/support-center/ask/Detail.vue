<template>
  <page-header title="1:1 문의" breadcrumbsDepth1="1:1 문의" />
  <div class="layout fluid page-container">
    <div>
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
        <div>
          <h6>1:1 문의 - 질문</h6>
        </div>
      </div>

      <div v-if="detailInfo !== null" class="search-form" style="margin-top: 20px">
        <div class="row">
          <div class="search-form-label">분류</div>
          <div class="flex flex-col search-form-value-small">
            {{ detailInfo.question_type_info?.name }}
          </div>
          <div class="search-form-label" style="margin-left: -1px">등록일시</div>
          <div class="flex flex-col search-form-value-small">
            <div style="margin-start: 10px">
              {{ Common.getDateTime(detailInfo.requested_at) }}
            </div>
          </div>
        </div>

        <div class="row" style="margin-top: -1px">
          <div class="search-form-label">이름</div>
          <div class="flex flex-col search-form-value">
            {{ detailInfo.requester.name }}
          </div>
        </div>

        <div class="row" style="margin-top: -1px">
          <div class="search-form-label">휴대폰번호</div>
          <div class="flex flex-col search-form-value-small">
            <div style="width: 100%; display: flex; align-items: center; justify-content: space-between">
              {{ detailInfo.requester.phone }}
            </div>
          </div>
          <div class="search-form-label" style="margin-left: -1px">이메일</div>
          <div class="flex flex-col search-form-value-small">
            <div style="width: 100%; display: flex; align-items: center; justify-content: space-between">
              {{ detailInfo.requester.email }}
            </div>
          </div>
        </div>

        <div class="row" style="margin-top: -1px">
          <div class="search-form-label">제목</div>
          <div class="flex flex-col search-form-value">
            {{ detailInfo.question_title }}
          </div>
        </div>

        <div class="row" style="margin-top: -1px">
          <div class="search-form-label">내용</div>
          <div class="flex flex-col search-form-value">
            {{ detailInfo.question_content }}
          </div>
        </div>

        <div class="row" style="margin-top: -1px">
          <div class="search-form-label">첨부파일</div>
          <div class="flex flex-col search-form-value" style="flex-direction: row">
            <va-image
              v-for="imageUrl in detailInfo.question_images"
              :src="imageUrl.image_url"
              style="width: 100px; height: auto; margin-right: 10px; flex-grow: 0"
            />
          </div>
        </div>
      </div>
      <va-divider />

      <no-answer-view
        v-if="detailInfo !== null && detailInfo.answer_title === null && showAddAnswer === false"
        @add-answer="onAddAnswer"
      />
      <add-answer-view
        v-if="detailInfo !== null && detailInfo.answer_title === null && showAddAnswer === true"
        @cancel="showAddAnswer = false"
        @added="onAnswerAdded"
        :id="route.params.id"
      />
      <answer-view
        v-if="detailInfo !== null && detailInfo.answer_title !== null && showEditAnswer === false"
        :answer="JSON.stringify(detailInfo)"
        @deleted="onAnswerDeleted"
        @edit="onEditAnswer"
      />
      <edit-answer-view
        v-if="detailInfo !== null && detailInfo.answer_title !== null && showEditAnswer === true"
        :answer="JSON.stringify(detailInfo)"
        @cancel="showEditAnswer = false"
        @edited="onAnswerEdited"
      />

      <va-divider />
      <va-button size="medium" @click="onGoBack">뒤로</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestGet } from '../../../../util/api'
  import NoAnswerView from './NoAnswerView.vue'
  import AddAnswerView from './AddAnswerView.vue'
  import AnswerView from './AnswerView.vue'
  import EditAnswerView from './EditAnswerView.vue'
  import { useRoute, useRouter } from 'vue-router'
  import Common from '../../../../util/common'

  const router = useRouter()
  const route = useRoute()

  const detailInfo = ref(null)
  const showAddAnswer = ref<boolean>(false)
  const showEditAnswer = ref<boolean>(false)

  onMounted(async () => {
    try {
      const result = (await requestGet(`question-and-answer/${route.params.id}`, {})).data
      detailInfo.value = result
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onAddAnswer = () => {
    showAddAnswer.value = true
  }

  const onAnswerAdded = async () => {
    try {
      const result = (await requestGet(`question-and-answer/${route.params.id}`, {})).data
      detailInfo.value = result
      showAddAnswer.value = false
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onEditAnswer = () => {
    showEditAnswer.value = true
  }

  const onAnswerEdited = async () => {
    try {
      const result = (await requestGet(`question-and-answer/${route.params.id}`, {})).data
      detailInfo.value = result
      showEditAnswer.value = false
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onAnswerDeleted = async () => {
    try {
      const result = (await requestGet(`question-and-answer/${route.params.id}`, {})).data
      detailInfo.value = result
      showAddAnswer.value = false
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const onGoBack = () => {
    router.back()
  }
</script>

<style lang="scss"></style>
