'use client';

import {lightTheme} from '@/constants';
import {AlertCircle, Check, Eye, EyeOff, X} from 'lucide-react-native';
import type React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  View,
  type NativeSyntheticEvent,
  type TextInputProps as RNTextInputProps,
  type StyleProp,
  type TextInputContentSizeChangeEventData,
  type TextInputFocusEventData,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {BorderlessButton} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Create animated TextInput component
const AnimatedRNTextInput = Animated.createAnimatedComponent(RNTextInput);

export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  // Basic props
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;

  // Input types and variants
  variant?: 'outlined' | 'filled' | 'underlined' | 'floating';
  inputType?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'phone'
    | 'url'
    | 'search';
  multiline?: boolean;
  numberOfLines?: number;

  // Icons and actions
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  showPasswordToggle?: boolean;
  onClear?: () => void;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;

  // Validation
  validationRules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email?: boolean;
    phone?: boolean;
    url?: boolean;
    custom?: (value: string) => boolean | string;
  };
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showValidationIcon?: boolean;

  // Styling
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperStyle?: StyleProp<TextStyle>;

  // Colors
  primaryColor?: string;
  errorColor?: string;
  successColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  focusedBorderColor?: string;
  textColor?: string;
  placeholderColor?: string;
  labelColor?: string;
  disabledColor?: string;

  // Animation configuration
  animationDuration?: number;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
  labelAnimationType?: 'scale' | 'translate' | 'fade';
  focusAnimation?: 'scale' | 'glow' | 'slide' | 'bounce';
  errorAnimation?: 'shake' | 'bounce' | 'fade' | 'slide';

  // Advanced features
  autoValidate?: boolean;
  debounceValidation?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  autoFocus?: boolean;
  selectTextOnFocus?: boolean;
  blurOnSubmit?: boolean;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';

  // Callbacks
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onSubmitEditing?: () => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  onContentSizeChange?: (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => void;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const TextInputComponent: React.FC<TextInputProps> = ({
  // Basic props
  label,
  placeholder,
  value = '',
  onChangeText,
  error,
  helperText,
  disabled = false,
  required = false,

  // Input types and variants
  variant = 'outlined',
  inputType = 'text',
  multiline = false,
  numberOfLines = 1,

  // Icons and actions
  leftIcon,
  rightIcon,
  clearable = false,
  showPasswordToggle = false,
  onClear,
  onRightIconPress,
  onLeftIconPress,

  // Validation
  validationRules,
  validateOnChange = false,
  validateOnBlur = true,
  showValidationIcon = true,

  // Styling
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,

  // Colors
  primaryColor = lightTheme?.primary || '#007AFF',
  errorColor = '#FF6B6B',
  successColor = '#4ECDC4',
  backgroundColor = '#FFFFFF',
  borderColor = '#E0E0E0',
  focusedBorderColor,
  textColor = '#333333',
  placeholderColor = '#999999',
  labelColor = '#666666',
  disabledColor = '#CCCCCC',

  // Animation configuration
  animationDuration = 200,
  springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  labelAnimationType = 'translate',
  focusAnimation = 'scale',
  errorAnimation = 'shake',

  // Advanced features
  autoValidate = false,
  debounceValidation = 300,
  maxLength,
  showCharacterCount = false,
  autoCapitalize = 'none',
  autoCorrect = false,
  autoFocus = false,
  selectTextOnFocus = false,
  blurOnSubmit = true,
  returnKeyType = 'done',

  // Callbacks
  onFocus,
  onBlur,
  onSubmitEditing,
  onValidationChange,
  onContentSizeChange,

  // Accessibility
  accessibilityLabel,
  accessibilityHint,
  testID,

  ...restProps
}) => {
  // Refs
  const inputRef = useRef<RNTextInput>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const [validationError, setValidationError] = useState<string | undefined>(
    error,
  );
  const [isValid, setIsValid] = useState(true);
  const [inputHeight, setInputHeight] = useState(0);

  // Animation values
  const focusAnimationValue = useSharedValue(0);
  const labelAnimation = useSharedValue(0);
  const errorAnimationValue = useSharedValue(0);
  const borderAnimation = useSharedValue(0);
  const scaleAnimation = useSharedValue(1);
  const shakeAnimation = useSharedValue(0);
  const glowAnimation = useSharedValue(0);
  const characterCountAnimation = useSharedValue(0);

  // Derived values
  const hasValue = useDerivedValue(() => {
    return internalValue.length > 0;
  });

  // Colors
  const currentBorderColor = focusedBorderColor || primaryColor;

  // Validation function
  const validateInput = useCallback(
    (text: string): {isValid: boolean; error?: string} => {
      if (!validationRules) return {isValid: true};

      // Required validation
      if (validationRules.required && !text.trim()) {
        return {isValid: false, error: 'This field is required'};
      }

      // Min length validation
      if (
        validationRules.minLength &&
        text.length < validationRules.minLength
      ) {
        return {
          isValid: false,
          error: `Minimum ${validationRules.minLength} characters required`,
        };
      }

      // Max length validation
      if (
        validationRules.maxLength &&
        text.length > validationRules.maxLength
      ) {
        return {
          isValid: false,
          error: `Maximum ${validationRules.maxLength} characters allowed`,
        };
      }

      // Email validation
      if (validationRules.email || inputType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (text && !emailRegex.test(text)) {
          return {isValid: false, error: 'Please enter a valid email address'};
        }
      }

      // Phone validation
      if (validationRules.phone || inputType === 'phone') {
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
        if (text && !phoneRegex.test(text.replace(/\s/g, ''))) {
          return {isValid: false, error: 'Please enter a valid phone number'};
        }
      }

      // URL validation
      if (validationRules.url || inputType === 'url') {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        if (text && !urlRegex.test(text)) {
          return {isValid: false, error: 'Please enter a valid URL'};
        }
      }

      // Pattern validation
      if (
        validationRules.pattern &&
        text &&
        !validationRules.pattern.test(text)
      ) {
        return {isValid: false, error: 'Invalid format'};
      }

      // Custom validation
      if (validationRules.custom) {
        const customResult = validationRules.custom(text);
        if (typeof customResult === 'string') {
          return {isValid: false, error: customResult};
        }
        if (!customResult) {
          return {isValid: false, error: 'Invalid input'};
        }
      }

      return {isValid: true};
    },
    [validationRules, inputType],
  );

  // Handle validation with debounce
  const handleValidation = useCallback(
    (text: string) => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }

      validationTimeoutRef.current = setTimeout(() => {
        const validation = validateInput(text);
        setIsValid(validation.isValid);
        setValidationError(validation.error);
        onValidationChange?.(validation.isValid, validation.error);

        if (!validation.isValid) {
          // Trigger error animation
          if (errorAnimation === 'shake') {
            shakeAnimation.value = withSequence(
              withTiming(-10, {duration: 50}),
              withTiming(10, {duration: 50}),
              withTiming(-10, {duration: 50}),
              withTiming(10, {duration: 50}),
              withTiming(0, {duration: 50}),
            );
          }
          errorAnimationValue.value = withTiming(1, {
            duration: animationDuration,
          });
        } else {
          errorAnimationValue.value = withTiming(0, {
            duration: animationDuration,
          });
        }
      }, debounceValidation);
    },
    [
      validateInput,
      onValidationChange,
      debounceValidation,
      animationDuration,
      errorAnimation,
      shakeAnimation,
      errorAnimationValue,
    ],
  );

  // Handle text change
  const handleChangeText = useCallback(
    (text: string) => {
      setInternalValue(text);
      onChangeText?.(text);

      if (validateOnChange || autoValidate) {
        handleValidation(text);
      }

      // Update character count animation
      if (showCharacterCount && maxLength) {
        const progress = text.length / maxLength;
        characterCountAnimation.value = withTiming(progress, {duration: 200});
      }
    },
    [
      onChangeText,
      validateOnChange,
      autoValidate,
      handleValidation,
      showCharacterCount,
      maxLength,
      characterCountAnimation,
    ],
  );

  // Handle focus
  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      focusAnimationValue.value = withTiming(1, {duration: animationDuration});
      borderAnimation.value = withTiming(1, {duration: animationDuration});

      if (focusAnimation === 'scale') {
        scaleAnimation.value = withSpring(1.02, springConfig);
      } else if (focusAnimation === 'glow') {
        glowAnimation.value = withTiming(1, {duration: animationDuration});
      }

      // Only animate label for floating variant
      if (variant === 'floating') {
        labelAnimation.value = withSpring(1, springConfig);
      }

      onFocus?.(e);
    },
    [
      focusAnimationValue,
      borderAnimation,
      scaleAnimation,
      glowAnimation,
      labelAnimation,
      animationDuration,
      springConfig,
      focusAnimation,
      variant,
      onFocus,
    ],
  );

  // Handle blur
  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      focusAnimationValue.value = withTiming(0, {duration: animationDuration});
      borderAnimation.value = withTiming(0, {duration: animationDuration});
      scaleAnimation.value = withSpring(1, springConfig);
      glowAnimation.value = withTiming(0, {duration: animationDuration});

      // Only animate label for floating variant when no value
      if (variant === 'floating' && !internalValue) {
        labelAnimation.value = withSpring(0, springConfig);
      }

      if (validateOnBlur) {
        handleValidation(internalValue);
      }

      onBlur?.(e);
    },
    [
      focusAnimationValue,
      borderAnimation,
      scaleAnimation,
      glowAnimation,
      labelAnimation,
      animationDuration,
      springConfig,
      internalValue,
      validateOnBlur,
      handleValidation,
      variant,
      onBlur,
    ],
  );

  // Handle clear
  const handleClear = useCallback(() => {
    setInternalValue('');
    onChangeText?.('');
    onClear?.();
    inputRef.current?.focus();
  }, [onChangeText, onClear]);

  // Handle password toggle
  const handlePasswordToggle = useCallback(() => {
    setIsPasswordVisible(!isPasswordVisible);
  }, [isPasswordVisible]);

  // Handle content size change for multiline
  const handleContentSizeChange = useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      if (multiline) {
        setInputHeight(e.nativeEvent.contentSize.height);
      }
      onContentSizeChange?.(e);
    },
    [multiline, onContentSizeChange],
  );

  // Update internal value when prop changes
  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value || '');
      // Only animate floating label
      if (variant === 'floating') {
        if (value) {
          labelAnimation.value = withSpring(1, springConfig);
        } else if (!isFocused) {
          labelAnimation.value = withSpring(0, springConfig);
        }
      }
    }
  }, [value, labelAnimation, springConfig, isFocused, internalValue, variant]);

  // Update error state when prop changes
  useEffect(() => {
    setValidationError(error);
    setIsValid(!error);
    if (error) {
      errorAnimationValue.value = withTiming(1, {duration: animationDuration});
    } else {
      errorAnimationValue.value = withTiming(0, {duration: animationDuration});
    }
  }, [error, errorAnimationValue, animationDuration]);

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const transform = [];

    if (focusAnimation === 'scale') {
      transform.push({scale: scaleAnimation.value});
    }

    if (errorAnimation === 'shake') {
      transform.push({translateX: shakeAnimation.value});
    }

    return {
      transform,
    };
  });

  const borderAnimatedStyle = useAnimatedStyle(() => {
    const borderColorValue = interpolateColor(
      borderAnimation.value,
      [0, 1],
      [
        validationError ? errorColor : borderColor,
        validationError ? errorColor : currentBorderColor,
      ],
    );

    const borderWidth = interpolate(borderAnimation.value, [0, 1], [1, 2]);

    const shadowOpacity =
      focusAnimation === 'glow'
        ? interpolate(glowAnimation.value, [0, 1], [0, 0.3])
        : 0;

    return {
      borderColor: borderColorValue,
      borderWidth,
      shadowColor: currentBorderColor,
      shadowOpacity,
      shadowRadius: interpolate(glowAnimation.value, [0, 1], [0, 8]),
      shadowOffset: {width: 0, height: 0},
      elevation:
        Platform.OS === 'android'
          ? interpolate(glowAnimation.value, [0, 1], [0, 4])
          : 0,
    };
  });

  // Static label style for non-floating variants
  const staticLabelStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        focusAnimationValue.value,
        [0, 1],
        [labelColor, validationError ? errorColor : currentBorderColor],
      ),
    };
  });

  // Floating label animated style
  const floatingLabelAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(labelAnimation.value, [0, 1], [16, -8]);
    const scale = interpolate(labelAnimation.value, [0, 1], [1, 0.85]);

    return {
      transform: [{translateY}, {scale}],
      color: interpolateColor(
        focusAnimationValue.value,
        [0, 1],
        [labelColor, validationError ? errorColor : currentBorderColor],
      ),
    };
  });

  const errorAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: errorAnimationValue.value,
      transform: [
        {
          translateY: interpolate(errorAnimationValue.value, [0, 1], [-10, 0]),
        },
      ],
    };
  });

  const characterCountAnimatedStyle = useAnimatedStyle(() => {
    if (!showCharacterCount || !maxLength) return {};

    const color = interpolateColor(
      characterCountAnimation.value,
      [0, 0.8, 1],
      [labelColor, labelColor, errorColor],
    );

    return {
      color,
    };
  });

  // Get keyboard type
  const getKeyboardType = () => {
    switch (inputType) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      case 'phone':
        return 'phone-pad';
      case 'url':
        return 'url';
      default:
        return 'default';
    }
  };

  // Get secure text entry
  const getSecureTextEntry = () => {
    if (inputType === 'password' || showPasswordToggle) {
      return !isPasswordVisible;
    }
    return false;
  };

  // Render validation icon
  const renderValidationIcon = () => {
    if (
      !showValidationIcon ||
      (!validationError && (isValid || !internalValue))
    )
      return null;

    if (validationError) {
      return <AlertCircle size={20} color={errorColor} />;
    } else if (isValid && internalValue) {
      return <Check size={20} color={successColor} />;
    }

    return null;
  };

  // Render right icon
  const renderRightIcon = () => {
    const icons = [];

    // Validation icon
    if (showValidationIcon) {
      const validationIcon = renderValidationIcon();
      if (validationIcon) {
        icons.push(
          <View key="validation" style={styles.iconContainer}>
            {validationIcon}
          </View>,
        );
      }
    }

    // Clear button
    if (clearable && internalValue) {
      icons.push(
        <BorderlessButton
          key="clear"
          onPress={handleClear}
          style={styles.iconButton}
          rippleColor="transparent">
          <X size={20} color={placeholderColor} />
        </BorderlessButton>,
      );
    }

    // Password toggle
    if ((inputType === 'password' || showPasswordToggle) && internalValue) {
      icons.push(
        <BorderlessButton
          key="password"
          onPress={handlePasswordToggle}
          style={styles.iconButton}
          rippleColor="transparent">
          {isPasswordVisible ? (
            <EyeOff size={20} color={placeholderColor} />
          ) : (
            <Eye size={20} color={placeholderColor} />
          )}
        </BorderlessButton>,
      );
    }

    // Custom right icon
    if (rightIcon) {
      icons.push(
        <BorderlessButton
          key="custom"
          onPress={onRightIconPress}
          style={styles.iconButton}
          rippleColor="transparent">
          {rightIcon}
        </BorderlessButton>,
      );
    }

    return icons.length > 0 ? (
      <View style={styles.rightIconsContainer}>{icons}</View>
    ) : null;
  };

  // Get container style based on variant
  const getContainerStyle = () => {
    const baseStyle = {
      backgroundColor: disabled ? disabledColor : backgroundColor,
    };

    switch (variant) {
      case 'filled':
        return [styles.filledContainer, baseStyle];
      case 'underlined':
        return [styles.underlinedContainer, baseStyle];
      case 'floating':
        return [styles.floatingContainer, baseStyle];
      default:
        return [styles.outlinedContainer, baseStyle];
    }
  };

  return (
    <Animated.View
      style={[styles.wrapper, containerAnimatedStyle, containerStyle]}>
      {/* Static Label for non-floating variants */}
      {label && variant !== 'floating' && (
        <Animated.Text style={[styles.label, staticLabelStyle, labelStyle]}>
          {label}
          {required && (
            <Text style={[styles.required, {color: errorColor}]}> *</Text>
          )}
        </Animated.Text>
      )}

      {/* Input Container */}
      <Animated.View style={[getContainerStyle(), borderAnimatedStyle]}>
        {/* Floating Label */}
        {label && variant === 'floating' && (
          <Animated.Text
            style={[
              styles.floatingLabel,
              floatingLabelAnimatedStyle,
              labelStyle,
            ]}>
            {label}
            {required && (
              <Text style={[styles.required, {color: errorColor}]}> *</Text>
            )}
          </Animated.Text>
        )}

        {/* Left Icon */}
        {leftIcon && (
          <BorderlessButton
            onPress={onLeftIconPress}
            style={styles.leftIconButton}
            rippleColor="transparent">
            {leftIcon}
          </BorderlessButton>
        )}

        {/* Text Input */}
        <AnimatedRNTextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              color: disabled ? disabledColor : textColor,
              height: multiline ? Math.max(40, inputHeight) : 40,
              paddingTop: variant === 'floating' ? 8 : 8,
            },
            inputStyle,
          ]}
          value={internalValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          onContentSizeChange={handleContentSizeChange}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          keyboardType={getKeyboardType()}
          secureTextEntry={getSecureTextEntry()}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoFocus={autoFocus}
          selectTextOnFocus={selectTextOnFocus}
          blurOnSubmit={blurOnSubmit}
          returnKeyType={returnKeyType}
          editable={!disabled}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          testID={testID}
          {...restProps}
        />

        {/* Right Icons */}
        {renderRightIcon()}
      </Animated.View>

      {/* Helper Text / Error / Character Count */}
      <View style={styles.bottomContainer}>
        <View style={styles.helperContainer}>
          {/* Error Text */}
          {validationError && (
            <Animated.Text
              style={[
                styles.errorText,
                {color: errorColor},
                errorAnimatedStyle,
                errorStyle,
              ]}>
              {validationError}
            </Animated.Text>
          )}

          {/* Helper Text */}
          {!validationError && helperText && (
            <Text style={[styles.helperText, {color: labelColor}, helperStyle]}>
              {helperText}
            </Text>
          )}
        </View>

        {/* Character Count */}
        {showCharacterCount && maxLength && (
          <Animated.Text
            style={[styles.characterCount, characterCountAnimatedStyle]}>
            {internalValue.length}/{maxLength}
          </Animated.Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  required: {
    fontSize: 14,
  },
  outlinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  filledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 50,
    borderBottomWidth: 2,
    backgroundColor: '#F5F5F5',
  },
  underlinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    minHeight: 50,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  floatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
    minHeight: 56,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    left: 12,
    top: 16,
    fontSize: 16,
    fontWeight: '400',
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    textAlignVertical: 'top',
    minHeight: 24,
  },
  leftIconButton: {
    marginRight: 8,
    padding: 4,
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginLeft: 8,
    padding: 4,
  },
  iconButton: {
    marginLeft: 8,
    padding: 4,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
    minHeight: 20,
  },
  helperContainer: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  characterCount: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
    lineHeight: 16,
  },
});

export default TextInputComponent;
