<template>
  <form @submit.prevent="onsubmit">
    <va-input
      v-model="email"
      class="mb-3"
      placeholder="아이디를 입력해 주세요"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
    />

    <va-input
      v-model="password"
      class="mb-3"
      type="password"
      placeholder="비밀번호를 입력해 주세요"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />

    <div class="auth-layout__options d-flex align-center justify-space-between">
      <va-checkbox v-model="keepLoggedIn" class="mb-0" label="자동 로그인" />
    </div>

    <div class="d-flex justify-center mt-3">
      <va-button class="my-0" @click="onsubmit">로그인</va-button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGlobalStore } from '../../../stores/global-store'
  import { requestGet, requestPost } from '../../../util/api'
  const GlobalStore = useGlobalStore()

  const email = ref('admin')
  const password = ref('11111111')
  const keepLoggedIn = ref(false)
  const emailErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const router = useRouter()

  const formReady = computed(() => !emailErrors.value.length && !passwordErrors.value.length)

  async function onsubmit() {
    if (!formReady.value) return

    emailErrors.value = email.value ? [] : ['아이디를 입력해 주세요']
    passwordErrors.value = password.value ? [] : ['비밀번호를 입력해 주세요']

    try {
      let result = await requestPost('auth/admin/login', {
        user_id: email.value,
        password: password.value,
      })

      GlobalStore.setAccessToken(result.data.access_token)
      localStorage.setItem('accessToken', result.data.access_token)
    } catch (error) {
      alert('계정정보가 정확하지 않습니다.')
      console.log(error)
      return
    }

    try {
      let result = await requestGet('auth/admin/profile', {})
      console.log(result)

      GlobalStore.setUserProfile(result.data.payload.user)
      localStorage.setItem('userProfile', JSON.stringify(result.data.payload.user))
    } catch (error) {
      console.log(error)
      return
    }

    try {
      var result = (await requestGet(`admin/${GlobalStore.userProfile.id}`, {})).data
      console.log(result)

      GlobalStore.setEnabledRouteIds(result.permissions.map((it) => it.id))
      localStorage.setItem('enabledRouteIds', JSON.stringify(GlobalStore.enabledRouteIds))
      router.push({ name: 'dashboard' })
    } catch (error) {
      console.log(error)
    }
  }
</script>
