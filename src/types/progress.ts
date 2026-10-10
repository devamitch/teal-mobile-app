// Core types for the progress button
export interface ProgressButtonProps {
  progress?: number;
  size?: number;
  strokeWidth?: number;
  onPress?: () => void;
  animationDuration?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  enableHaptics?: boolean;
  disabled?: boolean;
  showPercentage?: boolean;
  progressColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  iconColor?: string;
}

export interface ProgressButtonRef {
  setProgress: (value: number) => void;
  animateToProgress: (value: number, duration?: number) => void;
  reset: () => void;
}

export interface AnimationConfig {
  duration: number;
  easing: any;
}
