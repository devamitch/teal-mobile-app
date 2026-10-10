'use client';

import FONT_FAMILIES from '@/constants/fonts';
import type React from 'react';
import {useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  BorderlessButton,
  RectButton,
  type BaseButtonProps,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Extend the base button props from gesture handler
export interface ButtonProps extends Omit<BaseButtonProps, 'onPress'> {
  text?: React.ReactNode | string;
  onPress?:
    | ((pointerInside?: boolean) => void | Promise<void>)
    | (() => void | Promise<void>);
  variant?: 'rect' | 'borderless';
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';

  // RectButton specific props
  underlayColor?: string;
  activeOpacity?: number;

  // BorderlessButton specific props
  borderless?: boolean;

  // Animation props
  pressAnimationScale?: number;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };

  // Loading props
  loadingText?: string;
  showLoadingText?: boolean;

  showShadow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onPress,
  variant = 'rect',
  backgroundColor = '#049299',
  textColor = 'white',
  disabled = false,
  loading = false,
  loadingColor = 'white',
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  underlayColor,
  activeOpacity = 0.8,
  borderless = true,
  pressAnimationScale = 0.97,
  springConfig = {
    damping: 10,
    stiffness: 100,
    mass: 0.5,
  },
  loadingText = 'Loading...',
  showLoadingText = false,
  rippleColor,
  exclusive = true,
  delayLongPress = 600,
  showShadow = true,
  onActiveStateChange,
  onLongPress,
  ...restProps
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const loadingOpacity = useSharedValue(0);

  // Handle button press
  const handlePress = async () => {
    if (!disabled && !loading) {
      try {
        await onPress?.();
      } catch (error) {
        console.error('Button press error:', error);
      }
    }
  };

  // Handle active state change with animation
  const handleActiveStateChange = (active: boolean) => {
    if (disabled || loading) return;

    scale.value = withSpring(active ? pressAnimationScale : 1, springConfig);

    // Call original onActiveStateChange if provided
    if (onActiveStateChange) {
      runOnJS(onActiveStateChange)(active);
    }
  };

  // Handle loading state changes
  useEffect(() => {
    opacity.value = withTiming(disabled ? 0.6 : 1, {duration: 200});
    loadingOpacity.value = withTiming(loading ? 1 : 0, {duration: 300});
  }, [disabled, loading, opacity, loadingOpacity]);

  // Button animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
      opacity: opacity.value,
    };
  });

  // Loading overlay animated style
  const loadingOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: loadingOpacity.value,
      transform: [
        {
          scale: interpolate(loadingOpacity.value, [0, 1], [0.8, 1]),
        },
      ],
    };
  });

  // Content animated style
  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(loadingOpacity.value, [0, 1], [1, 0]),
    };
  });

  // Common button content
  const renderContent = () => (
    <>
      <Animated.View style={[styles.contentContainer, contentStyle]}>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>{icon}</View>
        )}
        <Text style={[styles.text, {color: textColor}, textStyle]}>{text}</Text>
        {icon && iconPosition === 'right' && (
          <View style={styles.iconRight}>{icon}</View>
        )}
      </Animated.View>

      {/* Loading overlay */}
      <Animated.View
        style={[styles.loadingOverlay, loadingOverlayStyle]}
        pointerEvents="none">
        <ActivityIndicator color={loadingColor} size="small" />
        {showLoadingText && (
          <Text style={[styles.loadingText, {color: textColor}, textStyle]}>
            {loadingText}
          </Text>
        )}
      </Animated.View>
    </>
  );

  // Common button props
  const commonProps = {
    onPress: handlePress,
    onActiveStateChange: handleActiveStateChange,
    onLongPress,
    exclusive,
    delayLongPress,
    enabled: !disabled && !loading,
    rippleColor:
      rippleColor ||
      (variant === 'rect' ? 'rgba(255, 255, 255, 0.3)' : undefined),
    ...restProps,
  };

  // Render based on variant
  if (variant === 'borderless') {
    return (
      <BorderlessButton
        {...commonProps}
        borderless={borderless}
        activeOpacity={activeOpacity}
        style={[styles.button, showShadow && styles.shadow, {backgroundColor}, style]}>
        <Animated.View style={[styles.buttonContent, animatedStyle]}>
          <View accessible accessibilityRole="button">
            {renderContent()}
          </View>
        </Animated.View>
      </BorderlessButton>
    );
  }

  // Default to RectButton
  return (
    <RectButton
      {...commonProps}
      underlayColor={underlayColor || backgroundColor}
      activeOpacity={activeOpacity}
      style={[styles.button, showShadow && styles.shadow, {backgroundColor}, style]}>
      <Animated.View style={[styles.buttonContent, animatedStyle]}>
        <View accessible accessibilityRole="button">
          {renderContent()}
        </View>
      </Animated.View>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    height: 50,
    width: '90%',
    alignSelf: 'center',
    overflow: 'hidden',
    elevation: 3,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.LatoRegular,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
});

export default Button;
