import {Text, View, StyleSheet} from 'react-native';
import Button from '@/components/ui/buttons/button';
import {FONT_FAMILIES, lightTheme} from '@/constants';

interface MensusQuestionCompProps {
  question: string;
  subQuestion?: string;
  answerSet: {text: string; onPress: (ans: string) => void}[];
  conditionFuntion?: (val: string) => boolean;
  isContinueButtonVisible?: boolean;
  onNext?: () => void;
}

const MensusQuestionComp: React.FC<MensusQuestionCompProps> = ({
  question,
  subQuestion,
  answerSet,
  conditionFuntion,
  isContinueButtonVisible,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
        {subQuestion && (
          <Text style={styles.subQuestionText}>{subQuestion}</Text>
        )}
      </View>

      <View style={styles.answersContainer}>
        {answerSet.map((answer, index) => {
          const isSelected = conditionFuntion
            ? conditionFuntion(answer.text)
            : false;
          return (
            <Button
              key={index}
              text={answer.text}
              onPress={() => answer.onPress(answer.text)}
              backgroundColor={isSelected ? lightTheme.primary : 'white'}
              textColor={isSelected ? 'white' : lightTheme.textDark}
              style={[
                styles.answerButton,
                isSelected && styles.selectedButton,
                !isSelected && styles.unselectedButton,
              ]}
              textStyle={styles.answerText}
            />
          );
        })}
      </View>

      {isContinueButtonVisible && (
        <View style={styles.continueContainer}>
          <Button
            text="Continue"
            onPress={onNext || (() => {})}
            backgroundColor={lightTheme.primary}
            textColor="white"
            style={styles.continueButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  questionText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontWeight: 'bold',
    fontSize: 20,
    color: lightTheme.textDark,
    textAlign: 'center',
    lineHeight: 28,
    paddingBottom: 20,
  },
  subQuestionText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontWeight: 'bold',
    fontSize: 16,
    color: lightTheme.textDark,
    textAlign: 'center',
  },
  answersContainer: {
    alignItems: 'center',
  },
  answerButton: {
    width: '100%',
    marginBottom: 15,
    height: 55,
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: lightTheme.primary,
  },
  unselectedButton: {
    borderWidth: 1,
    borderColor: lightTheme.buttonBorder,
  },
  answerText: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  continueContainer: {
    paddingBottom: 20,
  },
  continueButton: {
    width: '100%',
    height: 55,
  },
});

export default MensusQuestionComp;
