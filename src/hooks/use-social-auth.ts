import useAppStore from '@/core/stores';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import auth, {FirebaseAuthTypes, getAuth} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useCallback, useEffect, useState, useRef} from 'react';
import {Platform} from 'react-native';
import firestore from '@react-native-firebase/firestore'

// ==================== TYPES ====================
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  providerId: string;
  providerData: FirebaseAuthTypes.UserInfo[];
  createdAt: string;
  lastSignInTime: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  isNewUser?: boolean;
  provider?: 'google' | 'apple';
  accessToken?: string;
}

export interface SocialAuthConfig {
  googleWebClientId?: string;
  googleOfflineAccess?: boolean;
  googleHostedDomain?: string;
  googleForceCodeForRefreshToken?: boolean;
  appleRequestedScopes?: ('email' | 'fullName')[];
  onAuthStateChanged?: (user: AuthUser | null, accessToken?: string, isNewUser?: boolean) => void;
  onSuccess?: (result: AuthResult) => void;
  onError?: (error: string, provider?: 'google' | 'apple') => void;
  onSignOut?: () => void;
  enableDebugLogs?: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  provider?: 'google' | 'apple' | 'firebase' | undefined;
  originalError?: any;
}

// ==================== ERROR HANDLING ====================
class AuthErrorHandler {
  private static getErrorMessage(error: any, provider?: string): string {
    if (typeof error === 'string') return error;

    const errorMessage =
      error?.message || error?.toString() || 'Unknown error occurred';

    if (error?.code) {
      switch (error.code) {
        case 'auth/network-request-failed':
          return 'Network error. Please check your internet connection.';
        case 'auth/too-many-requests':
          return 'Too many failed attempts. Please try again later.';
        case 'auth/user-disabled':
          return 'This account has been disabled.';
        case 'auth/account-exists-with-different-credential':
          return 'An account already exists with this email using a different sign-in method.';
        case 'auth/credential-already-in-use':
          return 'This credential is already associated with a different account.';
        case 'auth/operation-not-allowed':
          return 'This sign-in method is not enabled.';
        case 'auth/invalid-credential':
          return 'The credential is invalid or has expired.';
        default:
          return errorMessage;
      }
    }

    if (provider === 'google') {
      if (errorMessage.includes('SIGN_IN_CANCELLED')) {
        return 'Google sign-in was cancelled.';
      }
      if (errorMessage.includes('IN_PROGRESS')) {
        return 'Google sign-in is already in progress.';
      }
      if (errorMessage.includes('PLAY_SERVICES_NOT_AVAILABLE')) {
        return 'Google Play Services is not available on this device.';
      }
    }

    if (provider === 'apple') {
      if (errorMessage.includes('1001')) {
        return 'Apple sign-in was cancelled.';
      }
      if (errorMessage.includes('1000')) {
        return 'Apple sign-in failed. Please try again.';
      }
    }

    return errorMessage;
  }

  static createError(
    error: any,
    provider?: 'google' | 'apple' | 'firebase',
  ): AuthError {
    return {
      code: error?.code || 'unknown',
      message: this.getErrorMessage(error, provider),
      provider,
      originalError: error,
    };
  }
}

// ==================== UTILITIES ====================
const mapFirebaseUser = (firebaseUser: FirebaseAuthTypes.User): AuthUser => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  phoneNumber: firebaseUser.phoneNumber,
  emailVerified: firebaseUser.emailVerified,
  providerId: firebaseUser.providerData[0]?.providerId || 'firebase',
  providerData: firebaseUser.providerData,
  createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
  lastSignInTime:
    firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
});

const mapToStoreUser = (user: AuthUser) => ({
  displayName: user.displayName,
  email: user.email,
  emailVerified: user.emailVerified,
  phoneNumber: user.phoneNumber,
  photoURL: user.photoURL,
  providerId: user.providerId,
  uid: user.uid,
});

// Helper function to compare user objects
const isUserEqual = (user1: any, user2: any): boolean => {
  if (!user1 && !user2) return true;
  if (!user1 || !user2) return false;

  return (
    user1.uid === user2.uid &&
    user1.email === user2.email &&
    user1.displayName === user2.displayName &&
    user1.photoURL === user2.photoURL &&
    user1.phoneNumber === user2.phoneNumber &&
    user1.emailVerified === user2.emailVerified &&
    user1.providerId === user2.providerId
  );
};

