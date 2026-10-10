import { useSharedValue, withTiming, runOnUI } from 'react-native-reanimated';
import { useCallback, useImperativeHandle } from 'react';
import type { ProgressButtonRef } from '../types';
import { easingPresets, animationDurations } from '../utils/animations';

export const useProgressAnimation = (
  initialProgress: number = 0,
  animationDuration: number = animationDurations.normal,
  ref?: React.Ref<ProgressButtonRef>
) => {
  const progressValue = useSharedValue(initialProgress);
  const isPressed = useSharedValue(false);
  const scale = useSharedValue(1);

  const setProgressWorklet = (value: number) => {
    'worklet';
    progressValue.value = Math.max(0, Math.min(1, value));
  };

  const animateToProgressWorklet = (value: number, duration?: number) => {
    'worklet';
    progressValue.value = withTiming(
      Math.max(0, Math.min(1, value)), 
      { 
        duration: duration ?? animationDuration,
        easing: easingPresets.easeInOut
      }
    );
  };

  const setProgress = useCallback((value: number) => {
    runOnUI(setProgressWorklet)(value);
  }, []);

  const animateToProgress = useCallback((value: number, duration?: number) => {
    runOnUI(animateToProgressWorklet)(value, duration);
  }, [animationDuration]);

  const reset = useCallback(() => {
    runOnUI(animateToProgressWorklet)(0);
  }, []);

  useImperativeHandle(ref, () => ({
    setProgress,
    animateToProgress,
    reset,
  }));

  return {
    progressValue,
    isPressed,
    scale,
    animateToProgress,
    setProgress,
    reset,
  };
};