import {EmailInput, PasswordInput, PrimaryButton} from '@/components/ui';
import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {useLoginForm} from '@/hooks/use-login-form';
import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
  externalError?: string;
  onFormValidityChange?: (isValid: boolean) => void;
}

export const LoginForm = memo<LoginFormProps>(
  ({onSubmit, loading = false, externalError, onFormValidityChange}) => {
    const {
      data,
      errors,
      isValid,
      updateField,
      setFieldTouched,
      getFieldError,
      setError,
    } = useLoginForm();

    // Set external error if provided
    useEffect(() => {
      if (externalError) {
        setError('general', externalError);
      }
    }, [externalError, setError]);

    // Notify parent of form validity changes
    useEffect(() => {
      onFormValidityChange?.(isValid);
    }, [isValid, onFormValidityChange]);

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

    const handleEmailBlur = useCallback(() => {
      setFieldTouched('email', true);
    }, [setFieldTouched]);

    const handlePasswordBlur = useCallback(() => {
      setFieldTouched('password', true);
    }, [setFieldTouched]);

    const handleSubmit = useCallback(() => {
      if (isValid && !loading) {
        onSubmit(data.email, data.password);
      }
    }, [isValid, loading, data.email, data.password, onSubmit]);

    return (
      <View style={styles.container}>
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
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          colors={{
            primary: lightTheme.primary,
            label: lightTheme.textDark,
            border: lightTheme.buttonBorder,
          }}
        />

        <PrimaryButton
          text={loading ? 'Signing in...' : 'Sign in'}
          onPress={() => {
            onSubmit(data.email, data.password);
          }}
          style={styles.signInButton}
          fullWidth
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: lightTheme.textDark,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    fontSize: 16,
  },
  signInButton: {
    borderRadius: 14,
    marginBottom: 16,
  },
});

LoginForm.displayName = 'LoginForm';
