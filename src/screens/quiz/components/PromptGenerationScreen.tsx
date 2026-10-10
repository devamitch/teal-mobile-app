import {FONT_FAMILIES, lightTheme} from '@/constants';
import LottieAnimations from '@/constants/lottie-animations';
import LottieView from 'lottie-react-native';
import {useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

const {width} = Dimensions.get('screen');

interface PromptGenProps {
  onCompletion: () => void;
}

const PromptGenScreen: React.FC<PromptGenProps> = ({onCompletion}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onCompletion();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onCompletion]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <LottieView
          source={LottieAnimations.loading}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.titleText}>You're all set!</Text>
        <Text style={styles.descriptionText}>
          We are customizing the app for you based on your responses...
        </Text>
        <View style={styles.progressIndicator}>
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 30,
  },
  titleText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontWeight: 'bold',
    fontSize: 28,
    color: lightTheme.textDark,
    textAlign: 'center',
    marginBottom: 15,
  },
  descriptionText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontSize: 16,
    color: lightTheme.textMild,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightTheme.primary,
    marginHorizontal: 4,
    opacity: 0.6,
  },
});

export default PromptGenScreen;
