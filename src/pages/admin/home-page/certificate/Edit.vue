<template>
  <page-header title="인증서 수정" breadcrumbsDepth1="인증서" breadcrumbsDepth2="인증서 수정" />
  <div class="layout fluid page-container">
    <div style="margin-bottom: 5px">분류*</div>
    <va-select v-model="category" :options="categories" style="width: 200px" text-by="name" />

    <div class="label">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="label">품목*</div>
    <va-input v-model="item" placeholder="품목을 입력해 주세요." />

    <div class="label">제품명*</div>
    <va-input v-model="productName" placeholder="제품명을 입력해 주세요." />

    <div class="label">인증기관*</div>
    <va-input v-model="authority" placeholder="인증기관을 입력해 주세요." />

    <div class="label">인증기간</div>
    <va-date-input v-model="validFrom" />
    -
    <va-date-input v-model="validTo" />

    <div class="label">인증서 첨부파일*</div>
    <div style="display: flex; flex-direction: row">
      <div
        style="
          display: flex;
          align-items: center;
          padding-left: 10px;
          width: 300px;
          border-style: solid;
          border-width: 1px;
          border-color: #3a4555;
        "
      >
        {{ Common.getFileNameFromUrl(originalAttachmentFile) }}
      </div>
      <va-button @click="onDeleteCertificateFile">삭제</va-button>
    </div>
    <va-file-upload v-model="certificateFiles" />
    <div v-if="certificateFiles.length === 0">선택된 파일이 없습니다.</div>

    <div class="label">썸네일 이미지*</div>
    <va-image :src="originalThumbUrl" style="width: 100px; height: auto" />
    <va-file-upload v-model="thumbnailImages" />
    <div v-if="thumbnailImages.length === 0">선택된 파일이 없습니다.</div>

    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'certificate-list' }"
        >취소</va-button
      >
      <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'

  import { useModal, useToast } from 'vuestic-ui'
  import { requestGet, requestPost, requestPut, uploadFile } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'

  import { ICommonConstant, getConstantId } from '../../../../interfaces/CommonConstant'
  import Common from '../../../../util/common'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const id = ref(route.params.id)

  var categories = ref<ICommonConstant[]>([])
  const category = ref<ICommonConstant | null>(null)
  const title = ref<string>('')
  const item = ref<string>('')
  const productName = ref<string>('')
  const authority = ref<string>('')
  const validFrom = ref<Date>()
  const validTo = ref<Date>()
  const originalAttachmentFile = ref<string>('')
  const originalThumbUrl = ref<string>('')
  const certificateFiles = ref([])
  const thumbnailImages = ref([])

  onMounted(async () => {
    try {
      let result = await requestGet('common-constant', {
        typeList: ['certification_type'],
      })
      categories.value = result.data[0].items

      result = (await requestGet(`homepage/certification/${id.value}`, {})).data
      category.value = result.certification_type_info
      title.value = result.title
      item.value = result.variety
      productName.value = result.product_name
      authority.value = result.authority
      validFrom.value = Common.getDate(result.start_at)
      validTo.value = Common.getDate(result.end_at)
      originalAttachmentFile.value = result.attachment_file
      originalThumbUrl.value = result.thumb_url
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onDeleteCertificateFile = () => {
    originalAttachmentFile.value = ''
  }

  const onSave = async () => {
    if (category.value === null) {
      alert({
        message: '분류를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (title.value === '') {
      alert({
        message: '제목을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (item.value === '') {
      alert({
        message: '품목을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (productName.value === '') {
      alert({
        message: '제품명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (authority.value === '') {
      alert({
        message: '인증기관을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (originalAttachmentFile.value === '' && certificateFiles.value.length === 0) {
      alert({
        message: '인증서 첨부파일을 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var attachmentFileUrl = originalAttachmentFile.value
      if (certificateFiles.value.length > 0) {
        const result = await uploadFile(certificateFiles.value[0], 'certification', 'y')
        attachmentFileUrl = result.data[0].Location
      }

      var thumbnailImageUrl = originalThumbUrl.value
      if (thumbnailImages.value.length > 0) {
        const result = await uploadFile(thumbnailImages.value[0], 'certification', 'y')
        thumbnailImageUrl = result.data[0].Location
      }

      await requestPut(`homepage/certification/${id.value}`, {
        certification_type_code: category.value.id,
        title: title.value,
        variety: item.value,
        product_name: productName.value,
        authority: authority.value,
        start_at: validFrom.value,
        end_at: validTo.value,
        attachment_file: attachmentFileUrl,
        thumb_url: thumbnailImageUrl,
        thumb_url_mobile: thumbnailImageUrl,
      })
      toast('수정하였습니다.')

      router.replace({ name: 'certificate-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
