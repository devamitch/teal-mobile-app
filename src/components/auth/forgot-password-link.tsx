import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

interface ForgotPasswordLinkProps {
  onPress: () => void;
  style?: any;
  disabled?: boolean;
}

export const ForgotPasswordLink = memo<ForgotPasswordLinkProps>(
  ({onPress, style, disabled = false}) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, style]}
        activeOpacity={0.7}
        disabled={disabled}>
        <Text style={[styles.text, disabled && styles.disabledText]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 10,
    marginBottom: 25,
  },
  text: {
    color: lightTheme.primary,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  disabledText: {
    opacity: 0.6,
  },
});

ForgotPasswordLink.displayName = 'ForgotPasswordLink';
