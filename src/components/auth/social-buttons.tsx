import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import React, {memo} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Svg, {G, Path} from 'react-native-svg';
import Button, {type ButtonProps} from '../ui/buttons/button';

interface SocialButtonProps
  extends Omit<ButtonProps, 'text' | 'backgroundColor' | 'textColor' | 'icon'> {
  loading?: boolean;
  disabled?: boolean;
}

// Official Apple Logo SVG Component
const AppleLogo = memo(
  ({size = 18, color = '#FFFFFF'}: {size?: number; color?: string}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 21.99C7.78997 22.03 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.13997 6.91 8.85997 6.89C10.15 6.87 11.36 7.74 12.1 7.74C12.83 7.74 14.24 6.68 15.8 6.84C16.47 6.87 18.05 7.15 19.11 8.65C19.02 8.71 17.4 9.68 17.41 11.63C17.44 14.01 19.56 14.8 19.59 14.81C19.57 14.88 19.27 15.93 18.71 19.5ZM14.94 5.19C15.69 4.3 16.18 3.1 16.05 1.9C15.04 1.95 13.8 2.59 13.01 3.47C12.3 4.25 11.73 5.47 11.88 6.64C13.01 6.72 14.19 6.08 14.94 5.19Z"
        fill={color}
      />
    </Svg>
  ),
);

// Official Google Logo SVG Component
const GoogleLogo = memo(({size = 18}: {size?: number}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G>
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </G>
  </Svg>
));

// Apple Sign-In Button
export const AppleSignInButton = memo<SocialButtonProps>(
  ({onPress, loading = false, disabled = false, style, ...props}) => {
    return (
      <Button
        {...props}
        variant="rect"
        backgroundColor="#000000"
        textColor="#FFFFFF"
        text="Continue with Apple"
        icon={<AppleLogo size={18} color="#FFFFFF" />}
        iconPosition="left"
        loading={loading}
        disabled={disabled}
        loadingColor="#FFFFFF"
        loadingText="Signing in..."
        showLoadingText={false}
        onPress={onPress}
        underlayColor="#1a1a1a"
        rippleColor="rgba(255, 255, 255, 0.1)"
        style={[styles.appleButton, style]}
        textStyle={styles.appleButtonText}
        accessibilityLabel="Sign in with Apple"
        accessibilityRole="button"
      />
    );
  },
);

// Google Sign-In Button
export const GoogleSignInButton = memo<SocialButtonProps>(
  ({onPress, loading = false, disabled = false, style, ...props}) => {
    return (
      <Button
        {...props}
        variant="rect"
        backgroundColor="#FFFFFF"
        textColor="#3C4043"
        text="Continue with Google"
        icon={<GoogleLogo size={18} />}
        iconPosition="left"
        loading={loading}
        disabled={disabled}
        loadingColor="#757575"
        loadingText="Signing in..."
        showLoadingText={false}
        onPress={onPress}
        underlayColor="#F8F9FA"
        rippleColor="rgba(60, 64, 67, 0.08)"
        style={[styles.googleButton, style]}
        textStyle={styles.googleButtonText}
        accessibilityLabel="Sign in with Google"
        accessibilityRole="button"
      />
    );
  },
);

// Alternative variants
export const AppleSignInButtonAlt = memo<SocialButtonProps>(
  ({onPress, loading = false, disabled = false, style, ...props}) => {
    return (
      <AppleSignInButton
        {...props}
        text="Sign in with Apple"
        onPress={onPress}
        loading={loading}
        disabled={disabled}
        style={style}
      />
    );
  },
);

export const GoogleSignInButtonAlt = memo<SocialButtonProps>(
  ({onPress, loading = false, disabled = false, style, ...props}) => {
    return (
      <GoogleSignInButton
        {...props}
        text="Sign in with Google"
        onPress={onPress}
        loading={loading}
        disabled={disabled}
        style={style}
      />
    );
  },
);

// Divider Component
export const AuthDivider = memo(() => (
  <View style={styles.dividerContainer}>
    <View style={styles.line} />
    <Text style={styles.dividerText}>Or Login with</Text>
    <View style={styles.line} />
  </View>
));

const styles = StyleSheet.create({
  // Apple Button Styles
  appleButton: {
    height: 50,
    borderRadius: 8,
    width: '100%',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.31,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: FONT_FAMILIES.YoungSerifRegular,
    }),
  },

  // Google Button Styles
  googleButton: {
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DADCE0',
    width: '100%',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.04,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  googleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.25,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: FONT_FAMILIES.YoungSerifRegular,
    }),
  },

  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: lightTheme.textLight,
  },

  dividerText: {
    color: lightTheme.textLight,
    fontSize: 12,
    marginHorizontal: 16,
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
});

// Display names
AppleLogo.displayName = 'AppleLogo';
GoogleLogo.displayName = 'GoogleLogo';
AppleSignInButton.displayName = 'AppleSignInButton';
GoogleSignInButton.displayName = 'GoogleSignInButton';
AppleSignInButtonAlt.displayName = 'AppleSignInButtonAlt';
GoogleSignInButtonAlt.displayName = 'GoogleSignInButtonAlt';
AuthDivider.displayName = 'AuthDivider';
