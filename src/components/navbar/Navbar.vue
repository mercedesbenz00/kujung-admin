<template>
  <va-navbar class="app-layout-navbar" color="#61605A">
    <template #left>
      <va-image src="/logo.png" style="width: 30px; height: 30px; margin-right: 20px" />
      <va-navbar-item class="logo"> 구정마루 관리자페이지 </va-navbar-item>
    </template>
    <template #right>
      <app-navbar-actions class="app-navbar__actions md5 lg4" :user-name="userProfile.name" />
    </template>
  </va-navbar>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { useGlobalStore } from '../../stores/global-store'
  import AppNavbarActions from './components/AppNavbarActions.vue'

  const GlobalStore = useGlobalStore()

  const { userProfile } = storeToRefs(GlobalStore)
</script>

<style lang="scss" scoped>
  .va-navbar {
    box-shadow: var(--va-box-shadow);
    z-index: 2;

    @media screen and (max-width: 950px) {
      .left {
        width: 100%;
      }

      .app-navbar__actions {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .left {
    display: flex;
    align-items: center;

    & > * {
      margin-right: 1.5rem;
    }

    & > *:last-child {
      margin-right: 0;
    }
  }

  .logo {
    font-weight: 700;
    font-size: 1rem;
    color: white;
  }
</style>
