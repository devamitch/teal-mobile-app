import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface LoginPromptProps {
  onLoginPress: () => void;
  disabled?: boolean;
}

export const LoginPrompt = memo<LoginPromptProps>(
  ({onLoginPress, disabled = false}) => {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Text
            style={{
              color: lightTheme.textMild,
            }}>{`Already have an account?  `}</Text>
          <TouchableOpacity onPress={onLoginPress} disabled={disabled}>
            <Text style={{color: lightTheme.gradientMiddle}}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  promptText: {
    fontSize: 16,
  },
  normalText: {
    color: lightTheme.textLight,
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  linkText: {
    color: lightTheme.gradientMiddle,
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontWeight: '600',
  },
});

LoginPrompt.displayName = 'LoginPrompt';
