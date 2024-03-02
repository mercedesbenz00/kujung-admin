<template>
  <page-header title="제품 상세" breadcrumbsDepth1="제품 관리" breadcrumbsDepth2="제품 상세" />
  <div class="layout fluid page-container">
    <h6 class="va-h6" style="margin-bottom: 15px">기본정보</h6>
    <div v-if="productDetail !== undefined" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">작성자</div>
        <div class="flex flex-col search-form-value-small">
          {{ productDetail.created_by }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">등록일시</div>
        <div class="flex flex-col search-form-value-small">
          {{ Common.getDateTime(productDetail.created_at) }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">최종 수정</div>
        <div class="flex flex-col search-form-value-small">
          {{ productDetail.updated_by }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">최종 수정일시</div>
        <div class="flex flex-col search-form-value-small">
          {{ Common.getDateTime(productDetail.updated_at) }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">조회수</div>
        <div class="flex flex-col search-form-value-small">
          {{ productDetail.view_count }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">위시리스트</div>
        <div class="flex flex-col search-form-value-small">
          {{ productDetail.wish_count }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">관리자 점수</div>
        <div class="flex flex-col search-form-value-small">
          {{ productDetail.view_point }}
        </div>
      </div>
    </div>

    <h6 class="va-h6" style="margin-bottom: 15px">상품 정보</h6>
    <div v-if="productDetail !== undefined" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">대분류</div>
        <div class="flex flex-col search-form-value-33">
          {{ productDetail.category_level1?.name }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">중분류</div>
        <div class="flex flex-col search-form-value-33">
          {{ productDetail.category_level2?.name }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">소분류</div>
        <div class="flex flex-col search-form-value-33">
          {{ productDetail.category_level3?.name }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">제목</div>
        <div class="flex flex-col search-form-value">
          {{ productDetail.title }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">시공법</div>
        <div class="flex flex-col search-form-value-small">
          {{ productDetail.construction_law }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">규격</div>
        <div class="flex flex-col search-form-value-small">
          {{ productDetail.size_w }}(w) x {{ productDetail.size_l }}(L) x {{ productDetail.size_t }}(T)mm
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">제품설명</div>
        <div class="flex flex-col search-form-value">
          {{ productDetail.desc }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">컬러</div>
        <div class="flex flex-col search-form-value-small">
          {{ productDetail.color_info?.name }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">주거형태</div>
        <div class="flex flex-col search-form-value-small">
          {{ productDetail.family_type_info?.name }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">스타일</div>
        <div class="flex flex-col search-form-value-small">
          {{ productDetail.house_style_info?.name }}
        </div>
        <div class="search-form-label" style="margin-left: -1px">주거공간</div>
        <div class="flex flex-col search-form-value-small">
          {{ productDetail.area_space_info?.name }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">태그</div>
        <div class="flex flex-col search-form-value">
          {{ productDetail.tags.map((it) => it.name).join(',') }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">썸네일 이미지</div>
        <div class="flex flex-col search-form-value">
          <va-image
            :src="productDetail.thumbnail_url"
            style="width: 100px; height: auto; flex-grow: 0; margin-right: 10px"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">상세정보</div>
        <div class="flex flex-col search-form-value html-content-container" v-html="productDetail.detail_info" />
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">제품 이미지</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row">
          <va-image
            v-for="imageUrl in productDetail.productImages"
            :src="imageUrl.image_url"
            style="width: 100px; height: auto; flex-grow: 0; margin-right: 10px"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">아이콘</div>
        <div class="flex flex-col search-form-value" style="flex-direction: row">
          <va-chip
            v-if="productDetail.selected_icons.search('New') > -1"
            color="warning"
            style="margin-left: 10px; margin-right: 20px; flex-grow: 0"
            >NEW</va-chip
          >
          <va-chip
            v-if="productDetail.selected_icons.search('Best') > -1"
            color="info"
            style="margin-left: 10px; flex-grow: 0"
            >BEST</va-chip
          >
        </div>
      </div>
    </div>

    <h6 class="va-h6" style="margin-bottom: 15px">
      유튜브 ({{ productDetail !== undefined && productYoutube !== null ? 'ON' : 'OFF' }})
    </h6>
    <div v-if="productYoutube !== null" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">유튜브 썸네일</div>
        <div class="flex flex-col search-form-value">
          <va-image
            :src="productYoutube.thumb_url"
            style="width: 100px; height: auto; flex-grow: 0; margin-right: 10px"
          />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">유튜브 제목</div>
        <div class="flex flex-col search-form-value">
          {{ productYoutube.title }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">유튜브 요약 내용</div>
        <div class="flex flex-col search-form-value">
          {{ productYoutube.summary }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">유튜브 URL</div>
        <div class="flex flex-col search-form-value">
          {{ productYoutube.url }}
        </div>
      </div>
    </div>

    <h6 class="va-h6" style="margin-bottom: 15px">
      블로그 ({{ productDetail !== undefined && productBlogs.length > 0 ? 'ON' : 'OFF' }})
    </h6>
    <div v-if="productBlogs !== null && productBlogs.length > 0" v-for="item in productBlogs" class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">블로그 썸네일</div>
        <div class="flex flex-col search-form-value">
          <va-image :src="item.thumb_url" style="width: 100px; height: auto; flex-grow: 0; margin-right: 10px" />
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">블로그 제목</div>
        <div class="flex flex-col search-form-value">
          {{ item.title }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">블로그 요약 내용</div>
        <div class="flex flex-col search-form-value">
          {{ item.summary }}
        </div>
      </div>

      <div class="row" style="margin-top: -1px">
        <div class="search-form-label">블로그 URL</div>
        <div class="flex flex-col search-form-value">
          {{ item.url }}
        </div>
      </div>
    </div>

    <h6 class="va-h6" style="margin-bottom: 15px">비슷한 디자인 제품보기</h6>
    <div v-if="similarProducts !== undefined" style="margin-top: 20px">
      <table class="va-table">
        <thead>
          <tr>
            <th>상품코드</th>
            <th>이미지</th>
            <th>상품정보</th>
            <th>태그</th>
            <th>노출여부</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in similarProducts" :key="element.id">
            <td>{{ element.id }}</td>
            <td>
              <va-image :src="element.thumbnail_url" style="width: 100px; height: auto" />
            </td>
            <td>
              {{ Common.getCategoryString(element.category_level1, element.category_level2, element.catgory_level3)
              }}<br />{{ element.title }}
            </td>
            <td>{{ element.tags.map((it) => it.name).join(',') }}</td>
            <td>{{ element.hidden ? '미노출' : '노출' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <va-divider />
    <div class="row" style="justify-content: space-between">
      <va-button @click="onGotoList">목록으로</va-button>
      <div>
        <va-button preset="secondary" border-color="primary" @click="onDelete">삭제</va-button>
        <va-button @click="onEdit" style="margin-left: 10px">수정</va-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import PageHeader from '../../../../components/PageHeader.vue'
  import { requestDelete, requestGet } from '../../../../util/api'
  import { useRoute, useRouter } from 'vue-router'
  import { useModal, useToast } from 'vuestic-ui'
  import Common from '../../../../util/common'

  const router = useRouter()
  const route = useRoute()

  const { init: alert } = useModal()
  const { init: toast } = useToast()

  const productDetail = ref(undefined)
  const productYoutube = ref(null)
  const productBlogs = ref(null)
  const similarProducts = ref<any[]>([])

  onMounted(async () => {
    try {
      var result = await requestGet(`product/${route.params.id}`, {})
      productDetail.value = result.data
      productYoutube.value = productDetail.value!.productYoutube
      productBlogs.value = productDetail.value!.productBlogs
      similarProducts.value = productDetail.value!.similarProducts
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onGotoList = () => {
    router.back()
  }

  const onDelete = () => {
    alert({
      message: '정말로 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          let result = await requestDelete(`product/${route.params.id}`, {})
          console.log(result)
          toast('삭제하였습니다.')
          router.back()
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  const onEdit = () => {
    router.replace({ name: 'product-edit', params: { id: route.params.id } })
  }
</script>

<style lang="scss"></style>
