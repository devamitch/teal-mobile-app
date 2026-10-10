import {ChevronLeft} from 'lucide-react-native';
import type React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {State, TapGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  useDerivedValue,
  withSpring,
  Extrapolate,
  interpolateColor,
} from 'react-native-reanimated';
import {HapticFeedbackType, triggerHapticFeedback} from '../../utils/haptics';

interface SlidingHeaderProps {
  currentIndex: Animated.SharedValue<number>;
  totalSlides: number;
  onBackPress?: () => void;
  onSkipPress?: () => void;
  enableHaptics?: boolean;
}

export const SlidingHeader: React.FC<SlidingHeaderProps> = ({
  currentIndex,
  totalSlides,
  onBackPress,
  onSkipPress,
  enableHaptics = true,
}) => {
  const backButtonScale = useSharedValue(1);
  const skipButtonScale = useSharedValue(1);
  const skipButtonHovered = useSharedValue(false);

  // Enhanced back button animations with smoother interpolation
  const backButtonOpacity = useDerivedValue(() => {
    return interpolate(
      currentIndex.value,
      [0, 0.2, 0.5],
      [0, 0.7, 1],
      Extrapolate.CLAMP,
    );
  });

  const backButtonTranslateX = useDerivedValue(() => {
    return interpolate(
      currentIndex.value,
      [0, 0.2, 0.5],
      [-40, -15, 0],
      Extrapolate.CLAMP,
    );
  });

  const backButtonScale2 = useDerivedValue(() => {
    return interpolate(
      currentIndex.value,
      [0, 0.2, 0.5],
      [0.7, 0.9, 1],
      Extrapolate.CLAMP,
    );
  });

  // Animated border properties for back button
  const backButtonBorderWidth = useDerivedValue(() => {
    return interpolate(
      currentIndex.value,
      [0, 0.2, 0.5, 1],
      [0, 0.5, 1, 1.5],
      Extrapolate.CLAMP,
    );
  });

  const backButtonBorderColor = useDerivedValue(() => {
    return interpolateColor(
      currentIndex.value,
      [0, 0.2, 0.5, 1],
      ['rgba(65, 65, 66, 0)', 'rgba(65, 65, 66, 0.3)', '#414142', '#414142'],
    );
  });

  const backButtonBackgroundColor = useDerivedValue(() => {
    return interpolateColor(
      currentIndex.value,
      [0, 0.2, 0.5],
      ['rgba(243, 244, 246, 0)', 'rgba(243, 244, 246, 0.5)', '#414142'],
    );
  });

  // FIXED: Skip button animations - ensure it's visible except on last slide
  const skipButtonOpacity = useDerivedValue(() => {
    // Simple approach: only hide on the last slide (when currentIndex is at totalSlides-1)
    const isLastSlide = currentIndex.value >= totalSlides - 1.05;
    return isLastSlide ? 0 : 1;
  });

  // Premium skip button effects
  const skipButtonTranslateY = useDerivedValue(() => {
    // Add a subtle float effect
    return skipButtonHovered.value ? -3 : 0;
  });

  const skipButtonGlow = useDerivedValue(() => {
    // Add glow effect when hovered
    return skipButtonHovered.value ? 0.8 : 0;
  });

  // Skip button background and border animations
  const skipButtonBackgroundColor = useDerivedValue(() => {
    return 'transparent';
  });

  const skipButtonBorderColor = useDerivedValue(() => {
    // Premium border effect
    return interpolateColor(
      skipButtonHovered.value ? 1 : 0,
      [0, 1],
      ['rgba(156, 163, 175, 0.5)', 'rgba(45, 212, 191, 0.7)'],
    );
  });

  // Header background blur effect based on scroll
  const headerBackgroundOpacity = useDerivedValue(() => {
    return interpolate(
      currentIndex.value,
      [0, 0.3, 1],
      [0.95, 0.98, 1],
      Extrapolate.CLAMP,
    );
  });

  // Icon color animation for back button
  const backButtonIconColor = useDerivedValue(() => {
    return interpolateColor(
      currentIndex.value,
      [0, 0.2, 0.5],
      ['#80808050', '#80808080', '#808080'],
    );
  });

  // Skip text color animation - premium effect
  const skipTextColor = useDerivedValue(() => {
    return interpolateColor(
      skipButtonHovered.value ? 1 : 0,
      [0, 1],
      ['#808080', '#049299'],
    );
  });

  const handleBackGesture = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      backButtonScale.value = withSpring(0.92, {damping: 15, stiffness: 400});
    } else if (event.nativeEvent.state === State.END) {
      backButtonScale.value = withSpring(1, {damping: 15, stiffness: 400});
      if (enableHaptics) {
        triggerHapticFeedback(HapticFeedbackType.LIGHT);
      }
      onBackPress?.();
    } else if (
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      backButtonScale.value = withSpring(1, {damping: 15, stiffness: 400});
    }
  };

  const handleSkipGesture = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      skipButtonScale.value = withSpring(0.92, {damping: 15, stiffness: 400});
      skipButtonHovered.value = true;
    } else if (event.nativeEvent.state === State.END) {
      skipButtonScale.value = withSpring(1, {damping: 15, stiffness: 400});
      skipButtonHovered.value = false;
      if (enableHaptics) {
        triggerHapticFeedback(HapticFeedbackType.MEDIUM); // Use MEDIUM for a more noticeable feedback
      }
      onSkipPress?.();
    } else if (
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      skipButtonScale.value = withSpring(1, {damping: 15, stiffness: 400});
      skipButtonHovered.value = false;
    }
  };

  const backButtonStyle = useAnimatedStyle(() => ({
    opacity: withTiming(backButtonOpacity.value, {duration: 200}),
    borderWidth: 0.5,
    borderColor: backButtonBorderColor.value,
    transform: [
      {scale: backButtonScale.value * backButtonScale2.value},
      {
        translateX: withSpring(backButtonTranslateX.value, {
          damping: 25,
          stiffness: 120,
        }),
      },
    ],
  }));

  const skipButtonStyle = useAnimatedStyle(() => ({
    opacity: withTiming(skipButtonOpacity.value, {duration: 200}),
    transform: [
      {scale: skipButtonScale.value},
      {
        translateY: withSpring(skipButtonTranslateY.value, {
          damping: 20,
          stiffness: 200,
        }),
      },
    ],
    elevation: skipButtonHovered.value ? 2 : 0,
  }));

  const skipTextStyle = useAnimatedStyle(() => ({
    color: skipTextColor.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(250, 251, 252, ${headerBackgroundOpacity.value})`,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.leftSection]}>
        <TapGestureHandler onHandlerStateChange={handleBackGesture}>
          <Animated.View
            style={[styles.backButton, backButtonStyle]}
            accessible={true}
            accessibilityLabel="Go back"
            accessibilityHint="Return to previous screen"
            accessibilityRole="button">
            <Animated.View style={{color: backButtonIconColor.value}}>
              <ChevronLeft
                size={24}
                color={backButtonIconColor.value}
                strokeWidth={2}
              />
            </Animated.View>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>

      <Animated.View style={[styles.rightSection]}>
        <TapGestureHandler onHandlerStateChange={handleSkipGesture}>
          <Animated.View
            style={[styles.skipButton, skipButtonStyle]}
            accessible={true}
            accessibilityLabel="Skip"
            accessibilityHint="Skip to the last slide"
            accessibilityRole="button">
            <Animated.Text style={[styles.skipText, skipTextStyle]}>
              Skip
            </Animated.Text>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  leftSection: {
    alignItems: 'flex-start',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#414142',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
