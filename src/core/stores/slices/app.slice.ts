import type { StateCreator } from "zustand"

// Define the complete app state interface
export interface AppState {
  // Core app lifecycle
  isFirstLaunch: boolean
  isOnboarded: boolean
  showOnboarding: boolean
  showTutorial: boolean
  showIntro: boolean
  skipped: boolean
  takeTour: boolean
  tutorial: boolean

  // App configuration
  appVersion?: string
  deviceId?: string
  language: string
  themeMode?: "light" | "dark" | "system"

  // Authentication & Authorization
  accessToken?: string
  refreshToken?: string
  token?: string
  isAuthorized: boolean
  isAuthenticated: boolean
  isCompleteAuth: boolean

  // Wallet & Payment
  hasWallet: boolean
  wallet?: string

  // User preferences & content
  userType?: string
  newsHeight?: number
  relevency?: string
  storyCategory?: string
  translatedItem?: any

  // Timestamps
  lastSyncTime?: number
}

// Define all app actions
export interface AppActions {
  // Onboarding actions
  completeOnboarding: () => void
  setIsOnboarded: (isOnboarded: boolean) => void
  setIsFirstTimeLaunched: (isFirstLaunch: boolean) => void
  setShowOnboarding: (show: boolean) => void
  setShowTutorial: (show: boolean) => void
  setShowIntro: (show: boolean) => void
  setSkipped: (skipped: boolean) => void
  setTakeTour: (takeTour: boolean) => void
  setTutorial: (tutorial: boolean) => void

  // App configuration actions
  setAppVersion: (version: string) => void
  setDeviceId: (deviceId: string) => void
  setLanguage: (language: string) => void
  setThemeMode: (themeMode: "light" | "dark" | "system") => void

  // Authentication actions
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
  setToken: (token: string) => void
  setIsAuthorized: (isAuthorized: boolean) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setIsCompleteAuth: (isCompleteAuth: boolean) => void

  // Wallet actions
  setHasWallet: (hasWallet: boolean) => void
  setWallet: (wallet: string) => void

  // User preferences actions
  setUserType: (userType: string) => void
  setNewsHeight: (height: number) => void
  setRelevency: (relevency: string) => void
  setStoryCategory: (category: string) => void
  setTranslatedItem: (item: any) => void

  // Utility actions
  setLastSyncTime: (time: number) => void
  resetApp: () => void
  resetOnboarding: () => void
  resetAuth: () => void
}

// Combined app slice type
export interface AppSlice {
  app: AppState & AppActions
}

// Initial state
const initialAppState: AppState = {
  // Core app lifecycle
  isFirstLaunch: true,
  isOnboarded: false,
  showOnboarding: true,
  showTutorial: true,
  showIntro: true,
  skipped: false,
  takeTour: false,
  tutorial: false,

  // App configuration
  appVersion: undefined,
  deviceId: undefined,
  language: "en",
  themeMode: "system",

  // Authentication & Authorization
  accessToken: undefined,
  refreshToken: undefined,
  token: undefined,
  isAuthorized: false,
  isAuthenticated: false,
  isCompleteAuth: false,

  // Wallet & Payment
  hasWallet: false,
  wallet: undefined,

  // User preferences & content
  userType: undefined,
  newsHeight: undefined,
  relevency: undefined,
  storyCategory: undefined,
  translatedItem: undefined,

  // Timestamps
  lastSyncTime: undefined,
}

