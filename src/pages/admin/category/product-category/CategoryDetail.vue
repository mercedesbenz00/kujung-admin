<template>
  <div class="layout fluid" style="padding: 20px; border-style: solid; border-width: 1px; border-color: #e5e5e5">
    <div class="search-form">
      <div class="row">
        <div class="search-form-label">고유코드</div>
        <div class="flex flex-col search-form-value">
          {{ category.id }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">분류명</div>
        <div class="flex flex-col search-form-value">
          {{ category.name }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">노출여부</div>
        <div class="flex flex-col search-form-value">
          {{ category.hidden ? '숨김' : '노출' }}
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">등록일시</div>
        <div class="flex flex-col search-form-value">{{ Common.getDateTime(category.created_at) }}</div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">대표 이미지</div>
        <div class="flex flex-col search-form-value">
          <va-image :src="Common.getThumbnailUrl(category.image_url)" style="width: 100px; height: auto" />
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">소개 이미지</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row">
          <va-image
            v-for="image_url in category.categoryImages"
            :src="image_url.image_url"
            style="width: 100px; height: auto; flex-grow: 0; margin-right: 10px"
          />
        </div>
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">제품 요약설명</div>
        <div class="flex flex-col search-form-value html-content-container" v-html="category.desc" />
      </div>
      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">태그</div>
        <div class="flex flex-col search-form-value">
          {{
            category.tags !== null
              ? category.tags
                  .split(',')
                  .map((it) => `#${it}`)
                  .join(',')
              : ''
          }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">유튜브</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row">
          <div
            v-for="youtubeUrl in category.categoryYoutubes"
            style="margin-right: 10px; margin-bottom: 10px; flex-grow: 0"
          >
            <iframe
              :src="`https://www.youtube.com/embed/${Common.getYoutubeIdFromURL(
                youtubeUrl.url,
              )}?autoplay=0&rel=0&loop=1`"
              style="width: 200px; height: 200px"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>
      </div>
    </div>

    <va-divider />

    <div class="row" style="display: flex; flex-direction: row; justify-content: space-between">
      <div>
        <va-button v-if="category.depth < 2" preset="secondary" border-color="primary" size="medium" @click="onCreate">
          {{ category.depth === 0 ? '중분류 생성' : '소분류 생성' }}
        </va-button>
        <va-button
          v-if="category.children === undefined || category.children.length === 0"
          preset="secondary"
          border-color="primary"
          size="medium"
          style="margin-left: 10px"
          @click="onDuplicate"
        >
          복제하기
        </va-button>
      </div>
      <div>
        <va-button preset="secondary" border-color="primary" size="medium" @click="onDelete">삭제</va-button>
        <va-button size="medium" style="margin-left: 10px" @click="onEdit">수정</va-button>
      </div>
    </div>
  </div>

  <category-select-popup
    v-if="showCategorySelectPopup"
    @closed="showCategorySelectPopup = false"
    @category-selected="onCategorySelected"
  />
</template>

<script setup lang="ts">
  import { requestDelete } from '../../../../util/api'
  import { ICategory } from './Category'
  import { useToast } from 'vuestic-ui'
  import Common from '../../../../util/common'
  import CategorySelectPopup from './CategorySelectPopup.vue'
  import { ref } from 'vue'
  const { init: toast } = useToast()

  const props = defineProps<{
    category: ICategory
  }>()

  const emit = defineEmits(['deleted', 'create', 'edit', 'duplicate'])

  const showCategorySelectPopup = ref<boolean>(false)

  const onCreate = () => {
    emit('create')
  }

  const onDuplicate = () => {
    showCategorySelectPopup.value = true
  }

  const onCategorySelected = (category1: ICategory | undefined, category2: ICategory | undefined) => {
    emit('duplicate', category1, category2)
  }

  const onDelete = async () => {
    try {
      const result = await requestDelete(`category/${props.category.id}`, {})
      console.log(result)
      toast('삭제하였습니다.')

      emit('deleted')
    } catch (error) {
      console.log(error)
    }
  }

  const onEdit = () => {
    emit('edit')
  }
</script>

<style lang="scss"></style>
