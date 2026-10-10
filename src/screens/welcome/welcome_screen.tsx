import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {CheckBox} from 'react-native-elements';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Components
import {
  AppleSignInButton,
  GoogleSignInButton,
} from '@/components/auth/social-buttons';
import {PrimaryButton} from '@/components/ui';
import AlertBox from '@/components/ui/modal/alert-box';

// Constants
import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {IMAGES} from '@/constants/images';

// Hooks
import useAppStore from '@/core/stores';
import {useSocialAuth} from '@/hooks/use-social-auth';

// Types
import type {RootStackParamList} from '@/navigations/MainNavigation';
import SocianFullButtons from '@/components/auth/social-buttons-full';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

const WelcomeScreen = ({
  navigation,
}: {
  navigation: WelcomeScreenNavigationProp;
}) => {
  const Colors = lightTheme;

  // Get auth state from store
  const {isLogin, setIsLogin} = useAppStore(state => state.user);

  // Alert box states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState<(() => void) | null>(null);

  // Privacy policy checkbox state
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const showAlert = (title: string, message: string, action?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertAction(() => action);
    setAlertVisible(true);
  };

  // Social auth hook
  const {
    // State
    isLoading,
    isInitializing,
    error,
    isAuthenticated,

    // Methods
    signInWithGoogle,
    signInWithApple,
    clearError,

    // Platform checks
    isAppleSignInAvailable,
    isGoogleSignInConfigured,
  } = useSocialAuth({
    // Configuration
    googleWebClientId:
      '904995166325-5957lvq85fsf9kq7a2ug96gfg49nidds.apps.googleusercontent.com',
    googleOfflineAccess: true,
    appleRequestedScopes: ['email', 'fullName'],
    enableDebugLogs: __DEV__,

    // Callbacks
    onAuthStateChanged: (user, accessToken) => {
      console.log('Auth state changed:', user?.email || 'No user');
      console.log('Has access token:', !!accessToken);
    },
    onSuccess: result => {
      console.log('Authentication successful:', result);
      showAlert(
        'Welcome!',
        `Successfully signed in with ${result.provider}${
          result.isNewUser ? ' (New Account)' : ''
        }`,
        () => {
          try {
            setIsLogin(true);
          } catch (error) {
            console.error('Error setting login state:', error);
          }
        },
      );
    },
    onError: (error, provider) => {
      console.error('Authentication error:', error, provider);
      showAlert(
        'Authentication Error',
        `${
          provider
            ? `${provider.charAt(0).toUpperCase() + provider.slice(1)} `
            : ''
        }Error: ${error}`,
        clearError,
      );
    },
  });

  const isButtonDisabled = isLoading || !privacyAccepted;

  const onSignIn = () => {
    if (isButtonDisabled) return;
    navigation.navigate('Login');
  };

  // Handle manual sign up navigation
  const onSignUp = () => {
    if (isButtonDisabled) return;
    navigation.navigate('Registration');
  };

  // Handle Google authentication

  const handleGoogleAuth = async () => {
    if (isButtonDisabled || !isGoogleSignInConfigured) return;

    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        console.error('Google sign-in failed:', result.error);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  // Handle Apple authentication
  const handleAppleAuth = async () => {
    if (isButtonDisabled || !isAppleSignInAvailable) return;

    try {
      const result = await signInWithApple();
      if (!result.success) {
        console.error('Apple sign-in failed:', result.error);
      }
    } catch (error) {
      console.error('Apple sign-in error:', error);
    }
  };

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image style={styles.logo} source={IMAGES.logo} />
          <Text style={styles.title}>Let's Get Started!</Text>
          <Text style={styles.subtitle}>Let's dive in into your account</Text>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={clearError}
              style={styles.clearErrorButton}>
              <Text style={styles.clearErrorText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Privacy Policy Checkbox with Terms of Service Link */}
        <View style={styles.privacyContainer}>
          <View style={styles.privacyRow}>
            <CheckBox
              checked={privacyAccepted}
              onPress={() => setPrivacyAccepted(!privacyAccepted)}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
              checkedIcon="check-square"
              uncheckedIcon="square-o"
            />
            <Text style={styles.checkboxText}>I accept the </Text>
            <TouchableOpacity
              style={styles.termsLinkContainer}
              onPress={() => navigation.navigate('TermsOfService')}>
              <Text style={styles.termsLinkText}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Manual Sign In Button */}
        <PrimaryButton
          onPress={onSignIn}
          text={isLoading ? 'Please wait...' : 'Sign in'}
          style={[
            styles.button,
            {
              backgroundColor: isButtonDisabled
                ? Colors.textLight
                : Colors.primary,
              marginTop: 25,
              opacity: isButtonDisabled ? 0.6 : 1,
            },
          ]}
          textStyle={{
            color: Colors.primaryContrast,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Lato',
          }}
          fullWidth
          disabled={isButtonDisabled}
        />

        {/* Manual Sign Up Button */}
        <TouchableOpacity
          onPress={onSignUp}
          style={[
            styles.button,
            {
              borderColor: isButtonDisabled ? Colors.textLight : Colors.primary,
              borderWidth: 1,
              marginTop: 25,
              opacity: isButtonDisabled ? 0.6 : 1,
            },
          ]}
          disabled={isButtonDisabled}>
          <Text
            style={{
              color: isButtonDisabled ? Colors.textLight : Colors.primary,
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: 'Lato',
            }}>
            Sign up
          </Text>
        </TouchableOpacity>

        {/* Social Sign In Section */}
        <Text
          style={{
            fontSize: 12,
            alignSelf: 'center',
            paddingVertical: 20,
            color: Colors.textLight,
          }}>
          or continue with
        </Text>

        <SocianFullButtons
          onApplePress={handleAppleAuth}
          onGooglePress={handleGoogleAuth}
          isAppleSupported={isAppleSignInAvailable}
          fullWidth
        />

        {/* Apple Sign In Button */}
        {/* {isAppleSignInAvailable && (
          <AppleSignInButton
            onPress={handleAppleAuth}
            style={[styles.socialButton, {opacity: isButtonDisabled ? 0.6 : 1}]}
            disabled={isButtonDisabled}
          />
        )} */}

        {/* Google Sign In Button */}
        {/* {isGoogleSignInConfigured && (
          <GoogleSignInButton
            onPress={handleGoogleAuth}
            style={[styles.socialButton, {opacity: isButtonDisabled ? 0.6 : 1}]}
            disabled={isButtonDisabled}
          />
        )} */}

        {/* No Social Methods Available */}
        {!isGoogleSignInConfigured && !isAppleSignInAvailable && (
          <Text style={styles.noMethodsText}>
            Social sign-in methods are not available on this device.
          </Text>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingOverlayText}>Signing you in...</Text>
          </View>
        )}
      </View>

      <AlertBox
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => {
          setAlertVisible(false);
          if (alertAction) {
            alertAction();
            setAlertAction(null);
          }
        }}
        onModalHide={() => {}}
      />
    </>
  );
};

const styles = StyleSheet.create({
  privacyContainer: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsLinkContainer: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  termsLinkText: {
    color: lightTheme.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '500',
    fontFamily: 'Lato',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxText: {
    fontSize: 14,
    color: lightTheme.textLight,
    fontFamily: 'Lato',
    fontWeight: '400',
  },
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: '30%',
  },
  button: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  socialButton: {
    width: '80%',
    marginTop: 10,
    borderRadius: 14,
  },
  logo: {
    height: 219,
    width: 219,
  },
  title: {
    color: lightTheme.textDark,
    fontSize: 24,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    paddingTop: 40,
  },
  subtitle: {
    fontSize: 16,
    paddingTop: 15,
    color: lightTheme.textLight,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: lightTheme.textLight,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    flex: 1,
  },
  clearErrorButton: {
    marginLeft: 10,
  },
  clearErrorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
  noMethodsText: {
    textAlign: 'center',
    color: lightTheme.textLight,
    fontSize: 14,
    fontStyle: 'italic',
    padding: 20,
    marginTop: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlayText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
});

export default WelcomeScreen;
