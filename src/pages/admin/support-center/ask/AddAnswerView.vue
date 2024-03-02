<template>
  <div>
    <h6>1:1 문의 - 답변</h6>
  </div>

  <div class="search-form" style="margin-top: 20px">
    <div class="row">
      <div class="search-form-label">처리상태</div>
      <div class="flex flex-col search-form-value">
        <div style="flex-direction: row">
          <va-radio
            v-for="(option, index) in statusOptions"
            :key="index"
            v-model="status"
            :option="option"
            style="margin-top: 0px; margin-right: 1rem"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="search-form-label">제목</div>
      <div class="flex flex-col search-form-value">
        <va-input v-model="title" placeholder="제목을 입력해주세요." />
      </div>
    </div>

    <div class="row">
      <div class="search-form-label">내용</div>
      <div class="flex flex-col search-form-value">
        <va-input type="textarea" v-model="content" rows="3" placeholder="내용을 입력해주세요." />
      </div>
    </div>

    <div class="row">
      <div class="search-form-label">첨부파일</div>
      <div class="flex flex-col search-form-value">
        <va-file-upload v-model="images" />
        <div v-if="images.length === 0">선택된 파일이 없습니다.</div>
      </div>
    </div>

    <div class="row" style="justify-content: end; margin-top: 20px">
      <va-button preset="secondary" border-color="primary" size="medium" @click="onCancel">취소</va-button>
      <va-button style="margin-left: 10px" @click="onSave">등록</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { requestPut, uploadFiles } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const emit = defineEmits(['cancel', 'added'])
  const props = defineProps<{
    id: number
  }>()

  const statusOptions = ['처리완료', '보류']
  const status = ref<string>('처리완료')
  const title = ref<string>('')
  const content = ref<string>('')
  const images = ref([])

  const onSave = async () => {
    if (title.value === '') {
      alert({
        message: '제목을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (content.value === '') {
      alert({
        message: '내용을 작성해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    let imageUrls = []
    if (images.value.length > 0) {
      var result = await uploadFiles(images.value, 'ask', 'y')
      imageUrls = result.data.map((it) => ({ id: null, image_url: it.Location }))
      console.log(result)
    }

    try {
      var result = await requestPut(`question-and-answer/${props.id}/answer`, {
        answer_title: title.value,
        answer_content: content.value,
        answerImages: imageUrls,
        status: 1,
      })
      console.log(result)
      toast('등록하였습니다.')

      emit('added')
    } catch (error) {
      console.log(error)
    }
  }

  const onCancel = () => {
    emit('cancel')
  }
</script>

<style lang="scss"></style>
