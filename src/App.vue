<template>
  <router-view />
  <loading
    v-if="GlobalStore.isLoading"
    v-model:active="GlobalStore.isLoading"
    :can-cancel="false"
    :is-full-page="true"
  />
</template>

<script setup lang="ts">
  import { useTheme } from './services/vuestic-ui/themes'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css'
  import { useGlobalStore } from './stores/global-store'
  import { onMounted } from 'vue'
  const GlobalStore = useGlobalStore()
  const { setTheme } = useTheme()
  setTheme('ORIGINAL')

  onMounted(() => {
    let accessToken = localStorage.getItem('accessToken')
    if (accessToken !== null) {
      GlobalStore.setAccessToken(accessToken)
    }
    let userProfile = localStorage.getItem('userProfile')
    if (userProfile !== null) {
      GlobalStore.setUserProfile(JSON.parse(userProfile))
    }
    let enabledRouteIds = localStorage.getItem('enabledRouteIds')
    if (enabledRouteIds !== null) {
      GlobalStore.setEnabledRouteIds(JSON.parse(enabledRouteIds))
    }
  })
</script>
<style lang="scss">
  @import 'scss/main.scss';

  body {
    margin: 0;
  }
</style>
