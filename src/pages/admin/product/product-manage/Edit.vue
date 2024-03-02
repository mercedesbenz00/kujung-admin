<template>
  <page-header title="제품 수정" breadcrumbsDepth1="제품 관리" breadcrumbsDepth2="제품 수정" />
  <div class="layout fluid page-container">
    <h6 class="va-h6" style="margin-bottom: 15px">상품정보</h6>

    <div class="row" style="display: flex; flex-direction: row">
      <div>
        <div style="margin-bottom: 5px">대분류*</div>
        <va-select v-model="category1" :options="category1Values" text-by="name" />
      </div>

      <div style="margin-left: 10px; margin-right: 10px">
        <div style="margin-bottom: 5px">중분류*</div>
        <va-select v-model="category2" :options="category2Values" text-by="name" />
      </div>

      <div>
        <div style="margin-bottom: 5px">소분류*</div>
        <va-select v-model="category3" :options="category3Values" text-by="name" />
      </div>
    </div>

    <div class="label">제목*</div>
    <va-input v-model="title" placeholder="제목을 입력해 주세요." />

    <div class="row" style="display: flex; flex-direction: row">
      <div style="flex-grow: 1; margin-right: 10px">
        <div class="label">시공법*</div>
        <va-input v-model="method" placeholder="시공법을 입력해 주세요." />
      </div>
      <div style="flex-grow: 1">
        <div class="label">규격*</div>
        <div class="row" style="align-items: end">
          <va-input v-model="size_w" />(W) <va-input v-model="size_l" style="margin-left: 10px" />(L)
          <va-input v-model="size_t" style="margin-left: 10px" />(T)mm
        </div>
      </div>
    </div>

    <div class="label">제품설명*</div>
    <va-input v-model="desc" placeholder="제품설명을 작성해 주세요." />

    <div class="label">관리자 점수</div>
    <va-input v-model="view_point" placeholder="관리자 점수를 입력해 주세요." />

    <div class="label">컬러*</div>
    <div class="row">
      <va-radio
        v-for="(option, index) in colorValues"
        :key="index"
        v-model="color"
        :option="option"
        :label="option.name"
        style="margin-right: 1rem; margin-top: 0px"
      />
    </div>

    <div class="label">주거형태*</div>
    <div class="row">
      <va-radio
        v-for="(option, index) in livingTypeValues"
        :key="index"
        v-model="livingType"
        :option="option"
        :label="option.name"
        style="margin-right: 1rem; margin-top: 0px"
      />
    </div>

    <div class="label">스타일*</div>
    <div class="row">
      <va-radio
        v-for="(option, index) in styleValues"
        :key="index"
        v-model="style"
        :option="option"
        :label="option.name"
        style="margin-right: 1rem; margin-top: 0px"
      />
    </div>

    <div class="label">주거공간*</div>
    <div class="row">
      <va-radio
        v-for="(option, index) in livingSpaceValues"
        :key="index"
        v-model="livingSpace"
        :option="option"
        :label="option.name"
        style="margin-right: 1rem; margin-top: 0px"
      />
    </div>

    <div class="label">태그*</div>
    <div class="row">
      <va-checkbox
        v-for="it in tags"
        v-model="tag"
        :label="it.name"
        style="margin-right: 20px; margin-bottom: 10px"
        :array-value="it"
      />
    </div>

    <div class="label">썸네일 이미지*</div>
    <va-image :src="thumbnailImageUrl" style="width: 100px; height: auto; flex-grow: 0; margin-right: 10px" />
    <va-file-upload v-model="thumbnailImages" />
    <div v-if="thumbnailImages.length === 0">선택된 파일이 없습니다.</div>

    <div class="label">상세정보*</div>
    <QuillEditor
      v-model:content="detail"
      placeholder="상세정보를 작성해 주세요."
      contentType="html"
      theme="snow"
      style="height: 100px"
      toolbar="full"
    />
    <div class="label">제품 이미지*</div>
    <div class="row">
      <div v-for="(imageUrl, index) in productImageUrls" style="display: flex; flex-direction: column; align-items: center">
        <va-image :src="imageUrl" style="width: 100px; height: auto; margin-right: 10px" />
        <va-button color="warning" size="small" style="margin-top: 10px" @click="onDeleteImageUrl(index)"
          >삭제</va-button
        >
      </div>
    </div>
    <va-file-upload v-model="productImages" />
    <div v-if="productImages.length === 0">선택된 파일이 없습니다.</div>

    <div class="label">아이콘</div>
    <div class="row">
      <va-checkbox v-model="isNew" /><va-chip color="warning" style="margin-left: 10px; margin-right: 20px"
        >NEW</va-chip
      >
      <va-checkbox v-model="isBest" /><va-chip color="info" style="margin-left: 10px">BEST</va-chip>
    </div>

    <div class="label">상태</div>
    <div class="row">
      <va-radio
        v-for="(option, index) in statusValues"
        :key="index"
        v-model="status"
        :option="option"
        style="margin-right: 1rem; margin-top: 0px"
      />
    </div>

    <va-divider />

    <div class="row" style="align-items: center; margin-bottom: 15px">
      <h6 class="va-h6" style="margin-right: 10px">유튜브</h6>
      <va-switch v-model="youtube" size="small" />
    </div>

    <div class="label">유튜브 썸네일*</div>
    <va-image
      v-if="youtubeThumbnailImageUrl !== ''"
      :src="youtubeThumbnailImageUrl"
      style="width: 100px; height: auto; flex-grow: 0; margin-right: 10px"
    />
    <va-file-upload v-model="youtubeThumbnailImages" />
    <div v-if="youtubeThumbnailImages.length === 0">선택된 파일이 없습니다.</div>

    <div class="label">유튜브 제목*</div>
    <va-input v-model="youtubeTitle" placeholder="유튜브 제목을 작성해 주세요." :max-length="255" counter />

    <div class="label">유튜브 요약 내용*</div>
    <va-input v-model="youtubeDesc" placeholder="유튜브 요약 내용을 작성해 주세요." />
    <div class="label">유튜브 URL*</div>
    <va-input v-model="youtubeUrl" placeholder="유튜브 URL을 작성해 주세요." />

    <va-divider />

    <div class="row" style="align-items: center; margin-bottom: 15px">
      <h6 class="va-h6" style="margin-right: 10px">블로그1</h6>
      <va-switch v-model="blog1" size="small" />
    </div>

    <div v-if="blog1">
      <div class="label">블로그 썸네일*</div>
      <va-image
        v-if="blogThumbnailImageUrl1 !== ''"
        :src="blogThumbnailImageUrl1"
        style="width: 100px; height: auto; flex-grow: 0; margin-right: 10px"
      />
      <va-file-upload v-model="blogThumbnailImages1" />
      <div v-if="blogThumbnailImages1.length === 0">선택된 파일이 없습니다.</div>

      <div class="label">블로그 제목*</div>
      <va-input v-model="blogTitle1" placeholder="블로그 제목을 작성해 주세요." :max-length="255" counter />

      <div class="label">블로그 요약 내용*</div>
      <va-input v-model="blogDesc1" placeholder="블로그 요약 내용을 작성해 주세요." />
      <div class="label">블로그 URL*</div>
      <va-input v-model="blogUrl1" placeholder="블로그 URL을 작성해 주세요." />
    </div>
    <va-divider />    

    <div class="row" style="align-items: center; margin-bottom: 15px">
      <h6 class="va-h6" style="margin-right: 10px">블로그2</h6>
      <va-switch v-model="blog2" size="small" />
    </div>

    <div v-if="blog2">
      <div class="label">블로그 썸네일*</div>
      <va-image
        v-if="blogThumbnailImageUrl2 !== ''"
        :src="blogThumbnailImageUrl2"
        style="width: 100px; height: auto; flex-grow: 0; margin-right: 10px"
      />
      <va-file-upload v-model="blogThumbnailImages2" />
      <div v-if="blogThumbnailImages2.length === 0">선택된 파일이 없습니다.</div>

      <div class="label">블로그 제목*</div>
      <va-input v-model="blogTitle2" placeholder="블로그 제목을 작성해 주세요." :max-length="255" counter />

      <div class="label">블로그 요약 내용*</div>
      <va-input v-model="blogDesc2" placeholder="블로그 요약 내용을 작성해 주세요." />
      <div class="label">블로그 URL*</div>
      <va-input v-model="blogUrl2" placeholder="블로그 URL을 작성해 주세요." />
    </div>
    <va-divider />

    <h6 class="va-h6" style="margin-right: 10px">비슷한 디자인 제품보기</h6>
    <table class="va-table">
      <thead>
        <tr>
          <th></th>
          <th>상품코드</th>
          <th>이미지</th>
          <th>분류</th>
          <th>상품명</th>
          <th>태그</th>
          <th>노출여부</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="element in similarProducts" :key="element.id">
          <td class="handle">
            <i class="fa fa-align-justify handle"></i>
          </td>
          <td>{{ element.id }}</td>
          <td>
            <va-image :src="element.thumbnail_url" style="width: 100px; height: auto" />
          </td>
          <td>
            {{ Common.getCategoryString(element.category_level1, element.category_level2, element.catgory_level3) }}
          </td>
          <td>{{ element.title }}</td>
          <td>{{ element.tags.map((it) => it.name).join(',') }}</td>
          <td>{{ element.hidden ? '미노출' : '노출' }}</td>
          <td>
            <va-button @click="() => onDeleteSimilarProduct(element)">삭제</va-button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="row" style="justify-content: end">
      <va-button @click="onAddSimilarProduct">등록</va-button>
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
    @product-selected="onSimilarProductSelected"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, watchEffect } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { useModal, useToast } from 'vuestic-ui'
  import { requestGet, requestPut, uploadFile, uploadFiles } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'
  import ProductSelectPopup from '../../../../components/popup/ProductSelectPopup.vue'
  import { ICategory, isExistedCategory } from '../../category/product-category/Category'
  import { ICommonConstant, getConstantFromConstants } from '../../../../interfaces/CommonConstant'
  import Common from '../../../../util/common'
  import { ITag, getTagsFromAllTags } from '../../../../interfaces/Tag'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const category1Values = ref<ICategory[]>()
  const category1 = ref<ICategory | undefined>(undefined)
  const category2Values = ref<ICategory[]>()
  const category2 = ref<ICategory | undefined>(undefined)
  const category3Values = ref<ICategory[]>()
  const category3 = ref<ICategory | undefined>(undefined)
  const title = ref<string>('')
  const method = ref<string>('')
  const size_w = ref<string>('')
  const size_l = ref<string>('')
  const size_t = ref<string>('')
  const desc = ref<string>('')
  const view_point = ref<string>('')

  const colorValues = ref<ICommonConstant[]>([])
  const color = ref<ICommonConstant>()

  const livingTypeValues = ref<ICommonConstant[]>([])
  const livingType = ref<ICommonConstant>()

  const livingSpaceValues = ref<ICommonConstant[]>([])
  const livingSpace = ref<ICommonConstant>()

  const styleValues = ref<ICommonConstant[]>([])
  const style = ref<ICommonConstant>()

  const tags = ref<ITag[]>([])
  const tag = ref<ITag[]>([])
  const thumbnailImageUrl = ref('')
  const thumbnailImages = ref([])
  const detail = ref<string>('')
  const productImageUrls = ref([])
  const productImages = ref([])
  const isNew = ref<boolean>(false)
  const isBest = ref<boolean>(false)
  const statusValues = ['노출', '미노출']
  const status = ref<string>('노출')

  const youtube = ref<boolean>(false)
  const youtubeThumbnailImageUrl = ref('')
  const youtubeThumbnailImages = ref([])
  const youtubeTitle = ref<string>('')
  const youtubeDesc = ref<string>('')
  const youtubeUrl = ref<string>('')

  const blog1 = ref<boolean>(false)
  const blogThumbnailImageUrl1 = ref('')
  const blogThumbnailImages1 = ref([])
  const blogTitle1 = ref<string>('')
  const blogDesc1 = ref<string>('')
  const blogUrl1 = ref<string>('')

  const blog2 = ref<boolean>(false)
  const blogThumbnailImageUrl2 = ref('')
  const blogThumbnailImages2 = ref([])
  const blogTitle2 = ref<string>('')
  const blogDesc2 = ref<string>('')
  const blogUrl2 = ref<string>('')

  const similarProducts = ref<any[]>([])
  const showProductSelectPopup = ref<boolean>(false)

  watchEffect(async () => {
    if (category1.value !== undefined && category1.value !== null) {
      try {
        var result = await requestGet('category', {
          parentId: category1.value.id,
        })
        category2Values.value = result.data.items
        if (isExistedCategory(result.data.items, category2.value) === false) {
          category2.value = undefined
        }
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
  })

  watchEffect(async () => {
    if (category2.value !== undefined && category2.value !== null) {
      try {
        var result = await requestGet('category', {
          parentId: category2.value.id,
        })
        category3Values.value = result.data.items
        if (isExistedCategory(result.data.items, category3.value) === false) {
          category3.value = undefined
        }
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
  })

  onMounted(async () => {
    try {
      var result = await requestGet('tag', {})
      tags.value = result.data.items

      result = await requestGet('common-constant', {
        typeList: ['color', 'house_style', 'area_space', 'family_type'],
      })
      colorValues.value = result.data[0].items
      styleValues.value = result.data[1].items
      livingSpaceValues.value = result.data[2].items
      livingTypeValues.value = result.data[3].items

      var result = await requestGet('category', {
        parentId: null,
      })
      category1Values.value = result.data.items

      var result = await requestGet(`product/${route.params.id}`, {})
      const productDetail = result.data
      const productYoutube = productDetail.productYoutube
      const productBlogs = productDetail.productBlogs
      similarProducts.value = productDetail.similarProducts

      category1.value = productDetail.category_level1
      category2.value = productDetail.category_level2
      category3.value = productDetail.category_level3
      title.value = productDetail.title
      method.value = productDetail.construction_law
      size_w.value = productDetail.size_w
      size_l.value = productDetail.size_l
      size_t.value = productDetail.size_t
      desc.value = productDetail.desc
      view_point.value = productDetail.view_point
      color.value = getConstantFromConstants(colorValues.value, productDetail.color_info)
      style.value = getConstantFromConstants(styleValues.value, productDetail.house_style_info)
      livingSpace.value = getConstantFromConstants(livingSpaceValues.value, productDetail.area_space_info)
      livingType.value = getConstantFromConstants(livingTypeValues.value, productDetail.family_type_info)
      tag.value = getTagsFromAllTags(tags.value, productDetail.tags)
      thumbnailImageUrl.value = productDetail.thumbnail_url
      detail.value = productDetail.detail_info
      productImageUrls.value = productDetail.productImages.map((it) => it.image_url)
      isNew.value = productDetail.selected_icons.search('New') > -1
      isBest.value = productDetail.selected_icons.search('Best') > -1
      status.value = productDetail.hidden ? '미노출' : '노출'

      youtube.value = productYoutube !== null
      if (productYoutube !== null) {
        youtubeThumbnailImageUrl.value = productYoutube.thumb_url
        youtubeTitle.value = productYoutube.title
        youtubeDesc.value = productYoutube.summary
        youtubeUrl.value = productYoutube.url
      }

      blog1.value = (productBlogs !== null && productBlogs[0]) ? true: false
      if (productBlogs !== null && productBlogs[0]) {
        blogThumbnailImageUrl1.value = productBlogs[0].thumb_url
        blogTitle1.value = productBlogs[0].title
        blogDesc1.value = productBlogs[0].summary
        blogUrl1.value = productBlogs[0].url
      }
      
      blog2.value = (productBlogs !== null && productBlogs[1]) ? true: false
      if (blog2.value) {
        blogThumbnailImageUrl2.value = productBlogs[1].thumb_url
        blogTitle2.value = productBlogs[1].title
        blogDesc2.value = productBlogs[1].summary
        blogUrl2.value = productBlogs[1].url
      }

      similarProducts.value = productDetail.similarProducts
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onDeleteImageUrl = (index) => {
    productImageUrls.value.splice(index, 1)
    productImageUrls.value = [...productImageUrls.value]
  }

  const onAddSimilarProduct = () => {
    showProductSelectPopup.value = true
  }

  const onDeleteSimilarProduct = async (product) => {
    similarProducts.value = [...similarProducts.value!].filter((it) => product.id !== it.id)
  }

  const onSimilarProductSelected = async (product) => {
    similarProducts.value = [...similarProducts.value!, product]
  }

  const onSave = async () => {
    if (category1.value === undefined) {
      alert({
        message: '대분류를 선택해 주세요.',
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
    if (method.value === '') {
      alert({
        message: '시공법을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (size_w.value === '') {
      alert({
        message: '규격(W)을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (size_l.value === '') {
      alert({
        message: '규격(L)을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (size_t.value === '') {
      alert({
        message: '규격(T)을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (desc.value === '') {
      alert({
        message: '제품설명을 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (color.value === undefined) {
      alert({
        message: '컬러를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (livingType.value === undefined) {
      alert({
        message: '주거형태를 선택해 주세요.',
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
    if (livingSpace.value === undefined) {
      alert({
        message: '주거공간을 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (tag.value.length === 0) {
      alert({
        message: '태그를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (detail.value === '') {
      alert({
        message: '상세정보를 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (productImageUrls.value.length === 0 && productImages.value.length === 0) {
      alert({
        message: '제품 이미지를 선택해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }

    if (youtube.value === true) {
      if (youtubeTitle.value === '') {
        alert({
          message: '유튜브 제목을 입력해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
      if (youtubeTitle.value.length > 255) {
        alert({
          message: '유튜브 제목은 최대 255자 이하입니다.',
          okText: '확인',
          cancelText: null,
        })
        return
      }

      if (youtubeDesc.value === '') {
        alert({
          message: '유튜브 요약 내용을 입력해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
      if (youtubeUrl.value === '') {
        alert({
          message: '유튜브 URL을 입력해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
    }

    if (blog1.value === true) {
      if (blogTitle1.value === '') {
        alert({
          message: '블로그 제목을 입력해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
      if (blogTitle1.value.length > 255) {
        alert({
          message: '블로그 제목은 최대 255자 이하입니다.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
      if (blogDesc1.value === '') {
        alert({
          message: '블로그 요약 내용을 입력해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
      if (blogUrl1.value === '') {
        alert({
          message: '블로그 URL을 입력해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
    }

    if (blog2.value === true) {
      if (blogTitle2.value === '') {
        alert({
          message: '2번 블로그 제목을 입력해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
      if (blogTitle2.value.length > 255) {
        alert({
          message: '2번 블로그 제목은 최대 255자 이하입니다.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
      if (blogDesc2.value === '') {
        alert({
          message: '2번 블로그 요약 내용을 입력해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
      if (blogUrl2.value === '') {
        alert({
          message: '2번 블로그 URL을 입력해 주세요.',
          okText: '확인',
          cancelText: null,
        })
        return
      }
    }

    var newThumbnailImageUrl = thumbnailImageUrl.value
    if (thumbnailImages.value.length > 0) {
      var result = await uploadFile(thumbnailImages.value[0], 'product', 'y')
      newThumbnailImageUrl = result.data[0].Location
    }

    var newProductImageUrls = productImageUrls.value.map((it) => ({ id: null, image_url: it }))
    if (productImages.value.length > 0) {
      result = await uploadFiles(productImages.value, 'product', 'y')
      newProductImageUrls = [...newProductImageUrls, ...result.data.map((it) => ({ id: null, image_url: it.Location }))]
    }

    var newYoutubeThumbnailImageUrl = youtubeThumbnailImageUrl.value
    if (youtube.value === true && youtubeThumbnailImages.value.length > 0) {
      var result = await uploadFile(youtubeThumbnailImages.value[0], 'product', 'y')
      newYoutubeThumbnailImageUrl = result.data[0].Location
    }

    var newBlogThumbnailImageUrl1 = blogThumbnailImageUrl1.value
    if (blog1.value === true && blogThumbnailImages1.value.length > 0) {
      var result = await uploadFile(blogThumbnailImages1.value[0], 'product', 'y')
      newBlogThumbnailImageUrl1 = result.data[0].Location
    }
    
    var newBlogThumbnailImageUrl2 = blogThumbnailImageUrl2.value
    if (blog2.value === true && blogThumbnailImages2.value.length > 0) {
      var result = await uploadFile(blogThumbnailImages2.value[0], 'product', 'y')
      newBlogThumbnailImageUrl2 = result.data[0].Location
    }

    try {
      var selectedBadges: String[] = []
      if (isBest.value) {
        selectedBadges = ['Best']
      }
      if (isNew.value) {
        selectedBadges = [...selectedBadges, 'New']
      }

      var postParam = {
        category_level1_id: category1.value.id,
        category_level2_id: category2.value?.id,
        category_level3_id: category3.value?.id,
        title: title.value,
        construction_law: method.value,
        size_w: size_w.value,
        size_l: size_l.value,
        size_t: size_t.value,
        desc: desc.value,
        view_point: Number(view_point.value),
        color_code: color.value.id,
        family_type_code: livingType.value.id,
        house_style_code: style.value.id,
        area_space_code: livingSpace.value.id,
        tags: tag.value.map((it) => ({ id: it.id })),
        thumbnail_url: newThumbnailImageUrl,
        detail_info: detail.value,
        productImages: newProductImageUrls,
        selected_icons: selectedBadges.join(','),
        hidden: status.value === '미노출',

        similarProductIds: similarProducts.value.map((it) => it.id),
      }

      if (youtube.value) {
        postParam['productYoutube'] = {
          thumb_url: newYoutubeThumbnailImageUrl,
          title: youtubeTitle.value,
          summary: youtubeDesc.value,
          url: youtubeUrl.value,
        }
      }

      if (blog1.value) {
        postParam['productBlogs'] = [{
          thumb_url: newBlogThumbnailImageUrl1,
          title: blogTitle1.value,
          summary: blogDesc1.value,
          url: blogUrl1.value,
        }]
      }

      if (blog2.value) {
        postParam['productBlogs'].push({
          thumb_url: newBlogThumbnailImageUrl2,
          title: blogTitle2.value,
          summary: blogDesc2.value,
          url: blogUrl2.value,
        })
      }
      await requestPut(`product/${route.params.id}`, postParam)
      toast('수정하였습니다.')

      router.replace({ name: 'product-detail', params: { id: route.params.id } })
    } catch (error) {
      console.log(error)
    }
  }

  const onCancel = (id) => {
    router.replace({ name: 'product-detail', params: { id: route.params.id } })
  }
</script>

<style lang="scss" scoped>
  .va-divider {
    --va-divider-line-width: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
