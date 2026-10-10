'use client';
import FONT_FAMILIES from '@/constants/fonts';
import type React from 'react';
import {
  useRef,
  useState, // Added useState
} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate, // Added useAnimatedReaction
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {OnboardingSlide} from '../../types';
import {HapticFeedbackType, triggerHapticFeedback} from '../../utils/haptics';
import ProgressHeader from '../common/headers/ProgressHeader';
import CircularProgressButton from '../ui/circular-progress/circular-progress-button';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface OnboardingSliderProps {
  slides: OnboardingSlide[];
  onComplete: () => void;
}

const OnboardingSlider: React.FC<OnboardingSliderProps> = ({
  slides,
  onComplete,
}) => {
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const currentIndex = useSharedValue(0); // This is 0-indexed (0, 1, 2 for 3 slides)
  const isAnimatingToLastSlide = useSharedValue(false);

  // State for the 1-indexed step number for ProgressHeader
  const [displayStep, setDisplayStep] = useState(
    Math.round(currentIndex.value) + 1,
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
      currentIndex.value = event.contentOffset.x / SCREEN_WIDTH;
    },
    // Optional: onMomentumEnd to ensure final value is set if needed,
    // but reaction to currentIndex.value should cover it.
  });

  // React to changes in currentIndex.value and update displayStep
  useAnimatedReaction(
    () => {
      // Calculate the 1-indexed step.
      // currentIndex.value can be a float during scroll, Math.round handles this.
      return Math.round(currentIndex.value) + 1;
    },
    (currentCalculatedStep, previousCalculatedStep) => {
      // Only update state if the calculated step has actually changed.
      if (currentCalculatedStep !== previousCalculatedStep) {
        runOnJS(setDisplayStep)(currentCalculatedStep);
      }
    },
    [currentIndex], // Dependency: re-run when currentIndex shared value changes
  );

  // Calculate progress based on scroll position with smooth interpolation
  const progress = useDerivedValue(() => {
    return interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH * (slides.length - 1)],
      [0, 1],
      Extrapolate.CLAMP,
    );
  });

  // Enhanced progress indicator with spring animation
  const progressIndicatorStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH * (slides.length - 1)],
      [SCREEN_WIDTH / slides.length / 3, SCREEN_WIDTH / 3],
      Extrapolate.CLAMP,
    );
    return {
      width: withSpring(width, {
        damping: 20,
        stiffness: 100,
      }),
    };
  });

  // Slide content animations based on scroll position
  const getSlideAnimationStyle = (index: number) => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const slideAnimationStyle = useAnimatedStyle(() => {
      const imageScale = interpolate(
        scrollX.value,
        inputRange,
        [0.9, 1, 0.9],
        Extrapolate.CLAMP,
      );
      const imageOpacity = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP,
      );
      const imageTranslateY = interpolate(
        scrollX.value,
        inputRange,
        [50, 0, -50],
        Extrapolate.CLAMP,
      );

      return {
        transform: [{scale: imageScale}, {translateY: imageTranslateY}],
        opacity: imageOpacity,
      };
    });
    return slideAnimationStyle;
  };

  const getContentAnimationStyle = (index: number) => {
    const contentAnimationStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ];

      const contentOpacity = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP,
      );
      const contentTranslateY = interpolate(
        scrollX.value,
        inputRange,
        [30, 0, -30],
        Extrapolate.CLAMP,
      );

      return {
        opacity: withTiming(contentOpacity, {duration: 300}),
        transform: [{translateY: contentTranslateY}],
      };
    });
    return contentAnimationStyle;
  };

  const handleNext = () => {
    const nextIndex = Math.min(
      Math.round(currentIndex.value) + 1,
      slides.length - 1,
    );

    if (nextIndex === slides.length - 1 && progress.value >= 0.9) {
      onComplete();
      return;
    }

    scrollViewRef.current?.scrollTo({
      x: nextIndex * SCREEN_WIDTH,
      animated: true,
    });
  };

  const handleBack = () => {
    const prevIndex = Math.max(Math.round(currentIndex.value) - 1, 0);
    scrollViewRef.current?.scrollTo({
      x: prevIndex * SCREEN_WIDTH,
      animated: true,
    });
  };

  const handleSkip = () => {
    triggerHapticFeedback(HapticFeedbackType.MEDIUM);
    isAnimatingToLastSlide.value = true;
    const lastSlideIndex = slides.length - 1;
    scrollViewRef.current?.scrollTo({
      x: lastSlideIndex * SCREEN_WIDTH,
      animated: true,
    });
    setTimeout(() => {
      isAnimatingToLastSlide.value = false;
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ProgressHeader
        currentStep={displayStep} // Use the numeric state variable
        totalSteps={slides.length}
        onBackPress={handleBack}
        onSkipPress={handleSkip}
        showProgressBar={false}
        onExit={() => {
          console.log('Exiting onboarding');
          onComplete();
        }}
        hideBackButtonOnFirstStep={true}
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        bounces={false}
        style={styles.scrollView}>
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <Animated.View
              style={[styles.imageContainer, getSlideAnimationStyle(index)]}>
              <Image
                source={slide.image}
                style={styles.image}
                accessibilityLabel={`Illustration for ${slide.title}`}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.contentContainer,
                getContentAnimationStyle(index),
              ]}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </Animated.View>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.bottomSection}>
        <CircularProgressButton
          progress={progress}
          onPress={handleNext}
          size={80}
          buttonSize={56}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: 24,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 280,
    height: 280,
    resizeMode: 'contain',
  },
  contentContainer: {
    paddingBottom: 140,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#232323',
    lineHeight: 36,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#414142',
    lineHeight: 24,
    fontWeight: '400',
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
  },
});

export default OnboardingSlider;
