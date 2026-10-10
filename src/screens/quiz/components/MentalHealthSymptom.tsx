import Button from '@/components/ui/buttons/button';
import AlertBox from '@/components/ui/modal/alert-box';
import TextBox from '@/components/ui/text-box/TextBox';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import useAppStore from '@/core/stores';
import {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface MentalHealthSymptomProps {
  onNext: () => void;
}

const MentalHealthSymptom: React.FC<MentalHealthSymptomProps> = ({onNext}) => {
  const {addQuiz} = useAppStore(state => state.engagement);

  const [answers, setAnswers] = useState<string[]>([]);
  const [isTextBoxVisible, setTextBoxVisible] = useState(false);
  const [other, setOther] = useState('');

  // Alert box states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const answerSet = [
    {
      text: 'Sadness or Depression',
      onPress: (text: string) => {
        onSelectMultipleChoice(text);
      },
    },
    {
      text: 'Anxiety',
      onPress: (text: string) => {
        onSelectMultipleChoice(text);
      },
    },
    {
      text: 'Sudden sadness or tearfulness or mood swings',
      onPress: (text: string) => {
        onSelectMultipleChoice(text);
      },
    },
    {
      text: 'Anger or irritability',
      onPress: (text: string) => {
        onSelectMultipleChoice(text);
      },
    },
    {
      text: 'None',
      onPress: () => {
        setAnswers(['None']);
      },
    },
    {
      text: 'Other',
      onPress: () => {
        setTextBoxVisible(!isTextBoxVisible);
        setOther('');
        setAnswers(prevList => prevList.filter(item => item !== 'None'));
      },
    },
  ];

  const onSelectMultipleChoice = (ans: string) => {
    setAnswers(prevList =>
      prevList.includes(ans)
        ? prevList.filter(item => item !== ans)
        : [...prevList.filter(item => item !== 'None'), ans],
    );
  };

  const onContinue = () => {
    if (answers.length > 0 || (isTextBoxVisible && other.trim())) {
      const finalAnswers = [...answers];
      if (other.trim()) {
        finalAnswers.push(other);
      }

      const data = {
        id: 10,
        question: `Which of the following mental health symptoms bother you the most in the weeks leading up to your period?`,
        answer: finalAnswers,
      };
      addQuiz(data);
      onNext();
    } else {
      showAlert('Error', 'Please answer the question');
    }
  };

  const onSkip = () => {
    const data = {
      id: 10,
      question: `Which of the following mental health symptoms bother you the most in the weeks leading up to your period?`,
      answer: ['Skipped'],
    };
    addQuiz(data);
    onNext();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            Which of the following mental health symptoms bother you the most in
            the weeks leading up to your period?
          </Text>
          <Text style={[styles.questionText, {fontSize: 18, paddingTop: 30}]}>
            Select all that apply
          </Text>
        </View>

        <View style={styles.answersContainer}>
          {answerSet.map((answer, index) => {
            const isSelected =
              answer.text !== 'Other'
                ? answers.includes(answer.text)
                : isTextBoxVisible;
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

          {isTextBoxVisible && (
            <TextBox
              placeholder="Enter your symptom here"
              value={other}
              onChangeText={setOther}
              style={styles.textInput}
              outlineColor={lightTheme.primary}
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            text="Skip"
            onPress={onSkip}
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
      </View>

      <AlertBox
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onModalHide={() => {}}
      />
    </>
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
  textInput: {
    backgroundColor: 'white',
    marginTop: 15,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingBottom: 20,
    gap: 15,
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

export default MentalHealthSymptom;
