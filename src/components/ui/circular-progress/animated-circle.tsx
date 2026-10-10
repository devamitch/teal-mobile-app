import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressCircleProps {
  progress: Animated.SharedValue<number>;
  size: number;
  strokeWidth: number;
  progressColor: string;
  backgroundColor: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size,
  strokeWidth,
  progressColor,
  backgroundColor,
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = useDerivedValue(() => {
    return circumference - (progress.value * circumference);
  });

  const animatedStrokeWidth = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [strokeWidth, strokeWidth + 0.5]);
  });

  const backgroundOpacity = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.1, 1], [1, 0.8, 0.4]);
  });

  const interpolatedProgressColor = useDerivedValue(() => {
    return interpolateColor(
      progress.value,
      [0, 0.5, 1],
      [progressColor, progressColor, '#049299']
    );
  });

  const progressCircleStyle = useAnimatedStyle(() => ({
    strokeDashoffset: strokeDashoffset.value,
    stroke: interpolatedProgressColor.value,
    strokeWidth: animatedStrokeWidth.value,
  }));

  const backgroundCircleStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <AnimatedCircle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
          style={backgroundCircleStyle}
        />
        
        <G rotation="-90" origin={`${centerX}, ${centerY}`}>
          <AnimatedCircle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={progressCircleStyle}
          />
        </G>
      </Svg>
    </View>
  );
};