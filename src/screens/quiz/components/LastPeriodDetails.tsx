import Button from '@/components/ui/buttons/button';
import AlertBox from '@/components/ui/modal/alert-box';
import moment from 'moment';
import {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import useAppStore from '@/core/stores';
import DateDropdownPicker from '@/components/ui/date-dropdown-picker/DateDropdownPicker';

interface LastPeriodDetailsProps {
  onNext: () => void;
}

const LastPeriodDetails: React.FC<LastPeriodDetailsProps> = ({onNext}) => {
  const {addQuiz} = useAppStore(state => state.engagement);
  const {addPeriodDates} = useAppStore(state => state.cycle);

  const [selectedDate, setSelectedDate] = useState<moment.Moment | undefined>(
    moment(),
  );
  const [selectedOption, setSelectedOption] = useState('');

  // Alert box states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleDateChange = (date: moment.Moment | undefined) => {
    setSelectedDate(date);
    if (date) {
      setSelectedOption(`I know (${date.format('MMM DD')})`);
    } else {
      setSelectedOption('');
    }
  };

  const onSelectDontKnow = () => {
    setSelectedOption("I don't know");
    setSelectedDate(undefined);
  };

  const onContinue = () => {
    if (selectedOption) {
      const lastPeriodQuiz = {
        id: 7,
        question: `When was your last period?`,
        answer: selectedOption,
      };

      if (selectedDate !== undefined) {
        // Assuming default cycle length for regular cycles for now
        const cycle_days = 28;
        addPeriodDates(
          selectedDate,
          selectedDate.clone().add(4, 'days'),
          cycle_days,
        );
      }
      addQuiz(lastPeriodQuiz);
    // } else {
    //   showAlert('Error', 'Please answer all the questions');
    }
    onNext();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>When was your last period?</Text>

          <View style={styles.radioContainer}>
            <DateDropdownPicker
              label="Select Date"
              onDateChange={handleDateChange}
              initialDate={selectedDate || moment()}
              required={true}
            />
            <Button
              text="I don't know"
              onPress={onSelectDontKnow}
              backgroundColor={
                selectedOption === "I don't know" ? lightTheme.primary : 'white'
              }
              textColor={
                selectedOption === "I don't know"
                  ? 'white'
                  : lightTheme.textDark
              }
              style={[
                styles.radioButton,
                selectedOption === "I don't know"
                  ? styles.selectedButton
                  : styles.unselectedButton,
              ]}
            />
          </View>
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
  radioContainer: {
    width: '100%',
    alignItems: 'stretch',
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

export default LastPeriodDetails;
