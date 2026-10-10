import {IMAGES, lightTheme} from '@/constants';
import {StyleSheet, Image, Dimensions, Text, ScrollView} from 'react-native';
import FONT_FAMILIES from '@/constants/fonts';
import {PrimaryButton} from '@/components/ui';

const {width: screenWidth} = Dimensions.get('screen');

const Disclaimer = ({navigation}: any) => {
  return (
    <ScrollView style={styles.container}>
      <Text
        style={{
          fontFamily: FONT_FAMILIES.YoungSerifRegular,
          fontSize: 24,
          alignSelf: 'center',
          paddingTop: 100,
          marginBottom: '20%',
          textAlign: 'center',
        }}>
        Successfully created and verified your account
      </Text>
      <Text
        style={[
          styles.progressText,
          {alignSelf: 'center', marginTop: -60, marginBottom: 40},
        ]}>
        Let’s set things up
      </Text>
      <Image
        source={IMAGES.womenTinking}
        style={{
          height: screenWidth * 0.8,
          width: screenWidth * 0.8,
          marginBottom: '20%',
          alignSelf: 'center',
        }}
      />
      <Text
        style={[
          styles.progressText,
          {alignSelf: 'center', marginTop: -60, marginBottom: 40},
        ]}>
        Hi there! We’ll ask you a few quick questions to personalize the app for you. You can skip any of them, but answering will give you the best experience. Don’t worry—your information will always stay private and secure.
      </Text>
      <PrimaryButton
        text={'Start Onboarding'}
        style={{marginBottom: 20}}
        onPress={() => navigation.navigate('OnBoardingQuiz')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressText: {
    color: lightTheme.textMild,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.LatoRegular,
    justifyContent: 'center',
    paddingHorizontal: 30,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Disclaimer;
