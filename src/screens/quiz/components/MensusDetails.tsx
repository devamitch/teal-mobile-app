import Button from '@/components/ui/buttons/button';
import AlertBox from '@/components/ui/modal/alert-box';
import {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import Feather from 'react-native-vector-icons/Feather';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import useAppStore from '@/core/stores';

interface MensusDetailsProps {
  onNext?: () => void;
  isRegular?: boolean;
}

const MensusDetails: React.FC<MensusDetailsProps> = ({onNext, isRegular}) => {
  const {addQuiz} = useAppStore(state => state.engagement);

  const [noOfDays, setNoOfDays] = useState<number>();
  // Alert box states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState<(() => void) | null>(null);

  const datesList = Array.from({length: 30}, (_, i) => ({
    key: i + 21,
    value: `${i + 21}`,
  }));

  const showAlert = (title: string, message: string, action?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertAction(() => action);
    setAlertVisible(true);
  };

  const onContinue = () => {
    if (!noOfDays) {
      showAlert('Error', 'Please answer all the questions');
      return;
    }

    addQuiz({
      id: 5,
      question: 'How often do you get your period? (e.g., every 31 days)',
      answer: noOfDays,
    });

    if (!isRegular) {
      addQuiz({
        id: 6,
        question: 'When is your next cycle expected to start?',
        answer: "I don't know",
      });

      if (onNext) onNext();
    } else {
      if (onNext) onNext();
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            How often do you get your period? (e.g., every 31 days)
          </Text>

          <SelectList
            data={datesList}
            setSelected={setNoOfDays}
            save="key"
            dropdownStyles={styles.dropdown}
            placeholder="Select the number of days..."
            maxHeight={300}
            inputStyles={styles.selectInput}
            searchPlaceholder=""
            searchicon={
              <Feather
                name="search"
                size={20}
                color={lightTheme.primary}
                style={{paddingRight: 12}}
              />
            }
            closeicon={
              <Feather name="x" size={20} color={lightTheme.primary} />
            }
            arrowicon={
              <Feather
                name="chevron-down"
                size={20}
                color={lightTheme.primary}
              />
            }
            boxStyles={styles.selectBox}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            text="Continue"
            onPress={onContinue}
            backgroundColor={lightTheme.primary}
            textColor="white"
            style={styles.continueButton}
          />
        </View>
      </View>

      <AlertBox
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => {
          setAlertVisible(false);
          if (alertAction) {
            alertAction();
            setAlertAction(null);
          }
        }}
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
    marginBottom: 30,
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
  selectBox: {
    borderRadius: 12,
    borderColor: lightTheme.primary,
    backgroundColor: 'white',
  },
  selectInput: {
    borderRadius: 12,
    color: lightTheme.textDark,
  },
  dropdown: {
    borderRadius: 12,
    backgroundColor: 'white',
    borderColor: lightTheme.primaryLight,
  },
  radioContainer: {
    alignItems: 'center',
  },
  radioButton: {
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
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  continueButton: {
    width: '100%',
    height: 55,
  },
});

export default MensusDetails;
