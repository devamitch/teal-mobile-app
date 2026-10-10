"use client"

import { useAppStore } from "@/core/stores"


// Custom hook for auth actions with better TypeScript support
export const useAuthActions = () => {
  const { login, logout, clearAuth,  setUserData, setPaymentStatus, setError, setIsLoading } = useAppStore().user

  return {
    login,
    logout,
    clearAuth,
    setUserData,
    setPaymentStatus,
    setError,
    setIsLoading,
  }
}

// Custom hook for auth state
export const useAuthState = () => {
  const {  userData, isLogin, paymentStatus, error, isLoading } = useAppStore().user

  return {
    userData,
    isLogin,
    paymentStatus,
    error,
    isLoading,
    // Computed values
    isAuthenticated: isLogin && !!userData,
    userDisplayName: userData?.displayName || userData?.email || "User",
    hasVerifiedEmail: userData?.emailVerified || false,
  }
}
