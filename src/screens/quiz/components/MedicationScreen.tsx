import { PrimaryButton, SecondaryButton } from '@/components/ui';
import Button from '@/components/ui/buttons/button';
import AlertBox from '@/components/ui/modal/alert-box';
import TextBox from '@/components/ui/text-box/TextBox';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import useAppStore from '@/core/stores';
import {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface MedicationScreenProps {
  questionAndTags: {question: string; id: number; yesTag?: string}[];
  onNext: (val?: boolean) => void;
}

const MedicationScreen: React.FC<MedicationScreenProps> = ({
  questionAndTags,
  onNext,
}) => {
  const {addQuiz} = useAppStore(state => state.engagement);
  const [answers, setAnswers] = useState<string[]>(
    Array(questionAndTags.length).fill(''),
  );
  const [showTextInputs, setShowTextInputs] = useState<boolean[]>(
    Array(questionAndTags.length).fill(false),
  );
  const [showAlert, setShowAlert] = useState(false);

  const handleYesPress = (index: number) => {
    const updatedAnswers = [...answers];
    const updatedTextInputs = [...showTextInputs];
    updatedAnswers[index] = 'Yes';
    updatedTextInputs[index] = true;
    setAnswers(updatedAnswers);
    setShowTextInputs(updatedTextInputs);
  };
  const handleNoPress = (index: number) => {
    const updatedAnswers = [...answers];
    const updatedTextInputs = [...showTextInputs];
    updatedAnswers[index] = 'No';
    updatedTextInputs[index] = false;
    setAnswers(updatedAnswers);
    setShowTextInputs(updatedTextInputs);
  };

  const handleInputChange = (text: string, index: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = text || 'Yes';
    setAnswers(updatedAnswers);
  };

  const onContinue = () => {
    if (answers.includes('')) {
      setShowAlert(true);
    } else {
      questionAndTags.map(({question, id}, index) => {
        const data = {
          id: id,
          question: question,
          answer: answers[index],
        };
        addQuiz(data);
      });
      onNext(
        questionAndTags[0] &&
          questionAndTags[0].id === 17 &&
          answers[0] !== 'No'
          ? true
          : undefined,
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionsContainer}>
        {questionAndTags.map(({question, yesTag}, index) => (
          <View key={index} style={styles.questionGroup}>
            <Text style={styles.questionText}>{question}</Text>

            <View style={styles.answersContainer}>
              <Button
                text="Yes"
                onPress={() => handleYesPress(index)}
                backgroundColor={
                  answers[index] !== 'No' && answers[index] !== ''
                    ? lightTheme.primary
                    : 'white'
                }
                textColor={
                  answers[index] !== 'No' && answers[index] !== ''
                    ? 'white'
                    : lightTheme.textDark
                }
                style={[
                  styles.answerButton,
                  answers[index] !== 'No' && answers[index] !== ''
                    ? styles.selectedButton
                    : styles.unselectedButton,
                ]}
              />
              {showTextInputs[index] && (
                <View style={styles.textInputContainer}>
                  <Text style={styles.specifyLabel}>
                    {yesTag ?? 'Please Specify'}
                  </Text>
                  <TextBox
                    placeholder="Specify here"
                    value={answers[index] === 'Yes' ? '' : answers[index] ?? ''}
                    onChangeText={text => handleInputChange(text, index)}
                    style={styles.textInput}
                    outlineColor={lightTheme.primary}
                  />
                </View>
              )}

              <Button
                text="No"
                onPress={() => handleNoPress(index)}
                backgroundColor={
                  answers[index] === 'No' ? lightTheme.primary : 'white'
                }
                textColor={
                  answers[index] === 'No' ? 'white' : lightTheme.textDark
                }
                style={[
                  styles.answerButton,
                  answers[index] === 'No'
                    ? styles.selectedButton
                    : styles.unselectedButton,
                ]}
              />
            </View>
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          text="Skip"
          onPress={onNext}
          backgroundColor="white"
          textColor={lightTheme.primary}
          style={[styles.actionButton, styles.skipButton]}
        />
        <Button
          text="Continue"
          onPress={onContinue}
          backgroundColor={lightTheme.primary}
          textColor="white"
          style={styles.actionButton}
        />
      </View>
      <AlertBox
        visible={showAlert}
        message="Please answer all the questions"
        onClose={() => setShowAlert(false)}
        title="Error"
        onModalHide={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  questionsContainer: {},
  questionGroup: {
    marginBottom: 30,
  },
  questionText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontWeight: 'bold',
    fontSize: 18,
    color: lightTheme.textDark,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
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
  textInputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  specifyLabel: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.LatoRegular,
    color: lightTheme.textDark,
    marginBottom: 10,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
  },
  buttonContainer: {
    paddingBottom: 20,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  continueButton: {
    width: '40%',
    height: 55,
  },
  actionButton: {
    flex: 1,
    height: 55,
  },
  skipButton: {
    borderWidth: 1,
    borderColor: lightTheme.primary,
  },
});

export default MedicationScreen;
