import Button from '@/components/ui/buttons/button';
import AlertBox from '@/components/ui/modal/alert-box';
import TextBox from '@/components/ui/text-box/TextBox';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import useAppStore from '@/core/stores';
import {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import Feather from 'react-native-vector-icons/Feather';

interface ContactDetailProps {
  text: string;
  onNext: () => void;
  quizID: number;
}

const ContactDetail: React.FC<ContactDetailProps> = ({
  text,
  onNext,
  quizID,
}) => {
  const {addQuiz} = useAppStore(state => state.engagement);

  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const relationshipList = [
    {label: 'Parent', value: 'Parent'},
    {label: 'Spouse', value: 'Spouse'},
    {label: 'Child', value: 'Child'},
    {label: 'Sibling', value: 'Sibling'},
    {label: 'Friend', value: 'Friend'},
    {label: 'Relative', value: 'Relative'},
  ];

  const onContinue = () => {
    if ((contactName || phoneNumber) && relationship) {
      const data = {
        id: quizID,
        question: text,
        answer: {
          contactName: contactName,
          phoneNumber: phoneNumber,
          relationship: relationship,
        },
      };
      addQuiz(data);
      onNext();
    } else {
      setShowAlert(true);
    }
  };

  const onSkip = () => {
    const data = {
      id: quizID,
      question: text,
      answer: 'Skipped',
    };
    addQuiz(data);
    onNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.instructionText}>{text}</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Name:</Text>
          <TextBox
            placeholder="Enter contact name"
            value={contactName}
            onChangeText={setContactName}
            style={styles.textInput}
            outlineColor={lightTheme.primary}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number:</Text>
          <TextBox
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.textInput}
            outlineColor={lightTheme.primary}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Relationship:</Text>
          <SelectList
            data={relationshipList}
            setSelected={setRelationship}
            dropdownStyles={styles.dropdown}
            placeholder="Select relationship type..."
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
      <AlertBox
        visible={showAlert}
        message="Please fill in all the required fields"
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
  headerContainer: {
    marginBottom: 30,
  },
  instructionText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontWeight: 'bold',
    fontSize: 18,
    color: lightTheme.textDark,
    textAlign: 'center',
    lineHeight: 26,
  },
  formContainer: {},
  inputGroup: {
    marginBottom: 25,
  },
  label: {
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

export default ContactDetail;
