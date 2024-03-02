<template>
  <div>
    <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
      <div>
        <h6>1:1 문의 - 답변</h6>
      </div>
      <div>
        <va-button preset="secondary" border-color="primary" size="medium" @click="onDelete">답변 삭제</va-button>
        <va-button size="medium" @click="onEditAnswer" style="margin-left: 10px">답변 수정</va-button>
      </div>
    </div>

    <div class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">처리상태</div>
        <div class="flex flex-col search-form-value">
          {{ statusValues[answer.status] }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">작성자</div>
        <div class="flex flex-col search-form-value-small">
          <div style="width: 100%; display: flex; align-items: center; justify-content: space-between">
            {{ answer.statusAdmin.name }}
          </div>
        </div>
        <div class="search-form-label" style="margin-left: -1px">등록일자</div>
        <div class="flex flex-col search-form-value-small">
          <div style="width: 100%; display: flex; align-items: center; justify-content: space-between">
            {{ Common.getDateTime(answer.answer_created_at) }}
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">최종수정</div>
        <div class="flex flex-col search-form-value-small">
          <div style="width: 100%; display: flex; align-items: center; justify-content: space-between">
            {{ answer.answerUpdatedUser.name }}
          </div>
        </div>
        <div class="search-form-label" style="margin-left: -1px">최종 수정일시</div>
        <div class="flex flex-col search-form-value-small">
          <div style="width: 100%; display: flex; align-items: center; justify-content: space-between">
            {{ Common.getDateTime(answer.answer_updated_at) }}
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">제목</div>
        <div class="flex flex-col search-form-value">
          {{ answer.answer_title }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">내용</div>
        <div class="flex flex-col search-form-value">
          {{ answer.answer_content }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">첨부파일</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row">
          <va-image
            v-for="imageUrl in answer.answerImages"
            :src="imageUrl.image_url"
            style="width: 100px; height: auto; margin-right: 10px; flex-grow: 0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { requestDelete } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import Common from '../../../../util/common'

  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const emit = defineEmits(['deleted', 'edit'])
  const props = defineProps<{
    answer: string
  }>()

  const answer = ref(JSON.parse(props.answer))
  const statusValues = ['답변대기', '처리완료', '보류']

  const onDelete = () => {
    alert({
      message: `정말로 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`question-and-answer/${answer.value.id}/answer`, {})
          console.log(result)
          toast('삭제하였습니다.')

          emit('deleted')
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onEditAnswer = async () => {
    emit('edit')
  }
</script>

<style lang="scss"></style>
