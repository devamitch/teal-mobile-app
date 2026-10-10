import {PrimaryButton} from '@/components/ui';
import BackButton from '@/components/ui/buttons/back-button';
import TextInputComponent from '@/components/ui/inputs/text-input';
import AlertBox from '@/components/ui/modal/alert-box';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth, {getAuth} from '@react-native-firebase/auth';
import {useState} from 'react';

interface ForgotPasswordProps {
  navigation: any;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Alert box states
  const [alertVisible, setAlertVisible] = useState(false);
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);

  const handlePasswordReset = async () => {
    setIsSending(true);
    setError(null);
    try {
      const authInstance = getAuth();
      await authInstance.sendPasswordResetEmail(email.trim());
      setSuccess(true);
      setShouldNavigateBack(true);
      setAlertVisible(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View>
          <BackButton style={{marginBottom: 20}} />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Don't worry! It happens. Please enter the email address linked to
            your account.
          </Text>
          <TextInputComponent
            placeholder="Enter your email here"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <PrimaryButton
          text={isSending ? 'Sending...' : 'Send verification email'}
          style={styles.button}
          onPress={handlePasswordReset}
          disabled={isSending || !email}
        />
      </SafeAreaView>

      <AlertBox
        visible={alertVisible}
        title="Email Sent"
        message="A password reset email has been sent to your email address."
        onClose={() => {
          setAlertVisible(false);
          setShouldNavigateBack(true);
        }}
        onModalHide={() => {
          if (shouldNavigateBack) {
            setShouldNavigateBack(false);
            navigation.goBack();
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  button: {
    borderRadius: 14,
    width: '100%',
    alignSelf: 'baseline',
  },
  error: {
    color: 'red',
  },
});

export default ForgotPassword;