// ==================== MAIN HOOK ====================
export const useSocialAuth = (config: SocialAuthConfig = {}) => {
  // 🔥 CRITICAL: Get store setters
  const {setUser, setAccessToken, clearUser, setIsLogin, setIsNewUser} = useAppStore(
    state => state.user,
  );

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isInitializing: true,
    error: null,
    isAuthenticated: false,
  });

  // Refs to track previous values and prevent unnecessary updates
  const lastUserRef = useRef<any>(null);
  const lastAccessTokenRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  // Get auth instance using the new modular API
  const authInstance = getAuth();

  const {
    googleWebClientId,
    googleOfflineAccess = true,
    googleHostedDomain,
    googleForceCodeForRefreshToken = true,
    appleRequestedScopes = ['email', 'fullName'],
    onAuthStateChanged,
    onSuccess,
    onError,
    onSignOut,
  } = config;

  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({...prev, ...updates}));
  }, []);

  const handleError = useCallback(
    (error: any, provider?: 'google' | 'apple') => {
      const authError = AuthErrorHandler.createError(error, provider);

      updateAuthState({
        error: authError.message,
        isLoading: false,
      });

      onError?.(authError.message, provider);
      return authError;
    },
    [updateAuthState, onError],
  );

  const clearError = useCallback(() => {
    updateAuthState({error: null});
  }, [updateAuthState]);

  const handleAuthSuccess = useCallback(
    async (
      userCredential: FirebaseAuthTypes.UserCredential,
      provider: 'google' | 'apple',
    ): Promise<AuthResult> => {
      try {
        const user = mapFirebaseUser(userCredential.user);

        const userDoc = await firestore().collection('users').doc(userCredential.user.uid).get();

        if(!userDoc.exists()){
          await firestore().collection('users').doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            isSyncEnabled: false,
            paymentStatus: false,
            isNewUser: true,
          });
        };

        const isNewUser = (userDoc.exists() && userDoc.data()?.isNewUser) ?? true;

        const accessToken = await userCredential.user.getIdToken();
        const storeUserData = mapToStoreUser(user);

        // Only update if data has changed
        if (!isUserEqual(lastUserRef.current, storeUserData)) {
          setUser(storeUserData);
          lastUserRef.current = storeUserData;
        }

        if (lastAccessTokenRef.current !== accessToken) {
          setAccessToken(accessToken);
          lastAccessTokenRef.current = accessToken;
        }

        setIsNewUser(isNewUser);

        setIsLogin(true);

        updateAuthState({
          user,
          error: null,
          isAuthenticated: true,
          isLoading: false,
        });

        const result: AuthResult = {
          success: true,
          user,
          isNewUser,
          provider,
          accessToken,
        };

        onSuccess?.(result);
        setIsLogin(true);
        return result;
      } catch (error) {
        const authError = handleError(error, provider);
        return {success: false, error: authError.message, provider};
      }
    },
    [
      updateAuthState,
      onSuccess,
      handleError,
      setUser,
      setIsNewUser,
      setAccessToken,
      setIsLogin,
    ],
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    if (!googleWebClientId) {
      const error = 'Google Web Client ID is required for Google Sign-In';
      handleError(new Error(error), 'google');
      return {success: false, error, provider: 'google'};
    }

    updateAuthState({isLoading: true, error: null});

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data?.idToken) {
        throw new Error('Failed to get Google ID token');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.data.idToken,
      );

      const userCredential = await authInstance.signInWithCredential(
        googleCredential,
      );

      return await handleAuthSuccess(userCredential, 'google');
    } catch (error) {
      handleError(error, 'google');
      return {
        success: false,
        error: AuthErrorHandler.createError(error, 'google').message,
        provider: 'google',
      };
    }
  }, [
    googleWebClientId,
    updateAuthState,
    handleAuthSuccess,
    handleError,
    authInstance,
  ]);

  const signInWithApple = useCallback(async (): Promise<AuthResult> => {
    if (Platform.OS !== 'ios') {
      const error = 'Apple Sign-In is only available on iOS';
      handleError(new Error(error), 'apple');
      return {success: false, error, provider: 'apple'};
    }

    updateAuthState({isLoading: true, error: null});

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: appleRequestedScopes.map(scope =>
          scope === 'email' ? appleAuth.Scope.EMAIL : appleAuth.Scope.FULL_NAME,
        ),
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token received');
      }

      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      const userCredential = await authInstance.signInWithCredential(
        appleCredential,
      );

      const userDoc = await firestore().collection('users').doc(userCredential.user.uid).get();

      if(!userDoc.exists()){
        await firestore().collection('users').doc(userCredential.user.uid).set({
          uid: userCredential.user.uid,
          isSyncEnabled: false,
          paymentStatus: false,
          isNewUser: true,
        });
      };

      if (
        userCredential.additionalUserInfo?.isNewUser &&
        appleAuthRequestResponse.fullName
      ) {
        const {givenName, familyName} = appleAuthRequestResponse.fullName;
        const displayName = [givenName, familyName].filter(Boolean).join(' ');

        if (displayName) {
          await userCredential.user.updateProfile({displayName});
        }
      }

      return await handleAuthSuccess(userCredential, 'apple');
    } catch (error) {
      handleError(error, 'apple');
      return {
        success: false,
        error: AuthErrorHandler.createError(error, 'apple').message,
        provider: 'apple',
      };
    }
  }, [
    updateAuthState,
    handleAuthSuccess,
    handleError,
    appleRequestedScopes,
    authInstance,
  ]);

  const signOut = useCallback(async (): Promise<AuthResult> => {
    updateAuthState({isLoading: true, error: null});

    try {
      await authInstance.signOut();

      try {
        const isGoogleSignedIn = await GoogleSignin.isSignedIn();
        if (isGoogleSignedIn) {
          await GoogleSignin.signOut();
        }
      } catch (googleError) {
        // Silently handle Google sign-out errors
      }

      // Clear refs
      lastUserRef.current = null;
      lastAccessTokenRef.current = null;

      clearUser?.();

      if (!clearUser) {
        setUser(undefined);
        setAccessToken('');
      }

      updateAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      onSignOut?.();

      return {success: true};
    } catch (error) {
      handleError(error);
      return {
        success: false,
        error: AuthErrorHandler.createError(error).message,
      };
    }
  }, [
    updateAuthState,
    onSignOut,
    handleError,
    clearUser,
    setUser,
    setIsNewUser,
    setAccessToken,
    authInstance,
  ]);

  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged(async firebaseUser => {
      try {
        if (firebaseUser) {
          const user = mapFirebaseUser(firebaseUser);
          const accessToken = await firebaseUser.getIdToken();
          const storeUserData = mapToStoreUser(user);

          const userDoc = await firestore().collection('users').doc(storeUserData.uid).get();

          if(!userDoc.exists()){
            await firestore().collection('users').doc(storeUserData.uid).set({
              uid: storeUserData.uid,
              isSyncEnabled: false,
              paymentStatus: false,
              isNewUser: true,
            });
          };

          const isNewUser = (userDoc.exists() && userDoc.data()?.isNewUser) ?? true;

          // Only update if this is the first time or if data has actually changed
          const shouldUpdateUser =
            !isInitializedRef.current ||
            !isUserEqual(lastUserRef.current, storeUserData);
          const shouldUpdateToken =
            !isInitializedRef.current ||
            lastAccessTokenRef.current !== accessToken;
            
          if (shouldUpdateUser && user.emailVerified) {
            setUser(storeUserData);
            setIsNewUser(isNewUser);
            lastUserRef.current = storeUserData;
          }

          if (shouldUpdateToken && user.emailVerified) {
            setAccessToken(accessToken);
            lastAccessTokenRef.current = accessToken;
          }

          // Only call setIsLogin if not already initialized to prevent loops
          if (!isInitializedRef.current && user.emailVerified) {
            setIsLogin(true);
          }

          updateAuthState({
            user,
            isAuthenticated: true,
            isInitializing: false,
            error: null,
          });

          // Only call onAuthStateChanged if data has changed or it's the first time
          if (
            shouldUpdateUser ||
            shouldUpdateToken ||
            !isInitializedRef.current
          ) {
            onAuthStateChanged?.(user, accessToken, isNewUser);
          }
        } else {
          // Only update if we're transitioning from authenticated to unauthenticated
          if (lastUserRef.current !== null) {
            lastUserRef.current = null;
            lastAccessTokenRef.current = null;

            updateAuthState({
              user: null,
              isAuthenticated: false,
              isInitializing: false,
              error: null,
            });

            onAuthStateChanged?.(null);
          } else if (!isInitializedRef.current) {
            // First time and no user
            updateAuthState({
              user: null,
              isAuthenticated: false,
              isInitializing: false,
              error: null,
            });
          }
        }

        // Mark as initialized after first run
        isInitializedRef.current = true;
      } catch (error) {
        updateAuthState({
          user: null,
          isAuthenticated: false,
          isInitializing: false,
          error: 'Failed to get user token',
        });
        isInitializedRef.current = true;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    updateAuthState,
    onAuthStateChanged,
    setUser,
    setAccessToken,
    setIsLogin,
    authInstance,
    setIsNewUser
  ]);

  useEffect(() => {
    if (googleOfflineAccess && !googleWebClientId) {
      return;
    }
    GoogleSignin.configure({
      webClientId: googleWebClientId,
      offlineAccess: googleOfflineAccess,
      hostedDomain: googleHostedDomain,
      forceCodeForRefreshToken: googleForceCodeForRefreshToken,
      scopes: ['profile', 'email'],
      iosClientId:
        '904995166325-grnducufh7dlvqh6fe0aras0268khbr2.apps.googleusercontent.com',
    });
  }, [
    googleWebClientId,
    googleOfflineAccess,
    googleHostedDomain,
    googleForceCodeForRefreshToken,
  ]);

  const getCurrentUser = useCallback(async () => {
    return authInstance.currentUser;
  }, [authInstance]);

  const getIdToken = useCallback(
    async (forceRefresh = false) => {
      const currentUser = authInstance.currentUser;
      if (!currentUser) return null;

      try {
        const token = await currentUser.getIdToken(forceRefresh);

        if (token && lastAccessTokenRef.current !== token) {
          setAccessToken(token);
          lastAccessTokenRef.current = token;
        }

        return token;
      } catch (error) {
        return null;
      }
    },
    [setAccessToken, authInstance],
  );

  const refreshUser = useCallback(async () => {
    const currentUser = authInstance.currentUser;
    if (!currentUser) return;

    try {
      await currentUser.reload();
      const user = mapFirebaseUser(currentUser);
      const accessToken = await currentUser.getIdToken(true);
      const storeUserData = mapToStoreUser(user);

      const userDoc = await firestore().collection('users').doc(storeUserData.uid).get();

      if(!userDoc.exists()){
        await firestore().collection('users').doc(storeUserData.uid).set({
          uid: storeUserData.uid,
          isSyncEnabled: false,
          paymentStatus: false,
          isNewUser: true,
        });
      };

      const isNewUser = (userDoc.exists() && userDoc.data()?.isNewUser) ?? true;

      // Only update if data has changed
      if (!isUserEqual(lastUserRef.current, storeUserData)) {
        setUser(storeUserData);
        setIsNewUser(isNewUser);
        lastUserRef.current = storeUserData;
      }

      if (lastAccessTokenRef.current !== accessToken) {
        setAccessToken(accessToken);
        lastAccessTokenRef.current = accessToken;
      }

      updateAuthState({user});
    } catch (error) {
      // Silently handle refresh errors
    }
  }, [updateAuthState, setUser, setAccessToken, authInstance, setIsNewUser]);

  return {
    ...authState,
    signInWithGoogle,
    signInWithApple,
    signOut,
    clearError,
    getCurrentUser,
    getIdToken,
    refreshUser,
    isAppleSignInAvailable: Platform.OS === 'ios',
    isGoogleSignInConfigured: !!googleWebClientId,
  };
};
