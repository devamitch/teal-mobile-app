import {Platform, Vibration} from 'react-native';

export enum HapticFeedbackType {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
  SUCCESS = 'success',
}

export const triggerHapticFeedback = (
  type: HapticFeedbackType = HapticFeedbackType.LIGHT,
) => {
  if (Platform.OS === 'android') {
    const duration = getAndroidVibrationDuration(type);
    Vibration.vibrate(duration);
  }
  // iOS haptic feedback would be implemented here with proper native modules
};

const getAndroidVibrationDuration = (type: HapticFeedbackType): number => {
  switch (type) {
    case HapticFeedbackType.LIGHT:
      return 25;
    case HapticFeedbackType.MEDIUM:
      return 50;
    case HapticFeedbackType.HEAVY:
      return 75;
    case HapticFeedbackType.SUCCESS:
      return 100;
    default:
      return 50;
  }
};
