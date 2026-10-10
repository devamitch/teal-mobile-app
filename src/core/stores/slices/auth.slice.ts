import type {StateCreator} from 'zustand';

// User data interface
export interface AuthData {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
}

// User state interface
export interface AuthState {
  auth?: AuthData;
  userData?: AuthData;
  isLogin: boolean;
  paymentStatus: boolean;
  error?: string;
  isLoading: boolean;
  isNewUser: boolean; // Add this new field
  shouldShowQuiz: boolean; // Add this new field
}

// User actions interface
export interface AuthActions {
  // Authentication actions
  clearAuth: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // State setters
  setError: (error: string | undefined) => void;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (auth: AuthData | undefined) => void;
  setUserData: (userData: AuthData | undefined) => void;
  setPaymentStatus: (status: boolean) => void;
  setIsLogin: (isLogin: boolean) => void;
  setIsNewUser: (isNewUser: boolean) => void; // Add this
  setShouldShowQuiz: (shouldShowQuiz: boolean) => void; // Add this
  setAccessToken: (token: string) => void; // Add this if not already present
}

// Combined auth slice type
export interface AuthSlice {
  auth: AuthState & AuthActions;
}

// Initial auth state
const initialUserState: AuthState = {
  auth: undefined,
  userData: undefined,
  isLogin: false,
  paymentStatus: false,
  error: undefined,
  isLoading: false,
  isNewUser: false, // Add this
  shouldShowQuiz: false, // Add this
};

// Create the auth slice
const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (
  set,
  get,
) => ({
  auth: {
    ...initialUserState,

    // Authentication actions
    clearAuth: () => {
      console.log('clearAuth called');
      set(state => ({
        auth: {
          ...state.auth,
          auth: undefined,
          userData: undefined,
          isLogin: false,
          paymentStatus: false,
          error: undefined,
          isNewUser: false,
          shouldShowQuiz: false,
        },
      }));
    },

    login: async (email: string, password: string) => {
      const {setError, setIsLoading, setUser, setIsLogin} = get().auth;

      try {
        setIsLoading(true);
        setError(undefined);

        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUserData: AuthData = {
          displayName: 'Test User',
          email,
          emailVerified: true,
          phoneNumber: null,
          photoURL: null,
          providerId: 'password',
          uid: 'firebase-uid-123',
        };

        setUser(mockUserData);
        setIsLogin(true);

        return true;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to login');
        return false;
      } finally {
        setIsLoading(false);
      }
    },

    logout: () => {
      console.log('logout called');
      set(state => ({
        auth: {
          ...state.auth,
          auth: undefined,
          userData: undefined,
          isLogin: false,
          paymentStatus: false,
          isNewUser: false,
          shouldShowQuiz: false,
        },
      }));
    },

    // State setters
    setError: (error: string | undefined) => {
      set(state => ({
        auth: {
          ...state.auth,
          error,
        },
      }));
    },

    setIsLoading: (isLoading: boolean) => {
      set(state => ({
        auth: {
          ...state.auth,
          isLoading,
        },
      }));
    },

    setUser: (auth: AuthData | undefined) => {
      console.log('setUser called with:', auth);
      set(state => ({
        auth: {
          ...state.auth,
          auth,
          userData: auth, // Keep both for compatibility
        },
      }));
    },

    setUserData: (userData: AuthData | undefined) => {
      console.log('setUserData called with:', userData);
      set(state => ({
        auth: {
          ...state.auth,
          userData,
          auth: userData, // Keep both for compatibility
        },
      }));
    },

    setPaymentStatus: (paymentStatus: boolean) => {
      set(state => ({
        auth: {
          ...state.auth,
          paymentStatus,
        },
      }));
    },

    setIsLogin: (isLogin: boolean) => {
      console.log('setIsLogin called with:', isLogin);
      set(state => ({
        auth: {
          ...state.auth,
          isLogin,
        },
      }));
    },

    setIsNewUser: (isNewUser: boolean) => {
      console.log('setIsNewUser called with:', isNewUser);
      set(state => ({
        auth: {
          ...state.auth,
          isNewUser,
        },
      }));
    },

    setShouldShowQuiz: (shouldShowQuiz: boolean) => {
      console.log('setShouldShowQuiz called with:', shouldShowQuiz);
      set(state => ({
        auth: {
          ...state.auth,
          shouldShowQuiz,
        },
      }));
    },

    setAccessToken: (token: string) => {
      // Implement if not already present
      console.log('setAccessToken called with:', token);
      // Add token storage logic here
    },
  },
});

// Export the slice for use in store
export default createAuthSlice;
