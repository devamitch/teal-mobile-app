import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import React from 'react';
import {
  KeyboardTypeOptions,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {TextInput} from 'react-native-paper';

interface TextBoxProps {
  ref?: any;
  mode?: 'flat' | 'outlined';
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: ((text: string) => void) | undefined;
  keyboardType?: KeyboardTypeOptions | undefined;
  secureTextEntry?: boolean | undefined;
  style?: StyleProp<TextStyle>;
  outlineStyle?: StyleProp<ViewStyle>;
  outlineColor?: string;
  textColor?: string;
  backgroundColor?: string;
  focused?: boolean;
}

const TextBox: React.FC<TextBoxProps> = ({
  ref,
  mode,
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
  outlineColor,
  outlineStyle,
  style,
  textColor,
  backgroundColor,
  focused,
  ...rest
}) => {
  return (
    <TextInput
      ref={ref}
      label={label}
      placeholder={placeholder}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      mode={mode || 'outlined'}
      // Colors
      outlineColor={outlineColor || lightTheme.buttonBorder}
      activeOutlineColor={lightTheme.primary}
      textColor={textColor || lightTheme.textDark}
      placeholderTextColor={lightTheme.textLight}
      cursorColor={lightTheme.primary}
      // Styling
      outlineStyle={[
        {
          borderRadius: 14, // Consistent border radius
          borderWidth: 1,
        },
        outlineStyle,
      ]}
      style={[
        {
          backgroundColor: backgroundColor || 'white',
          width: '100%',
          height: 55,
          fontSize: 16,
          fontFamily: FONT_FAMILIES.LatoRegular,
          lineHeight: 21,
          alignSelf: 'center',
        },
        style,
      ]}
      // Content styling
      contentStyle={{
        fontFamily: FONT_FAMILIES.LatoRegular,
        fontSize: 16,
        color: textColor || lightTheme.textDark,
        paddingHorizontal: 16,
      }}
      // Label styling
      theme={{
        colors: {
          primary: lightTheme.primary,
          onSurface: lightTheme.textMild,
          onSurfaceVariant: lightTheme.textLight,
          outline: outlineColor || lightTheme.buttonBorder,
          surface: backgroundColor || 'white',
          surfaceVariant: lightTheme.background,
        },
      }}
      value={value}
      onChangeText={onChangeText}
      {...rest}
    />
  );
};

export default TextBox;
