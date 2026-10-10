import {AccessibilityInfo, Platform} from 'react-native';

export const announceForAccessibility = (message: string) => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    AccessibilityInfo.announceForAccessibility(message);
  }
};

export const formatProgressAnnouncement = (progress: number): string => {
  const percentage = Math.round(progress * 100);

  if (percentage === 0) {
    return 'Ready to begin';
  } else if (percentage === 100) {
    return 'Complete';
  } else {
    return `${percentage} percent complete`;
  }
};

export const getAccessibilityValue = (progress: number) => ({
  min: 0,
  max: 100,
  now: Math.round(progress * 100),
  text: formatProgressAnnouncement(progress),
});
