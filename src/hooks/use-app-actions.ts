

import { useAppStore } from '@/core/stores';


export const useAppActions = () => {
  const {
    completeOnboarding,
    setIsOnboarded,
    setIsFirstTimeLaunched,
    setLanguage,
    setShowTutorial,
    setAppVersion,
    setDeviceId,
    setHasWallet,
    setIsAuthenticated,
    setIsCompleteAuth,
    setShowIntro,
    setSkipped,
    setTakeTour,
    setThemeMode,
    setUserType,
    setWallet,
  } = useAppStore().app

  return {
    completeOnboarding,
    setIsOnboarded,
    setIsFirstTimeLaunched,
    setLanguage,
    setShowTutorial,
    setAppVersion,
    setDeviceId,
    setHasWallet,
    setIsAuthenticated,
    setIsCompleteAuth,
    setShowIntro,
    setSkipped,
    setTakeTour,
    setThemeMode,
    setUserType,
    setWallet,
  }
}

// Custom hook for app state
export const useAppState = () => {
  const {
    isFirstLaunch,
    isOnboarded,
    language,
    showTutorial,
    appVersion,
    deviceId,
    hasWallet,
    isAuthenticated,
    isCompleteAuth,
    showIntro,
    skipped,
    takeTour,
    themeMode,
    userType,
    wallet,
  } = useAppStore().app

  return {
    isFirstLaunch,
    isOnboarded,
    language,
    showTutorial,
    appVersion,
    deviceId,
    hasWallet,
    isAuthenticated,
    isCompleteAuth,
    showIntro,
    skipped,
    takeTour,
    themeMode,
    userType,
    wallet,
    // Computed values
    needsOnboarding: isFirstLaunch || !isOnboarded,
    isSetupComplete: isOnboarded && isCompleteAuth,
  }
}
