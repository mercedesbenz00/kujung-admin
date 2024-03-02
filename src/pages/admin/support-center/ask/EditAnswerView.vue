<template>
  <div>
    <h6>1:1 문의 - 답변수정</h6>
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
            :disabled="index === 0"
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
        <div v-if="originalImages.length > 0" style="display: flex; flex-direction: row">
          <div
            v-for="(imageUrl, index) in originalImages"
            style="display: flex; flex-direction: column; align-items: center"
          >
            <va-image
              :src="imageUrl.image_url"
              style="width: 100px; height: auto; margin-right: 10px; margin-bottom: 10px; flex-grow: 0"
            />
            <va-button size="small" @click="onDeleteImage(index)">삭제</va-button>
          </div>
        </div>
        <va-file-upload v-model="newImages" />
        <div v-if="newImages.length === 0">선택된 파일이 없습니다.</div>
      </div>
    </div>

    <div class="row" style="justify-content: end; margin-top: 20px">
      <va-button preset="secondary" border-color="primary" size="medium" @click="onCancel">취소</va-button>
      <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { requestPut, uploadFiles } from '../../../../util/api'
  import { useModal, useToast } from 'vuestic-ui'
  import { getMergedImages } from '../../../../interfaces/Image'
  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const emit = defineEmits(['cancel', 'edited'])
  const props = defineProps<{
    answer: string
  }>()

  const answer = ref(JSON.parse(props.answer))
  const statusOptions = ['답변대기', '처리완료', '보류']
  const status = ref<string>(statusOptions[answer.value.status])
  const title = ref<string>(answer.value.answer_title)
  const content = ref<string>(answer.value.answer_content)
  const originalImages = ref<any[]>(answer.value.answerImages)
  const newImages = ref([])

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

    let mergedImages = originalImages.value
    if (newImages.value.length > 0) {
      var result = await uploadFiles(newImages.value, 'ask', 'y')
      mergedImages = getMergedImages(mergedImages, result.data)
    }

    try {
      var result = await requestPut(`question-and-answer/${answer.value.id}/answer`, {
        answer_title: title.value,
        answer_content: content.value,
        answerImages: mergedImages,
        status: statusOptions.indexOf(status.value),
      })
      console.log(result)
      toast('수정하였습니다.')

      emit('edited')
    } catch (error) {
      console.log(error)
    }
  }

  const onDeleteImage = (index) => {
    originalImages.value.splice(index, 1)
    originalImages.value = [...originalImages.value]
  }

  const onCancel = () => {
    emit('cancel')
  }
</script>

<style lang="scss"></style>
