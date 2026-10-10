import {Easing} from 'react-native-reanimated';

export const easingPresets = {
  easeInOut: Easing.bezier(0.25, 0.1, 0.25, 1),
  easeOut: Easing.bezier(0, 0, 0.2, 1),
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  spring: Easing.elastic(1.2),
  bounce: Easing.bounce,
};

export const animationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

export const clamp = (value: number, min: number, max: number): number => {
  'worklet';
  return Math.max(min, Math.min(max, value));
};
