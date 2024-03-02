import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      isLoading: false,
      accessToken: '',
      userProfile: {},
      enabledRouteIds: [],
    }
  },

  actions: {
    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    setAccessToken(accessToken: string) {
      this.accessToken = accessToken
    },

    setUserProfile(userProfile: any) {
      this.userProfile = userProfile
    },

    setEnabledRouteIds(routeIds: number[]) {
      this.enabledRouteIds = routeIds
    },
  },
})
