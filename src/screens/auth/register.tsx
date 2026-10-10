import {
  AppleSignInButton,
  AuthDivider,
  AuthHeader,
  GoogleSignInButton,
  RegisterForm,
} from '@/components/auth';
import {LoginPrompt} from '@/components/auth/login-prompt';
import {lightTheme} from '@/constants/colors';
import {useAuth} from '@/hooks/use-auth';
import {Platform, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Toast} from '../../utils/toast';
import { useSocialAuth } from '@/hooks/use-social-auth';
import SocianFullButtons from '@/components/auth/social-buttons-full';

const RegistrationScreen = (props: any) => {
  const {signInWithGoogle, signInWithApple} = useSocialAuth();
  const {signUpWithEmail} = useAuth();

  const Colors = lightTheme;

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      Toast('Google sign-up failed');
    }
  };

  const handleAppleSignUp = async () => {
    try {
      await signInWithApple();
    } catch (error) {
      Toast('Apple sign-up failed');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.background}}>
      <ScrollView>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.background,
            padding: 25,
          }}>
          <AuthHeader screenType="register" />
          <RegisterForm
            onSubmit={(username, email, password) => {
              signUpWithEmail(email, password, username);
            }}
            loading={false}
          />
          <LoginPrompt
            onLoginPress={() => props.navigation.navigate('Login')}
          />
          <AuthDivider />

          <SocianFullButtons
            onApplePress={handleAppleSignUp}
            onGooglePress={handleGoogleSignUp}
            isAppleSupported={Platform.OS === 'ios'}
          />
          {Platform.OS === 'ios' && (
            <AppleSignInButton
              onPress={handleAppleSignUp}
              style={styles.socialButton}
            />
          )}

          <GoogleSignInButton
            onPress={handleGoogleSignUp}
            style={styles.socialButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    width: '100%',
    marginTop: 10,
    borderRadius: 14,
  },
});

export default RegistrationScreen;
