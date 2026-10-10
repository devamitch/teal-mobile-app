import {ImageRequireSource} from 'react-native';

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string | ImageRequireSource;
}

export interface OnboardingProps {
  slides: OnboardingSlide[];
  onComplete: () => void;
  onSkip?: () => void;
}
