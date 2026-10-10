import Button from '@/components/ui/buttons/button';
import AlertBox from '@/components/ui/modal/alert-box';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import useAppStore from '@/core/stores';
import {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

interface SymptomLogTimeProp {
  onNext: () => void;
}

const SymptomLogTime: React.FC<SymptomLogTimeProp> = ({onNext}) => {
  const {addQuiz} = useAppStore(state => state.engagement);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    setDate(currentDate);
    setTime(moment(currentDate).format('h:mm A'));
  };

  const onContinue = () => {
    if (time.trim()) {
      const data = {
        id: 22,
        question: `We can provide you with a form to record your symptoms at the end of each day. Please choose a time to log your symptoms.`,
        answer: time,
      };
      addQuiz(data);
      onNext();
    } else {
      setShowAlert(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>Daily Symptom Logging</Text>
        <Text style={styles.instructionText}>
          We can provide you with a form to record your symptoms at the end of
          each day. Please choose a time to log your symptoms.
        </Text>

        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() => setShowPicker(true)}>
          <Text style={styles.timePickerButtonText}>
            {time || 'Select a time'}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'time'}
            is24Hour={false}
            display="spinner"
            onChange={onChange}
          />
        )}
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
      <AlertBox
        visible={showAlert}
        message="Please specify the time"
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
  contentContainer: {
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontWeight: 'bold',
    fontSize: 24,
    color: lightTheme.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontSize: 16,
    color: lightTheme.textMild,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  timePickerButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderColor: lightTheme.primary,
    borderWidth: 1,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  timePickerButtonText: {
    color: lightTheme.textDark,
    fontSize: 16,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  continueButton: {
    width: '100%',
    height: 55,
  },
});

export default SymptomLogTime;
