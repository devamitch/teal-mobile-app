import {
  AppleSignInButton,
  AuthDivider,
  AuthHeader,
  ForgotPasswordLink,
  GoogleSignInButton,
  LoginForm,
  SignUpPrompt,
  useAuth,
} from '@/components/auth';
import SocianFullButtons from '@/components/auth/social-buttons-full';
import {lightTheme} from '@/constants/colors';
import { useSocialAuth } from '@/hooks/use-social-auth';
import React, {useCallback, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {
    isLoading,
    error,
    signInWithGoogle,
    signInWithApple,
    clearError,
  } = useSocialAuth();

  const { signInWithEmail } = useAuth();

  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({email: '', password: ''});
  const scrollViewRef = useRef<ScrollView>(null);

  const handleFormSubmit = useCallback(
    async (email: string, password: string) => {
      setFormData({email, password});
      clearError();
      await signInWithEmail({email, password});
    },
    [signInWithEmail, clearError, navigation],
  );

  const handleGoogleLogin = useCallback(async () => {
    clearError();
    await signInWithGoogle();
  }, [signInWithGoogle, clearError, navigation]);

  const handleAppleLogin = useCallback(async () => {
    clearError();
    await signInWithApple();
  }, [signInWithApple, clearError, navigation]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  const handleSignUp = useCallback(() => {
    navigation.navigate('Registration');
  }, [navigation]);

  const handleFormValidityChange = useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <AuthHeader />

          {/* Login Form */}
          <LoginForm
            onSubmit={handleFormSubmit}
            loading={isLoading}
            externalError={error || undefined}
            onFormValidityChange={handleFormValidityChange}
          />

          {/* Forgot Password Link */}
          <ForgotPasswordLink
            onPress={handleForgotPassword}
            disabled={isLoading}
          />

          {/* Sign Up Prompt */}
          <SignUpPrompt onSignUpPress={handleSignUp} disabled={isLoading} />

          {/* Social Auth Divider */}
          <AuthDivider />

          <SocianFullButtons
            onApplePress={handleAppleLogin}
            onGooglePress={handleGoogleLogin}
            isAppleSupported={Platform.OS === 'ios'}
          />

          {/* Social Auth Buttons */}
          {/* {Platform.OS === 'ios' && (
            <AppleSignInButton
              onPress={handleAppleLogin}
              style={styles.socialButton}
            />
          )}

          <GoogleSignInButton
            onPress={handleGoogleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.socialButton}
          /> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 25,
  },
  signInButton: {
    borderRadius: 14,
    marginBottom: 16,
  },
  socialButton: {
    width: '100%',
    marginTop: 10,
    borderRadius: 14,
  },
});

export default LoginScreen;
