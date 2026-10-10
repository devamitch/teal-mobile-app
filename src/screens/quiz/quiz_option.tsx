import {IMAGES, lightTheme} from '@/constants';
import {View, StyleSheet, Image, Dimensions, Text} from 'react-native';
import FONT_FAMILIES from '@/constants/fonts';
import {PrimaryButton} from '@/components/ui';
import useAppStore from '@/core/stores';
import {useShallow} from 'zustand/react/shallow';
import BackButton from '@/components/ui/buttons/back-button';

const {width: screenWidth} = Dimensions.get('screen');

const QuizOption = ({navigation}: any) => {
  const {getQuizWithID} = useAppStore(state => state.engagement);
  const {quiz} = useAppStore(useShallow(state => state.engagement));
  const isCompleted = getQuizWithID(24) !== undefined;

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} style={{top: 60}} />
      <Text
        style={{
          fontFamily: FONT_FAMILIES.YoungSerifRegular,
          fontSize: 24,
          alignSelf: 'center',
          paddingTop: '20',
          marginBottom: '20%',
        }}>
        Onboarding
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
          marginBottom: '30%',
          alignSelf: 'center',
        }}
      />
      <PrimaryButton
        text={isCompleted ? 'Retake Onboarding Questions' : 'Start Onboarding'}
        style={{marginBottom: 20}}
        onPress={() => navigation.navigate('Quiz')}
      />
      {quiz.length !== 0 && (
        <PrimaryButton
          text="Review & Edit"
          onPress={() => navigation.navigate('EditQuiz')}
        />
      )}
    </View>
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
    color: lightTheme.textLight,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.LatoRegular,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuizOption;
