<template>
  <page-header title="관리자 수정" breadcrumbsDepth1="관리자 관리" breadcrumbsDepth2="관리자 수정" />
  <div class="layout fluid page-container va-gutter-5">
    <div class="row">
      <div class="flex xs6">
        <div class="label">아이디*</div>
        <div style="display: flex; flex-direction: row; align-items: center">
          <va-input v-model="user_id" />
          <va-button size="medium" @click="onUserIdDuplicationCheck">중복확인</va-button>
        </div>
      </div>

      <div class="flex xs6">
        <div class="label">사용*</div>
        <va-radio v-for="(option, index) in useOptions" :key="index" v-model="use" :option="option" />
      </div>
    </div>

    <div class="row">
      <div class="flex xs6">
        <div class="label">
          비밀번호<span class="va-text-secondary" style="margin-left: 10px; font-size: 0.6rem"
            >(현재 비밀번호는 알수 없습니다. 변경시에만 입력해주세요.)</span
          >
        </div>
        <div style="display: flex; flex-direction: row; align-items: center">
          <va-input v-model="password" type="password" />
        </div>
      </div>

      <div class="flex xs6">
        <div class="label">
          비밀번호 확인<span class="va-text-secondary" style="margin-left: 10px; font-size: 0.6rem"
            >(변경시에만 입력해주세요.)</span
          >
        </div>
        <va-input v-model="passwordConfirm" type="password" />
      </div>
    </div>

    <div class="row">
      <div class="flex xs6">
        <div class="label">이름*</div>
        <div style="display: flex; flex-direction: row; align-items: center">
          <va-input v-model="name" />
        </div>
      </div>

      <div class="flex xs6">
        <div class="label">성별*</div>
        <va-radio v-for="(option, index) in genderOptions" :key="index" v-model="gender" :option="option" />
      </div>
    </div>

    <div class="row">
      <div class="flex xs6">
        <div class="label">휴대폰번호*</div>
        <div style="display: flex; flex-direction: row; align-items: center">
          <va-input v-model="phoneNumber" />
        </div>
      </div>

      <div class="flex xs6">
        <div class="label">이메일*</div>
        <div style="display: flex; flex-direction: row; align-items: center">
          <va-input v-model="email" />
        </div>
      </div>
    </div>

    <div class="label">메뉴 접근 권한 설정</div>
    <div class="va-text-secondary" style="font-size: 0.8rem">
      * [세부 메뉴 권한 설정]의 항목 체크시 해당 메뉴의 기능을 사용할 수 있습니다.
    </div>
    <div class="search-form" style="margin-top: 20px">
      <div class="row">
        <div class="search-form-label">세부 메뉴 권한 설정</div>
        <div class="search-form-value">
          <div v-for="route in NavigationRoutes.routes">
            <div style="margin-bottom: 10px">
              <b>{{ route.displayName }}</b>
              <va-button
                preset="secondary"
                border-color="primary"
                size="small"
                @click="onSelectAll(route)"
                style="margin-left: 10px; margin-right: 10px"
                >전체 선택</va-button
              >
              <va-button preset="secondary" border-color="primary" size="small" @click="onDeselectAll(route)"
                >전체 선택 해제</va-button
              >
            </div>
            <va-checkbox
              v-if="route.children !== undefined"
              v-for="it in route.children"
              v-model="checkedRouteIds"
              :label="it.displayName"
              style="margin-right: 20px; margin-bottom: 10px"
              :array-value="it.id"
            />
            <va-checkbox
              v-if="route.children === undefined"
              v-model="checkedRouteIds"
              :label="route.displayName"
              style="margin-right: 20px; margin-bottom: 10px"
              :array-value="route.id"
            />
          </div>
        </div>
      </div>
    </div>
    <va-divider />

    <div class="row" style="justify-content: end">
      <va-button preset="secondary" border-color="primary" size="medium" :to="{ name: 'manager-list' }">취소</va-button>
      <va-button style="margin-left: 10px" @click="onSave">수정완료</va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import PageHeader from '../../../components/PageHeader.vue'

  import { useModal, useToast } from 'vuestic-ui'
  import { requestGet, requestPost, requestPut } from '../../../util/api'
  import { useRoute, useRouter } from 'vue-router'
  import NavigationRoutes, {
    INavigationRoute,
    getChildrenRouteIds,
    isChildRoute,
  } from '../../../components/sidebar/NavigationRoutes'

  const { init: alert } = useModal()
  const { init: toast } = useToast()
  const router = useRouter()
  const route = useRoute()

  const user_id = ref<string>('')
  let idDuplicationChecked = false
  const useOptions = ['사용', '사용중지']
  const use = ref<string>('사용')
  const password = ref<string>('')
  const passwordConfirm = ref<string>('')
  var originalName = ''
  const name = ref<string>('')
  const genderOptions = ['남자', '여자']
  const gender = ref<string>('남자')
  const phoneNumber = ref<string>('')
  const email = ref<string>('')

  const checkedRouteIds = ref<number[]>([])

  onMounted(async () => {
    try {
      var result = (await requestGet(`admin/${route.params.id}`, {})).data
      user_id.value = result.user_id
      use.value = result.disabled ? '사용중지' : '사용'
      password.value = result.password
      passwordConfirm.value = result.password
      name.value = result.name
      originalName = result.name
      gender.value = result.gender === 'M' ? '남자' : '여자'
      phoneNumber.value = result.phone
      email.value = result.email
      checkedRouteIds.value = result.permissions.map((it) => it.id)

      console.log(result)
    } catch (error) {
      console.log(error)
    }

    console.log(NavigationRoutes.routes)
  })

  const onUserIdDuplicationCheck = async () => {
    if (user_id.value === '') {
      toast('아이디를 입력하세요.')
      return
    }

    try {
      const result = await requestPost('admin/check-duplication', {
        user_id: user_id.value,
      })
      console.log(result)

      toast('사용할 수 있는 아이디 입니다.')
      idDuplicationChecked = true
    } catch (error) {
      console.log(error)
      toast('중복된 아이디 입니다. 다른 아이디를 입력해 주세요.')
    }
  }

  const onSelectAll = (route: INavigationRoute) => {
    if (route.children === undefined) {
      checkedRouteIds.value = [...checkedRouteIds.value, route.id]
    } else {
      checkedRouteIds.value = [...checkedRouteIds.value, ...getChildrenRouteIds(route)]
    }
  }

  const onDeselectAll = (route: INavigationRoute) => {
    if (route.children === undefined) {
      checkedRouteIds.value = checkedRouteIds.value.filter((it) => it !== route.id)
    } else {
      checkedRouteIds.value = checkedRouteIds.value.filter((it) => !isChildRoute(route, it))
    }
  }

  const onSave = async () => {
    if (user_id.value === '') {
      alert({
        message: '아이디를 입력해 주세요.',
        okText: '확인',
        cancelText: null,
      })
      return
    }
    if (originalName !== name.value && idDuplicationChecked === false) {
      toast('아이디 중복 확인을 해 주세요')
      return
    }
    if (password.value === '') {
      toast('비밀번호를 입력하세요.')
      return
    }
    if (passwordConfirm.value === '') {
      toast('비밀번호 확인을 입력하세요.')
      return
    }
    if (password.value !== passwordConfirm.value) {
      toast('비밀번호가 일치하지 않습니다.')
      return
    }
    if (name.value === '') {
      toast('이름을 입력하세요.')
      return
    }
    if (phoneNumber.value === '') {
      toast('휴대폰번호를 입력하세요.')
      return
    }
    if (email.value === '') {
      toast('이메일 주소를 입력하세요.')
      return
    }

    let checkedRouteIdsArray: number[] = JSON.parse(JSON.stringify(checkedRouteIds.value))

    try {
      await requestPut(`admin/${route.params.id}`, {
        user_id: user_id.value,
        disabled: false,
        password: password.value,
        name: name.value,
        nickname: name.value,
        gender: gender.value === '남자' ? 'M' : 'F',
        phone: phoneNumber.value,
        email: email.value,
        permissions: checkedRouteIdsArray.map((it) => ({ id: it })),
      })
      toast('수정하였습니다.')

      router.replace({ name: 'manager-list' })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss" scoped>
  .label {
    margin-top: 1rem;
    margin-bottom: 5px;
  }

  .search-form-label {
    width: 200px;
  }

  .search-form-value {
    width: calc(100% - 200px);
  }
</style>
