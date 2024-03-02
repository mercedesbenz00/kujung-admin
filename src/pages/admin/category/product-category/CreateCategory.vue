<template>
  <div class="layout fluid" style="padding: 20px; border-style: solid; border-width: 1px; border-color: #e5e5e5">
    <div class="label">{{ Depths[depth] }}명*</div>
    <va-input v-model="name" placeholder="분류명을 입력하세요." />

    <div class="label">노출 여부</div>
    <va-radio
      v-for="(option, index) in visibleOptions"
      :key="index"
      v-model="visible"
      :option="option"
      style="margin-right: 1rem"
    />

    <div class="label">대표이미지*</div>
    <va-image v-if="originalMainImageUrl !== ''" :src="originalMainImageUrl" style="width: 100px; height: auto" />
    <va-file-upload v-model="mainImage" />
    <div v-if="mainImage.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="label">소개이미지*</div>
    <div v-if="originalCategoryImages.length > 0" class="row" style="margin-left: 0px; margin-right: 0px">
      <div
        v-for="(image, index) in originalCategoryImages"
        style="display: flex; flex-direction: column; align-items: center"
      >
        <va-image :src="image.image_url" style="width: 100px; height: auto; margin-right: 10px" />
        <va-button color="warning" size="small" style="margin-top: 10px" @click="onDeleteImageUrl(index)"
          >삭제</va-button
        >
      </div>
    </div>
    <va-file-upload v-model="images" />
    <div v-if="images.length === 0">선택된 파일이 없습니다.</div>
    <va-divider />

    <div class="label">제품 요약 설명*</div>
    <QuillEditor
      v-model:content="desc"
      placeholder="제품의 요약 설명을 입력하세요."
      contentType="html"
      theme="snow"
      style="height: 100px"
    />

    <div class="label">태그*(,으로 구분)</div>
    <vue3-tags-input :tags="tags" placeholder="태그를 입력하세요." @on-tags-changed="(newTags) => (tags = newTags)" />

    <div class="label">유튜브*</div>
    <div class="row" style="margin-left: 0px; margin-right: 0px">
      <div v-for="(youtubeUrl, index) in youtubeUrls" style="margin-right: 10px; margin-bottom: 10px">
        <iframe
          :src="`https://www.youtube.com/embed/${Common.getYoutubeIdFromURL(youtubeUrl)}?autoplay=0&rel=0&loop=1`"
          style="width: 200px; height: 200px"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
        <div style="display: flex; flex-direction: row; margin-top: 4px; justify-content: space-evenly">
          <va-button color="info" size="small" @click="onEditYoutubeUrl(index)">수정</va-button>
          <va-button color="warning" size="small" style="margin-left: 10px" @click="onDeleteYoutubeUrl(index)"
            >삭제</va-button
          >
        </div>
      </div>
    </div>

    <div
      class="row"
      style="display: flex: flex-direction: row; margin-top: 20px; align-items: center; margin-left:0px; margin-right: 0px;"
    >
      추가:
      <va-input
        v-model="youtubeUrl"
        placeholder="유튜브 URL을 입력해주세요."
        style="margin-left: 10px; margin-right: 10px"
      />
      <va-button @click="onAddYoutubeUrl">등록</va-button>
    </div>

    <va-divider />

    <div class="row" style="display: flex; flex-direction: row; justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" @click="onDelete">삭제</va-button>
      <va-button size="medium" style="margin-left: 10px" @click="onSave">저장</va-button>
    </div>
  </div>

  <youtube-url-edit-popup
    v-if="showYoutubeUrlEditPopup"
    @edited="onYoutubeUrlEdited"
    @closed="showYoutubeUrlEditPopup = false"
    :url="youtubeUrls[youtubeUrlIndexToEdit]"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { Depths, ICategory } from './Category'
  import { useModal, useToast } from 'vuestic-ui'
  import { requestPost, uploadFile, uploadFiles } from '../../../../util/api'
  import Common from '../../../../util/common'
  import YoutubeUrlEditPopup from './YoutubeUrlEditPopup.vue'
  import Vue3TagsInput from 'vue3-tags-input'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { IImage, getMergedImages } from '../../../../interfaces/Image'

  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const props = defineProps<{
    parentId?: string
    depth: number
    category: ICategory
  }>()

  const emit = defineEmits(['deleted', 'created'])

  const name = ref<string>('')
  const visible = ref<string>('노출')
  const visibleOptions = ['노출', '미노출']
  const originalMainImageUrl = ref<string>('')
  const originalCategoryImages = ref<IImage[]>([])
  const mainImage = ref([])
  const images = ref([])
  const desc = ref<string>('')
  const tags = ref([])
  const youtubeUrls = ref<string[]>([])
  const youtubeUrl = ref<string>('')
  const youtubeUrlIndexToEdit = ref<number>(0)
  const showYoutubeUrlEditPopup = ref<boolean>(false)

  onMounted(() => {
    name.value = props.category.name
    visible.value = props.category.hidden ? '미노출' : '노출'
    originalMainImageUrl.value = props.category.image_url
    originalCategoryImages.value = props.category.categoryImages
    desc.value = props.category.desc
    tags.value = props.category.tags !== null ? props.category.tags.split(',') : []
    youtubeUrls.value = props.category.categoryYoutubes.map((it) => it.url)
  })

  const onSave = async () => {
    if (name.value === '') {
      alert({
        message: '분류명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (originalMainImageUrl.value === '' && mainImage.value.length === 0) {
      alert({
        message: '대표이미지를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (originalCategoryImages.value.length === 0 && images.value.length === 0) {
      alert({
        message: '소개이미지를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (desc.value === '') {
      alert({
        message: '제품의 요약설명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (tags.value.length === 0) {
      alert({
        message: '태그를 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    try {
      var newMainImageUrl = originalMainImageUrl.value
      if (mainImage.value.length > 0) {
        var result = await uploadFile(mainImage.value[0], 'product-category', 'y')
        newMainImageUrl = result.data[0].Location
      }

      var newImageUrls = originalCategoryImages.value
      if (images.value.length > 0) {
        result = await uploadFiles(images.value, 'product-category', 'y')
        newImageUrls = getMergedImages(newImageUrls, result.data)
      }

      var categoryYoutubes = youtubeUrls.value.map((it) => ({
        id: null,
        title: '',
        summary: '',
        url: it,
      }))

      result = await requestPost('category', {
        name: name.value,
        parentId: props.parentId,
        depth: props.depth,
        image_url: newMainImageUrl,
        categoryImages: newImageUrls,
        desc: desc.value,
        tags: tags.value.join(','),
        categoryYoutubes: categoryYoutubes,
        hidden: visible.value === '미노출',
      })
      console.log(result)
      toast('등록하였습니다.')

      emit('created', result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const onDelete = () => {
    emit('deleted')
  }

  const onDeleteImageUrl = (index: number) => {
    originalCategoryImages.value.splice(index, 1)
    originalCategoryImages.value = [...originalCategoryImages.value]
  }

  const onAddYoutubeUrl = () => {
    if (youtubeUrl.value === '') {
      alert({
        message: '유튜브 URL을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    youtubeUrls.value = [...youtubeUrls.value, youtubeUrl.value]
    youtubeUrl.value = ''
  }

  const onDeleteYoutubeUrl = (index: number) => {
    youtubeUrls.value.splice(index, 1)
    youtubeUrls.value = [...youtubeUrls.value]
  }

  const onEditYoutubeUrl = (index: number) => {
    youtubeUrlIndexToEdit.value = index
    showYoutubeUrlEditPopup.value = true
  }

  const onYoutubeUrlEdited = (newUrl: string) => {
    youtubeUrls.value[youtubeUrlIndexToEdit.value] = newUrl
    youtubeUrls.value = [...youtubeUrls.value]
  }
</script>

<style lang="scss" scoped>
  .label {
    margin-bottom: 10px;
  }
</style>
