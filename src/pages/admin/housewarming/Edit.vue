<template>
  <page-header
    v-if="isLanHousewarming"
    title="랜선 집들이 수정"
    breadcrumbsDepth1="랜선 집들이"
    breadcrumbsDepth2="랜선 집들이 수정"
  />
  <page-header
    v-if="!isLanHousewarming"
    title="전문가 집들이 수정"
    breadcrumbsDepth1="전문가 집들이"
    breadcrumbsDepth2="전문가 집들이 수정"
  />
  <div class="layout fluid page-container">
    <span class="va-h6">필수 정보</span>
    <va-divider />
    <div v-if="detailInfo !== undefined" style="margin-top: 10px; margin-bottom: 50px">
      <div class="label">컬러*</div>
      <div class="row" style="margin-top: 10px">
        <va-radio
          v-for="(it, index) in colorValues"
          :key="index"
          v-model="color"
          :label="it.name"
          :option="it"
          style="margin-right: 10px; margin-top: 0px"
        />
      </div>

      <div class="label">주거면적*</div>
      <div class="row" style="margin-top: 10px">
        <va-radio
          v-for="(it, index) in livingSpaceValues"
          :key="index"
          v-model="livingSpace"
          :label="it.name"
          :option="it"
          style="margin-right: 10px; margin-top: 0px"
        />
      </div>

      <div class="label">주거공간*</div>
      <div class="row" style="margin-top: 10px">
        <va-radio
          v-for="(it, index) in houseTypeValues"
          :key="index"
          v-model="houseType"
          :label="it.name"
          :option="it"
          style="margin-right: 10px; margin-top: 0px"
        />
      </div>

      <div class="label">스타일*</div>
      <div class="row" style="margin-top: 10px">
        <va-radio
          v-for="(it, index) in styleValues"
          :key="index"
          v-model="style"
          :label="it.name"
          :option="it"
          style="margin-right: 10px; margin-top: 0px"
        />
      </div>

      <div class="label">가족형태*</div>
      <div class="row" style="margin-top: 10px">
        <va-radio
          v-for="(it, index) in familyTypeValues"
          :key="index"
          v-model="familyType"
          :label="it.name"
          :option="it"
          style="margin-right: 10px; margin-top: 0px"
        />
      </div>

      <div class="label">태그선택* (복수 선택 가능)</div>
      <div class="row" style="margin-top: 10px">
        <va-checkbox
          v-for="it in tags"
          v-model="tag"
          :label="it.name"
          style="margin-right: 20px; margin-bottom: 10px"
          :array-value="it"
        />
      </div>

      <div v-if="!isLanHousewarming">
        <div class="label">시공주소*</div>
        <div style="margin-top: 10px">
          <va-input v-model="address" />
        </div>
      </div>
    </div>

    <div class="row">
      <span class="va-h6">마루 정보</span>
      <va-button size="small" @click="onSelectProduct" style="margin-left: 20px">마루 선택</va-button>
    </div>
    <va-divider />
    <div
      v-if="productDetail !== undefined"
      class="row"
      style="margin-top: 10px; margin-bottom: 50px; align-items: center"
    >
      마루 종류*
      <va-image
        :src="productDetail.thumbnail_url"
        style="width: 100px; height: auto; margin-left: 20px; margin-right: 10px"
      />
      <div>
        {{ productDetail.category }}<br />
        <b>{{ productDetail.name }}</b>
      </div>
    </div>

    <span class="va-h6">상세 정보</span>
    <va-divider />
    <div v-if="isLanHousewarming && detailInfo !== undefined" style="margin-top: 10px">
      <va-file-upload v-model="newImages" />
      <div v-if="newImages.length === 0">선택된 파일이 없습니다.</div>
      <div class="row" style="flex-direction: row; margin-top: 10px">
        <div
          v-for="(image, index) in originalImages"
          style="display: flex; flex-direction: column; align-items: end; margin-right: 10px"
        >
          <va-image :src="image.image_url" style="width: 100px; height: auto; margin-bottom: 4px" />
          <va-button size="small" @click="onDeleteOriginalImage(index)">삭제</va-button>
        </div>
      </div>
    </div>
    <div v-if="!isLanHousewarming && detailInfo !== undefined" style="margin-top: 10px">
      <div class="row" style="margin-top: 10px">
        <va-image :src="detailInfo.thumb_url" style="width: 100px; height: auto; margin-bottom: 4px" />
      </div>
      <va-file-upload v-model="newImages" />
      <div v-if="newImages.length === 0">선택된 파일이 없습니다.</div>
    </div>
    <div v-if="!isLanHousewarming && detailInfo !== undefined" class="label">제목*</div>
    <div v-if="!isLanHousewarming && detailInfo !== undefined" style="margin-top: 10px">
      <va-input v-model="title" />
    </div>

    <div v-if="!isLanHousewarming && detailInfo !== undefined" class="label">내용*</div>
    <div v-if="!isLanHousewarming && detailInfo !== undefined" style="margin-top: 10px">
      <QuillEditor
        v-model:content="content"
        placeholder="내용을 작성해 주세요."
        contentType="html"
        theme="snow"
        style="height: 300px"
        toolbar="full"
      />
    </div>

    <va-divider />
    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" @click="onCancel">취소</va-button>
      <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
    </div>
  </div>

  <product-select-popup
    v-if="showProductSelectPopup"
    @closed="showProductSelectPopup = false"
    @product-selected="onProductSelected"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import PageHeader from '../../../components/PageHeader.vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import ProductSelectPopup from '../../../components/popup/ProductSelectPopup.vue'
  import { requestGet, requestPut, uploadFile, uploadFiles } from '../../../util/api'
  import { useRoute, useRouter } from 'vue-router'
  import { useModal, useToast } from 'vuestic-ui'

  import { ICommonConstant, getConstantFromConstants } from '../../../interfaces/CommonConstant'
  import { ITag, getTagsFromAllTags } from '../../../interfaces/Tag'
  import { IImage, getMergedImages } from '../../../interfaces/Image'

  const router = useRouter()
  const route = useRoute()
  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const isLanHousewarming = ref<boolean>(route.path.indexOf('lan-house') > 0)
  let apiUrlPrefix = route.path.indexOf('lan-house') > 0 ? 'online-house' : 'expert-house'

  const detailInfo = ref(undefined)
  const productDetail = ref(undefined)

  const colorValues = ref<ICommonConstant[]>([])
  const color = ref<ICommonConstant | undefined>()

  const styleValues = ref<ICommonConstant[]>([])
  const style = ref<ICommonConstant | undefined>()

  const livingSpaceValues = ref<ICommonConstant[]>([])
  const livingSpace = ref<ICommonConstant | undefined>()

  const houseTypeValues = ref<ICommonConstant[]>([])
  const houseType = ref<ICommonConstant | undefined>()

  const familyTypeValues = ref<ICommonConstant[]>([])
  const familyType = ref<ICommonConstant | undefined>()

  const tags = ref<ITag[]>([])
  const tag = ref<ITag[]>([])

  const address = ref<string>('')

  const newImages = ref([])
  const originalImages = ref<IImage[]>([])

  const title = ref<string>('')
  const content = ref<string>('')

  const showProductSelectPopup = ref<boolean>(false)

  watch(route, () => {
    isLanHousewarming.value = route.path.indexOf('lan-house') > 0
    apiUrlPrefix = route.path.indexOf('lan-house') > 0 ? 'online-house' : 'expert-house'
  })

  onMounted(async () => {
    try {
      var result = await requestGet('tag', {})
      tags.value = result.data.items
      console.log(result)

      result = await requestGet('common-constant', {
        typeList: ['color', 'house_style', 'area_space', 'family_type', 'house_type'],
      })
      colorValues.value = result.data[0].items
      styleValues.value = result.data[1].items
      livingSpaceValues.value = result.data[2].items
      familyTypeValues.value = result.data[3].items
      houseTypeValues.value = result.data[4].items
      console.log(result)

      result = await requestGet(`${apiUrlPrefix}/${route.params.id}`, {})
      detailInfo.value = result.data
      color.value = getConstantFromConstants(colorValues.value, detailInfo.value!.color_info)
      style.value = getConstantFromConstants(styleValues.value, detailInfo.value!.house_style_info)
      livingSpace.value = getConstantFromConstants(livingSpaceValues.value, detailInfo.value!.area_space_info)
      familyType.value = getConstantFromConstants(familyTypeValues.value, detailInfo.value!.family_type_info)
      houseType.value = getConstantFromConstants(houseTypeValues.value, detailInfo.value!.house_type_info)

      tag.value = getTagsFromAllTags(tags.value, detailInfo.value!.tags)
      address.value = detailInfo.value!.building_addr
      originalImages.value = detailInfo.value!.onlineHouseImages
      productDetail.value = detailInfo.value!.product
      title.value = detailInfo.value!.title
      content.value = detailInfo.value!.content
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onSelectProduct = () => {
    showProductSelectPopup.value = true
  }

  const onProductSelected = (product) => {
    productDetail.value = product
  }

  const onDeleteOriginalImage = (index) => {
    originalImages.value.splice(index, 1)
    originalImages.value = [...originalImages.value]
  }

  const onCancel = () => {
    router.back()
  }

  const onSave = async () => {
    if (color.value === undefined) {
      alert({
        message: '컬러를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (livingSpace.value === undefined) {
      alert({
        message: '주거면적을 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (houseType.value === undefined) {
      alert({
        message: '주거공간을 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (style.value === undefined) {
      alert({
        message: '스타일을 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (familyType.value === undefined) {
      alert({
        message: '가족형태를 선택해 주세요.',
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
    if (!isLanHousewarming.value) {
      if (address.value === null || address.value === '') {
        alert({
          message: '시공주소를 입력해 주세요.',
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

      if (content.value === '') {
        alert({
          message: '내용을 입력해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
    }

    try {
      var param = {
        color_code: color.value.id,
        area_space_code: livingSpace.value.id,
        house_style_code: style.value.id,
        family_type_code: familyType.value.id,
        house_type_code: houseType.value.id,
        tags: tag.value.map((it) => ({ id: it.id })),
        product_id: productDetail.value.id,
      }

      if (isLanHousewarming.value) {
        var mergedImages = originalImages.value
        if (newImages.value.length > 0) {
          let result = await uploadFiles(newImages.value, apiUrlPrefix, 'y')
          mergedImages = getMergedImages(mergedImages, result.data)
        }
        param['onlineHouseImages'] = mergedImages
      } else {
        param['building_addr'] = address.value
        param['title'] = title.value
        param['content'] = content.value

        if (newImages.value.length > 0) {
          let result = await uploadFile(newImages.value[0], apiUrlPrefix, 'y')
          param['image_url'] = result.data[0].Location
          param['thumb_url'] = result.data[0].thumbLocation
        }
      }

      await requestPut(`${apiUrlPrefix}/${route.params.id}`, param)
      toast('수정하였습니다.')

      router.back()
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss"></style>
