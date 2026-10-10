import React from 'react';
import {Platform} from 'react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  announceForAccessibility,
  formatProgressAnnouncement,
} from '../../../utils/accessibility';
import {
  HapticFeedbackType,
  triggerHapticFeedback,
} from '../../../utils/haptics';
import {AnimatedIcon} from './animated-icon';

interface InnerButtonProps {
  isPressed: Animated.SharedValue<boolean>;
  progress: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
  size: number;
  strokeWidth: number;
  buttonColor: string;
  iconColor: string;
  onPress: () => void;
  disabled: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
  enableHaptics: boolean;
}

export const InnerButton: React.FC<InnerButtonProps> = ({
  isPressed,
  progress,
  scale,
  size,
  strokeWidth,
  buttonColor,
  iconColor,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  enableHaptics,
}) => {
  const innerButtonSize = size - strokeWidth * 2 - 10;

  const buttonScale = useDerivedValue(() => {
    const pressScale = scale.value;
    const progressScale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 1.02, 1.05],
    );
    const disabledScale = disabled ? 0.95 : 1;
    return pressScale * progressScale * disabledScale;
  });

  const shadowElevation = useDerivedValue(() => {
    if (disabled) return 1;
    return interpolate(progress.value, [0, 1], [3, 6]);
  });

  const shadowOffset = useDerivedValue(() => {
    if (disabled) return 1;
    return interpolate(progress.value, [0, 1], [2, 4]);
  });

  const borderRadius = useDerivedValue(() => {
    return innerButtonSize / 2;
  });

  const interpolatedButtonColor = useDerivedValue(() => {
    return interpolateColor(
      progress.value,
      [0, 0.3, 0.7, 1],
      [buttonColor, '#B4DEE0', '#B4DEE0', '#B4DEE0'],
    );
  });

  const interpolatedShadowColor = useDerivedValue(() => {
    return interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(0, 0, 0, 0.1)', 'rgba(20, 184, 166, 0.25)'],
    );
  });

  const buttonOpacity = useDerivedValue(() => {
    return disabled ? 0.6 : 1;
  });

  const handlePress = () => {
    if (enableHaptics) {
      const feedbackType =
        progress.value >= 1
          ? HapticFeedbackType.SUCCESS
          : HapticFeedbackType.LIGHT;
      triggerHapticFeedback(feedbackType);
    }

    const announcement = formatProgressAnnouncement(progress.value);
    announceForAccessibility(announcement);

    onPress();
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      if (disabled) return;
      isPressed.value = true;
      scale.value = withTiming(0.95, {duration: 100});
    },
    onEnd: () => {
      if (disabled) return;
      isPressed.value = false;
      scale.value = withTiming(1, {duration: 200});
      runOnJS(handlePress)();
    },
    onCancel: () => {
      if (disabled) return;
      isPressed.value = false;
      scale.value = withTiming(1, {duration: 200});
    },
    onFail: () => {
      if (disabled) return;
      isPressed.value = false;
      scale.value = withTiming(1, {duration: 200});
    },
  });

  const buttonStyle = useAnimatedStyle(() => ({
    width: innerButtonSize,
    height: innerButtonSize,
    borderRadius: borderRadius.value,
    backgroundColor: interpolatedButtonColor.value,
    opacity: buttonOpacity.value,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{scale: buttonScale.value}],
    position: 'absolute',
  }));

  const iosShadowStyle = useAnimatedStyle(() => ({
    shadowColor: interpolatedShadowColor.value,
    shadowOffset: {
      width: 0,
      height: shadowOffset.value,
    },
    shadowOpacity: 0.25,
    shadowRadius: shadowElevation.value,
  }));

  const androidElevationStyle = useAnimatedStyle(() => ({
    elevation: 0,
  }));

  const progressPercent = useDerivedValue(() => {
    return Math.round(progress.value * 100);
  });

  const combinedStyle = [
    buttonStyle,
    Platform.OS === 'ios' ? iosShadowStyle : androidElevationStyle,
  ];

  return (
    <TapGestureHandler onGestureEvent={gestureHandler} enabled={!disabled}>
      <Animated.View
        style={combinedStyle}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled,
          busy: progress.value < 1 && progress.value > 0,
        }}
        accessibilityValue={{
          min: 0,
          max: 100,
          now: progressPercent.value,
          text: formatProgressAnnouncement(progress.value),
        }}>
        <AnimatedIcon
          progress={progress}
          isPressed={isPressed}
          iconColor={iconColor}
          size={18}
        />
      </Animated.View>
    </TapGestureHandler>
  );
};
