import useAppStore from '@/core/stores';
import {emailLogin, emailSignUp} from '@/services/auth/authentication';
import {Toast} from '@/utils/toast';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useCallback, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  user: FirebaseAuthTypes.User | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: FirebaseAuthTypes.User;
  error?: string;
  isNewUser?: boolean;
  provider?: 'email' | 'google' | 'apple';
}

export const useAuth = () => {
  const {setUser, setAccessToken, setIsNewUser} = useAppStore(
    state => state.user,
  );
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    user: null,
  });

  const updateUserState = useCallback(
    async (
      userCred: FirebaseAuthTypes.UserCredential,
      isNewUser: boolean = false,
    ): Promise<AuthResult> => {
      try {
        const data = {
          displayName: userCred.user.displayName,
          email: userCred.user.email,
          emailVerified: userCred.user.emailVerified,
          phoneNumber: userCred.user.phoneNumber,
          photoURL: userCred.user.photoURL,
          providerId: userCred.user.providerData[0]?.providerId,
          uid: userCred.user.uid,
        };

        const access_token = await userCred.user.getIdToken();

        console.log('---setUser from useAuth in function updateUserState---');

        setAccessToken(access_token);
        setUser(data);
        setIsNewUser(isNewUser);

        setAuthState(prev => ({
          ...prev,
          user: userCred.user,
          error: null,
        }));

        return {
          success: true,
          user: userCred.user,
          isNewUser,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update user state';
        setAuthState(prev => ({...prev, error: errorMessage}));
        return {success: false, error: errorMessage};
      }
    },
    [setUser, setAccessToken, setIsNewUser],
  );

  const signInWithEmail = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResult> => {
      setAuthState(prev => ({...prev, isLoading: true, error: null}));

      try {
        const login = await emailLogin(credentials.email, credentials.password);

        if (login.user) {
          // For email login, it's typically an existing user
          const result = await updateUserState(login.user, login.is_new_user);
          setAuthState(prev => ({...prev, isLoading: false}));
          return {
            ...result,
            provider: 'email',
          };
        } else {
          const errorMessage = login.message || 'Login failed';
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          Toast(errorMessage);
          return {success: false, error: errorMessage, provider: 'email'};
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Login failed';
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        Toast(errorMessage);
        return {success: false, error: errorMessage, provider: 'email'};
      }
    },
    [updateUserState],
  );

  const signUpWithEmail = useCallback(async (email:string, password: string, displayName: string) => {
    try {
      const user = await emailSignUp(displayName, email, password);
      Toast(user.message);
    } catch (error) {
      Toast(error as string)
      console.error(error);
    }
  }, [])

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    setAuthState(prev => ({...prev, isLoading: true, error: null}));

    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      const {idToken} = await GoogleSignin.getTokens();

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      const userDoc = await firestore().collection('users').doc(userCredential.user.uid).get();

      if(!userDoc.exists()){
        await firestore().collection('users').doc(userCredential.user.uid).set({
          uid: userCredential.user.uid,
          isSyncEnabled: false,
          paymentStatus: false,
          isNewUser: true,
        });
      }

      if (userCredential) {
        const isNewUser = (userDoc.exists() && userDoc.data()?.isNewUser) || true;
        const result = await updateUserState(userCredential, isNewUser);

        const message = isNewUser
          ? 'Google account linked and user signed up!'
          : 'Google account signed in!';

        Toast(message);
        setAuthState(prev => ({...prev, isLoading: false}));
        return {
          ...result,
          provider: 'google',
        };
      }

      throw new Error('Google sign-in failed');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Google sign-in failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      Toast(errorMessage);
      return {success: false, error: errorMessage, provider: 'google'};
    }
  }, [updateUserState]);

  const signInWithApple = useCallback(async (): Promise<AuthResult> => {
    setAuthState(prev => ({...prev, isLoading: true, error: null}));

    try {
      // Apple Sign-In implementation would go here
      // For now, we'll show a placeholder
      Toast('Apple Sign-In not implemented yet');
      setAuthState(prev => ({...prev, isLoading: false}));
      return {
        success: false,
        error: 'Apple Sign-In not implemented',
        provider: 'apple',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Apple sign-in failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      Toast(errorMessage);
      return {success: false, error: errorMessage, provider: 'apple'};
    }
  }, []);

  const signOut = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    setAuthState(prev => ({...prev, isLoading: true, error: null}));

    try {
      await auth().signOut();
      await GoogleSignin.signOut();

      // Clear the new user flag on sign out
      setIsNewUser(false);

      setAuthState({
        isLoading: false,
        error: null,
        user: null,
      });

      return {success: true};
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Sign out failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return {success: false, error: errorMessage};
    }
  }, [setIsNewUser]);

  const clearError = useCallback(() => {
    setAuthState(prev => ({...prev, error: null}));
  }, []);

  return {
    ...authState,
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    signOut,
    clearError,
    signUpWithEmail,
  };
};
