import {getSafeImage} from '@/constants/images';
import useAppStore from '@/core/stores';
import React from 'react';
import {ImageRequireSource, StatusBar} from 'react-native';
import type {OnboardingSlide} from '../../types';
import OnboardingSlider from './slider';
import { useShallow } from 'zustand/react/shallow';

const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: '"MyTeal" - Your personal cycle tracker',
    description:
      "Take charge with MyTeal. Track your period, ovulation, and understand your body's rhythms.",
    image:
      require('@/assets/images/onboarding/onboarding-one.png') as ImageRequireSource,
  },
  {
    id: '2',
    title: 'Track your cycle and records, all in one spot',
    description:
      'Easily log symptoms, moods, and activities. Track your cycle with a smart, simple calendar.',
    image: getSafeImage('onabording2'),
  },
  {
    id: '3',
    title: 'Empower yourself with knowledge and confidence.',
    description:
      'Explore a wealth of resources on menstrual health, lifestyle, and well-being.',
    image: getSafeImage('onabording3'),
  },
];

const OnboardingSliders: React.FC = () => {
  const app = useAppStore(useShallow(state => state.app));

  const handleComplete = () => {
    try {
      // Save the onboarding completion state
      app?.setIsFirstTimeLaunched?.(false);
    } catch (error) {
      console.log(app);
      console.error(typeof app.setIsFirstTimeLaunched);
      // console.error( error);
    }

    // Navigate to main app
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />
      <OnboardingSlider slides={onboardingSlides} onComplete={handleComplete} />
    </>
  );
};

export default OnboardingSliders;
