import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';

interface ProgressIndicatorProps {
  progress: Animated.SharedValue<number>;
  showPercentage?: boolean;
  size?: number;
  position?: 'top' | 'bottom' | 'center';
  textColor?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  showPercentage = false,
  size = 12,
  position = 'top',
  textColor = '#1F2937',
}) => {
  const progressPercent = useDerivedValue(() => {
    return Math.round(progress.value * 100);
  });

  const textOpacity = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  });

  const textScale = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.1, 0.5, 0.9, 1], [0.8, 1, 1.1, 1, 0.8]);
  });

  const interpolatedTextColor = useDerivedValue(() => {
    return interpolateColor(
      progress.value,
      [0, 0.5, 1],
      [textColor, '#374151', '#111827']
    );
  });

  const containerOpacity = useDerivedValue(() => {
    return showPercentage ? 1 : 0;
  });

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ scale: textScale.value }],
    color: interpolatedTextColor.value,
    fontSize: size,
    fontWeight: '600',
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return styles.topPosition;
      case 'bottom':
        return styles.bottomPosition;
      case 'center':
        return styles.centerPosition;
      default:
        return styles.topPosition;
    }
  };

  if (!showPercentage) return null;

  return (
    <Animated.View style={[styles.container, getPositionStyle(), containerStyle]}>
      <Animated.Text style={textStyle}>
        {progressPercent.value}%
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  topPosition: {
    top: -30,
    alignSelf: 'center',
  },
  bottomPosition: {
    bottom: -30,
    alignSelf: 'center',
  },
  centerPosition: {
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -6 }],
  },
});