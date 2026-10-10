import BackButton from '@/components/ui/buttons/back-button';
import {lightTheme} from '@/constants/colors';
import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const Color = lightTheme;

const ProgressHeader = ({
  currentStep,
  totalSteps,
  onBackPress,
  onExit,
  onSkipPress,
  progressBarColor = Color.gradientMiddle,
  skipButtonColor = '#808080',
  showProgressBar = true,
  hideBackButtonOnFirstStep = false,
  showSkipButton = true,
  showBackButton = true,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  const shouldShowBackButtonForNav = currentStep > 1;
  const shouldShowExitButtonOnFirstStep =
    currentStep <= 1 && !hideBackButtonOnFirstStep;

  // Track button animation
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    // Animate button visibility
    animationProgress.value = withTiming(
      shouldShowBackButtonForNav || shouldShowExitButtonOnFirstStep ? 1 : 0,
      {duration: 300},
    );
  }, [
    shouldShowBackButtonForNav,
    shouldShowExitButtonOnFirstStep,
    animationProgress,
  ]);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: animationProgress.value,
      transform: [
        {
          translateX: interpolate(animationProgress.value, [0, 1], [-30, 0]),
        },
      ],
      // Keep this view in the layout even when opacity is 0
      position: 'absolute',
      left: 0,
      top: 0,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {/* Button container that's always present */}
        <View style={styles.buttonWrapper}>
          {/* Back button for navigation (step > 1) */}
          {showBackButton ? <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
            <BackButton
              onPress={shouldShowBackButtonForNav ? onBackPress : onExit}
            />
          </Animated.View> : null}

          {/* Space placeholder to maintain layout */}
          <View style={styles.backButtonPlaceholder} />
        </View>

        {showProgressBar && (
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressFill,
                {width: `${progress}%`, backgroundColor: progressBarColor},
              ]}
            />
          </View>
        )}

        {showSkipButton && (
          <TouchableOpacity onPress={onSkipPress}>
            <Text style={[styles.skipText, {color: skipButtonColor}]}>
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  buttonContainer: {
    width: 40,
    height: 40,
    zIndex: 2,
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProgressHeader;
