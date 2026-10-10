import React from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { ChevronRight, Check } from 'lucide-react-native';

interface AnimatedIconProps {
  progress: Animated.SharedValue<number>;
  isPressed: Animated.SharedValue<boolean>;
  iconColor: string;
  size?: number;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  progress,
  isPressed,
  iconColor,
  size = 24,
}) => {
  const iconScale = useDerivedValue(() => {
    const pressScale = isPressed.value ? 0.85 : 1;
    const progressScale = interpolate(progress.value, [0, 0.5, 1], [1, 1.05, 1.1]);
    return pressScale * progressScale;
  });

  const chevronOpacity = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.8, 1], [1, 0.3, 0]);
  });

  const checkOpacity = useDerivedValue(() => {
    return interpolate(progress.value, [0.8, 1], [0, 1]);
  });

  const checkScale = useDerivedValue(() => {
    return interpolate(progress.value, [0.8, 0.9, 1], [0.5, 1.2, 1]);
  });

  const interpolatedIconColor = useDerivedValue(() => {
    return interpolateColor(
      progress.value,
      [0, 0.5, 1],
      [iconColor, iconColor, '#049299']
    );
  });

  const chevronStyle = useAnimatedStyle(() => ({
    opacity: chevronOpacity.value,
    transform: [{ scale: iconScale.value }],
    position: 'absolute',
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
    position: 'absolute',
  }));

  const containerStyle = useAnimatedStyle(() => ({
    justifyContent: 'center',
    alignItems: 'center',
  }));

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={chevronStyle}>
        <ChevronRight 
          size={size} 
          color={interpolatedIconColor.value} 
          strokeWidth={2.5}
        />
      </Animated.View>
      <Animated.View style={checkStyle}>
        <Check 
          size={size} 
          color={interpolatedIconColor.value} 
          strokeWidth={3}
        />
      </Animated.View>
    </Animated.View>
  );
};