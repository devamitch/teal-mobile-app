import type {StateCreator} from 'zustand';

// User data interface
export interface UserData {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
  createdAt?: any;
  metadata?: {
    creationTime?: number;
    lastSignInTime?: number;
  };
}

// User state interface
export interface UserState {
  user?: UserData | undefined;
  userData?: UserData | undefined;
  isLogin: boolean;
  paymentStatus: boolean;
  error?: string | undefined;
  isLoading: boolean;
  accessToken?: string | undefined;
  isNewUser: boolean; // Add this field
}

// User actions interface
export interface UserActions {
  // Authentication actions
  clearUser: () => void;
  clearAuth: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // State setters
  setError: (error: string | undefined) => void;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: UserData | undefined) => void;
  setUserData: (userData: UserData | undefined) => void;
  setPaymentStatus: (status: boolean) => void;
  setIsLogin: (isLogin: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  setIsNewUser: (isNewUser: boolean) => void; // Add this action
}

// Combined user slice type
export interface UserSlice {
  user: UserState & UserActions;
}

// Initial user state
const initialUserState: UserState = {
  user: undefined,
  userData: undefined,
  isLogin: false,
  paymentStatus: false,
  error: undefined,
  isLoading: false,
  isNewUser: false, // Add this field
  accessToken: undefined,
};

// Create the user slice
const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set,
  get,
) => ({
  user: {
    ...initialUserState,

    // Authentication actions
    clearAuth: () => {
      console.log('clearAuth called');
      set(state => ({
        user: {
          ...state.user,
          user: undefined,
          userData: undefined,
          isLogin: false,
          paymentStatus: false,
          error: undefined,
          isNewUser: false, // Reset this too
        },
      }));
    },
    clearUser: () => {
      console.log('clearAuth called');
      set(state => ({
        user: {
          ...state.user,
          user: undefined,
          userData: undefined,
          isLogin: false,
          paymentStatus: false,
          error: undefined,
          isNewUser: false, // Reset this too
        },
      }));
    },

    login: async (email: string, password: string) => {
      const {setError, setIsLoading, setUser, setIsLogin} = get().user;

      try {
        setIsLoading(true);
        setError(undefined);

        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUserData: UserData = {
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
        user: {
          ...state.user,
          ...initialUserState,
          isNewUser: false, // Reset this too
        },
      }));
    },

    // State setters
    setError: (error: string | undefined) => {
      set(state => ({
        user: {
          ...state.user,
          error,
        },
      }));
    },

    setIsLoading: (isLoading: boolean) => {
      set(state => ({
        user: {
          ...state.user,
          isLoading,
        },
      }));
    },

    setUser: (user: UserData | undefined) => {
      console.log('setUser called with:', user);
      set(state => ({
        user: {
          ...state.user,
          user,
          userData: user, // Keep both for compatibility
          isLogin: !!user,
          accessToken: state.user.accessToken,
        },
      }));
    },

    setUserData: (userData: UserData | undefined) => {
      console.log('setUserData called with:', userData);
      set(state => ({
        user: {
          ...state.user,
          userData,
          user: userData, // Keep both for compatibility
        },
      }));
    },

    setPaymentStatus: (paymentStatus: boolean) => {
      set(state => ({
        user: {
          ...state.user,
          paymentStatus,
        },
      }));
    },

    setIsLogin: (isLogin: boolean) => {
      console.log('setIsLogin called with:', isLogin);
      set(state => ({
        user: {
          ...state.user,
          isLogin,
        },
      }));
    },

    setAccessToken(accessToken) {
      set(state => ({
        user: {
          ...state.user,
          accessToken,
        },
      }));
    },

    setIsNewUser: (isNewUser: boolean) => {
      console.log('setIsNewUser called with:', isNewUser);
      set(state => ({
        user: {
          ...state.user,
          isNewUser,
        },
      }));
    },
  },
});

// Export the slice for use in store
export default createUserSlice;
