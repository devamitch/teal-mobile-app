import {EmailInput, PasswordInput, PrimaryButton} from '@/components/ui';
import TextInputComponent from '@/components/ui/inputs/text-input';
import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {useRegisterForm} from '@/hooks/use-register-form';
import {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

interface RegisterFormProps {
  onSubmit: (username: string, email: string, password: string) => void;
  loading?: boolean;
  externalError?: string;
  onFormValidityChange?: (isValid: boolean) => void;
}

export const RegisterForm = memo<RegisterFormProps>(
  ({onSubmit, loading = false, externalError, onFormValidityChange}) => {
    const {
      data,
      errors,
      isValid,
      updateField,
      setFieldTouched,
      getFieldError,
      setError,
    } = useRegisterForm();

    useEffect(() => {
      if (externalError) {
        setError('general', externalError);
      }
    }, [externalError, setError]);

    useEffect(() => {
      onFormValidityChange?.(isValid);
    }, [isValid, onFormValidityChange]);

    const handleUsernameChange = useCallback(
      (text: string) => {
        updateField('username', text);
      },
      [updateField],
    );

    const handleEmailChange = useCallback(
      (text: string) => {
        updateField('email', text);
      },
      [updateField],
    );

    const handlePasswordChange = useCallback(
      (text: string) => {
        updateField('password', text);
      },
      [updateField],
    );

    const handleConfirmPasswordChange = useCallback(
      (text: string) => {
        updateField('confirmPassword', text);
      },
      [updateField],
    );

    const handleUsernameBlur = useCallback(() => {
      setFieldTouched('username', true);
    }, [setFieldTouched]);

    const handleEmailBlur = useCallback(() => {
      setFieldTouched('email', true);
    }, [setFieldTouched]);

    const handlePasswordBlur = useCallback(() => {
      setFieldTouched('password', true);
    }, [setFieldTouched]);

    const handleConfirmPasswordBlur = useCallback(() => {
      setFieldTouched('confirmPassword', true);
    }, [setFieldTouched]);

    const handleSubmit = useCallback(() => {
      if (isValid && !loading) {
        onSubmit(data.username, data.email, data.password);
      }
    }, [isValid, loading, data.username, data.email, data.password, onSubmit]);

    return (
      <View style={styles.container}>
        <TextInputComponent
          label="Username"
          placeholder="Enter your username"
          value={data.username}
          onChangeText={handleUsernameChange}
          onBlur={handleUsernameBlur}
          error={getFieldError('username')}
          variant="outlined"
          labelStyle={styles.label}
          disabled={loading}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          colors={{
            primary: lightTheme.primary,
            label: lightTheme.textDark,
            border: lightTheme.buttonBorder,
          }}
        />

        <EmailInput
          label="Email"
          placeholder="Enter your email"
          value={data.email}
          onChangeText={handleEmailChange}
          onBlur={handleEmailBlur}
          error={getFieldError('email')}
          variant="outlined"
          labelStyle={styles.label}
          disabled={loading}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          colors={{
            primary: lightTheme.primary,
            label: lightTheme.textDark,
            border: lightTheme.buttonBorder,
          }}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={data.password}
          onChangeText={handlePasswordChange}
          onBlur={handlePasswordBlur}
          error={getFieldError('password')}
          variant="outlined"
          labelStyle={styles.label}
          disabled={loading}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          colors={{
            primary: lightTheme.primary,
            label: lightTheme.textDark,
            border: lightTheme.buttonBorder,
          }}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          value={data.confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          onBlur={handleConfirmPasswordBlur}
          error={getFieldError('confirmPassword')}
          variant="outlined"
          labelStyle={styles.label}
          disabled={loading}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          colors={{
            primary: lightTheme.primary,
            label: lightTheme.textDark,
            border: lightTheme.buttonBorder,
          }}
        />

        <PrimaryButton
          text={loading ? 'Signing up...' : 'Sign up'}
          onPress={() => {
            onSubmit(data.username, data.email, data.password);
          }}
          style={styles.signUpButton}
          fullWidth
        />
      </View>
    );
  },
);

RegisterForm.displayName = 'RegisterForm';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: lightTheme.textDark,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    fontSize: 16,
  },
  signUpButton: {
    borderRadius: 14,
    marginVertical: 25,
  },
});
