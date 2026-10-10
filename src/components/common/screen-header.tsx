import {ChevronLeft} from 'lucide-react-native';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {State, TapGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {HapticFeedbackType, triggerHapticFeedback} from '../../utils/haptics';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSkipButton?: boolean;
  onBackPress?: () => void;
  onSkipPress?: () => void;
  enableHaptics?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showSkipButton = false,
  onBackPress,
  onSkipPress,
  enableHaptics = true,
}) => {
  const backButtonScale = useSharedValue(1);
  const skipButtonScale = useSharedValue(1);

  const handleBackGesture = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      backButtonScale.value = withTiming(0.95, {duration: 100});
    } else if (event.nativeEvent.state === State.END) {
      backButtonScale.value = withTiming(1, {duration: 200});
      if (enableHaptics) {
        triggerHapticFeedback(HapticFeedbackType.LIGHT);
      }
      onBackPress?.();
    } else if (
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      backButtonScale.value = withTiming(1, {duration: 200});
    }
  };

  const handleSkipGesture = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      skipButtonScale.value = withTiming(0.95, {duration: 100});
    } else if (event.nativeEvent.state === State.END) {
      skipButtonScale.value = withTiming(1, {duration: 200});
      if (enableHaptics) {
        triggerHapticFeedback(HapticFeedbackType.LIGHT);
      }
      onSkipPress?.();
    } else if (
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      skipButtonScale.value = withTiming(1, {duration: 200});
    }
  };

  const backButtonStyle = useAnimatedStyle(() => ({
    transform: [{scale: backButtonScale.value}],
  }));

  const skipButtonStyle = useAnimatedStyle(() => ({
    transform: [{scale: skipButtonScale.value}],
  }));

  return (
    <View
      style={[
        styles.container,
        {paddingTop: Platform.OS === 'android' ? 40 : 10},
      ]}>
      <View style={styles.leftSection}>
        {showBackButton ? (
          <TapGestureHandler onHandlerStateChange={handleBackGesture}>
            <Animated.View
              style={[styles.backButton, backButtonStyle]}
              accessible={true}
              accessibilityLabel="Go back"
              accessibilityHint="Return to previous screen"
              accessibilityRole="button">
              <ChevronLeft size={24} color="#6B7280" strokeWidth={2} />
            </Animated.View>
          </TapGestureHandler>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <View style={styles.centerSection}>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>

      <View style={styles.rightSection}>
        {showSkipButton && (
          <TapGestureHandler onHandlerStateChange={handleSkipGesture}>
            <Animated.View
              style={[styles.skipButton, skipButtonStyle]}
              accessible={true}
              accessibilityLabel="Skip"
              accessibilityHint="Skip current flow"
              accessibilityRole="button">
              <Text style={styles.skipText}>Skip</Text>
            </Animated.View>
          </TapGestureHandler>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
});
