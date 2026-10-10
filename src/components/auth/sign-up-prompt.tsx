import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface SignUpPromptProps {
  onSignUpPress: () => void;
  disabled?: boolean;
}

export const SignUpPrompt = memo<SignUpPromptProps>(
  ({onSignUpPress, disabled = false}) => {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Text
            style={{
              color: lightTheme.textMild,
            }}>{`Don't have an account?  `}</Text>
          <TouchableOpacity onPress={onSignUpPress}>
            <Text style={{color: lightTheme.gradientMiddle}}>Sign up</Text>
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

SignUpPrompt.displayName = 'SignUpPrompt';