// Create the app slice
const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set, get) => ({
  app: {
    ...initialAppState,

    // Onboarding actions
    completeOnboarding: () => {
      console.log("completeOnboarding called")
      set((state) => ({
        app: {
          ...state.app,
          isFirstLaunch: false,
          isOnboarded: true,
          showOnboarding: false,
          showTutorial: false,
        },
      }))
    },

    setIsOnboarded: (isOnboarded: boolean) => {
      console.log("setIsOnboarded called with:", isOnboarded)
      set((state) => ({
        app: {
          ...state.app,
          isOnboarded,
        },
      }))
    },

    setIsFirstTimeLaunched: (isFirstLaunch: boolean) => {
      console.log("setIsFirstTimeLaunched called with:", isFirstLaunch)
      set((state) => ({
        app: {
          ...state.app,
          isFirstLaunch,
        },
      }))
    },

    setShowOnboarding: (showOnboarding: boolean) => {
      console.log("setShowOnboarding called with:", showOnboarding)
      set((state) => ({
        app: {
          ...state.app,
          showOnboarding,
        },
      }))
    },

    setShowTutorial: (showTutorial: boolean) => {
      console.log("setShowTutorial called with:", showTutorial)
      set((state) => ({
        app: {
          ...state.app,
          showTutorial,
        },
      }))
    },

    setShowIntro: (showIntro: boolean) => {
      set((state) => ({
        app: {
          ...state.app,
          showIntro,
        },
      }))
    },

    setSkipped: (skipped: boolean) => {
      set((state) => ({
        app: {
          ...state.app,
          skipped,
        },
      }))
    },

    setTakeTour: (takeTour: boolean) => {
      set((state) => ({
        app: {
          ...state.app,
          takeTour,
        },
      }))
    },

    setTutorial: (tutorial: boolean) => {
      set((state) => ({
        app: {
          ...state.app,
          tutorial,
        },
      }))
    },

    // App configuration actions
    setAppVersion: (appVersion: string) => {
      set((state) => ({
        app: {
          ...state.app,
          appVersion,
        },
      }))
    },

    setDeviceId: (deviceId: string) => {
      set((state) => ({
        app: {
          ...state.app,
          deviceId,
        },
      }))
    },

    setLanguage: (language: string) => {
      set((state) => ({
        app: {
          ...state.app,
          language,
        },
      }))
    },

    setThemeMode: (themeMode: "light" | "dark" | "system") => {
      set((state) => ({
        app: {
          ...state.app,
          themeMode,
        },
      }))
    },

    // Authentication actions
    setAccessToken: (accessToken: string) => {
      set((state) => ({
        app: {
          ...state.app,
          accessToken,
          lastSyncTime: Date.now(),
        },
      }))
    },

    setRefreshToken: (refreshToken: string) => {
      set((state) => ({
        app: {
          ...state.app,
          refreshToken,
        },
      }))
    },

    setToken: (token: string) => {
      set((state) => ({
        app: {
          ...state.app,
          token,
          lastSyncTime: Date.now(),
        },
      }))
    },

    setIsAuthorized: (isAuthorized: boolean) => {
      set((state) => ({
        app: {
          ...state.app,
          isAuthorized,
        },
      }))
    },

    setIsAuthenticated: (isAuthenticated: boolean) => {
      set((state) => ({
        app: {
          ...state.app,
          isAuthenticated,
        },
      }))
    },

    setIsCompleteAuth: (isCompleteAuth: boolean) => {
      set((state) => ({
        app: {
          ...state.app,
          isCompleteAuth,
        },
      }))
    },

    // Wallet actions
    setHasWallet: (hasWallet: boolean) => {
      set((state) => ({
        app: {
          ...state.app,
          hasWallet,
        },
      }))
    },

    setWallet: (wallet: string) => {
      set((state) => ({
        app: {
          ...state.app,
          wallet,
        },
      }))
    },

    // User preferences actions
    setUserType: (userType: string) => {
      set((state) => ({
        app: {
          ...state.app,
          userType,
        },
      }))
    },

    setNewsHeight: (newsHeight: number) => {
      set((state) => ({
        app: {
          ...state.app,
          newsHeight,
        },
      }))
    },

    setRelevency: (relevency: string) => {
      set((state) => ({
        app: {
          ...state.app,
          relevency,
        },
      }))
    },

    setStoryCategory: (storyCategory: string) => {
      set((state) => ({
        app: {
          ...state.app,
          storyCategory,
        },
      }))
    },

    setTranslatedItem: (translatedItem: any) => {
      set((state) => ({
        app: {
          ...state.app,
          translatedItem,
        },
      }))
    },

    // Utility actions
    setLastSyncTime: (lastSyncTime: number) => {
      set((state) => ({
        app: {
          ...state.app,
          lastSyncTime,
        },
      }))
    },

    resetApp: () => {
      set((state) => ({
        app: {
          ...initialAppState,
          // Preserve some settings
          language: state.app.language,
          themeMode: state.app.themeMode,
          deviceId: state.app.deviceId,
          appVersion: state.app.appVersion,
          isFirstLaunch: state.app.isFirstLaunch,
        },
      }))
    },

    resetOnboarding: () => {
      set((state) => ({
        app: {
          ...state.app,
          isFirstLaunch: true,
          isOnboarded: false,
          showOnboarding: true,
          showTutorial: true,
          showIntro: true,
          skipped: false,
          takeTour: false,
          tutorial: false,
        },
      }))
    },

    resetAuth: () => {
      set((state) => ({
        app: {
          ...state.app,
          accessToken: undefined,
          refreshToken: undefined,
          token: undefined,
          isAuthorized: false,
          isAuthenticated: false,
          isCompleteAuth: false,
          hasWallet: false,
          wallet: undefined,
        },
      }))
    },
  },
})

// Export the slice for use in store
export default createAppSlice
