import Button from '@/components/ui/buttons/button';
import AlertBox from '@/components/ui/modal/alert-box';
import {FONT_FAMILIES, lightTheme, emojiFilledType} from '@/constants';
import useAppStore from '@/core/stores';
import {useState} from 'react';
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Emoji1 from '../../../assets/images/emoji/e1.svg';
import Emoji3 from '../../../assets/images/emoji/e3.svg';
import Emoji4 from '../../../assets/images/emoji/e4.svg';
import Emoji5 from '../../../assets/images/emoji/e5.svg';
import Emoji6 from '../../../assets/images/emoji/e6.svg';
import { PrimaryButton, SecondaryButton } from '@/components/ui';

interface MentalHealthSymptomTwoProps {
  onNext: () => void;
}

const moodEmojis = [
  {type: 'svg', Component: Emoji1, value: 1},
  {type: 'image', source: emojiFilledType.emoji_e2, value: 2},
  {type: 'svg', Component: Emoji3, value: 3},
  {type: 'svg', Component: Emoji4, value: 4},
  {type: 'svg', Component: Emoji5, value: 5},
  {type: 'svg', Component: Emoji6, value: 6},
];

const renderEmoji = (item: any) => {
  if (item.type === 'svg') {
    const Component = item.Component;
    return <Component width={width * 0.1} height={width * 0.1} />;
  }
  return (
    <Image
      source={item.source}
      style={{width: width * 0.1, height: width * 0.1}}
      resizeMode="contain"
    />
  );
};

const {width} = Dimensions.get('screen');

const MentalHealthSymptomTwo: React.FC<MentalHealthSymptomTwoProps> = ({
  onNext,
}) => {
  const {addQuiz} = useAppStore(state => state.engagement);

  const [emoValue, setValue] = useState(0);

  // Alert box states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const onContinue = () => {
    if (emoValue) {
      const emoValData = {
        id: 13,
        question: `How bad do your symptoms get? (rate out of 6)`,
        answer: emoValue,
      };
      addQuiz(emoValData);
      onNext();
    } else {
      showAlert('Error', 'Please select all the answers.');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>How bad do your symptoms get?</Text>

          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>I feel miserable</Text>
            <Text style={styles.scaleLabel}>I'm ok</Text>
          </View>

          <View style={styles.emojiContainer}>
            {moodEmojis.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setValue(emoji.value)}
                style={[
                  styles.emojiButton,
                  emoji.value === emoValue && styles.selectedEmoji,
                ]}>
                {renderEmoji(emoji)}
              </TouchableOpacity>
            ))}
          </View>
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
    marginBottom: 40,
  },
  questionText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontWeight: 'bold',
    fontSize: 20,
    color: lightTheme.textDark,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scaleLabel: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.LatoRegular,
    color: lightTheme.textMild,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  emojiButton: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 10,
  },
  selectedEmoji: {
    backgroundColor: lightTheme.primaryLight,
  },
  emojiImage: {
    width: width * 0.1,
    height: width * 0.1,
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
  buttonContainer: {
    justifyContent: 'space-around',
    paddingBottom: 20,
    flexDirection: 'row',
    width: '100%',
    gap: 10,
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

export default MentalHealthSymptomTwo;
