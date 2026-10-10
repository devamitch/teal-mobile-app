import {NameInput, PrimaryButton, SecondaryButton} from '@/components/ui';
import Button from '@/components/ui/buttons/button';
import AlertBox from '@/components/ui/modal/alert-box';
import DateDropdownPicker from '@/components/ui/date-dropdown-picker/DateDropdownPicker';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import useAppStore from '@/core/stores';
import moment from 'moment';
import {useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
  SlideInRight,
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';

// Import countryList from your SOS contacts data file
import {countryList} from '@/components/sos-contacts/sos-contacts';

interface NameSectionProps {
  onNext: (dob: moment.Moment | undefined) => void;
}

const NameSection: React.FC<NameSectionProps> = ({onNext}) => {
  const [name, setName] = useState('');
  const [dob, setDOB] = useState<moment.Moment | undefined>(moment());
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');

  // Alert box states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const {addQuiz} = useAppStore(state => state.engagement);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // const onContinue = () => {
  //   if (name && dob && gender && country) {
  //     const nameData = {
  //       id: 1,
  //       question: 'What is you name?',
  //       answer: name,
  //     };

  //     const dobData = {
  //       id: 2,
  //       question: 'What is your date of birth?',
  //       answer: dob.format('YYYY-MM-DD'),
  //     };

  //     const genderData = {
  //       id: 3,
  //       question: 'What is your gender?',
  //       answer: gender,
  //     };

  //     const countryData = {
  //       id: 26, // Assigning quizID = 26 for country
  //       question: 'What is your country?',
  //       answer: country,
  //     };

  //     addQuiz(nameData);
  //     addQuiz(dobData);
  //     addQuiz(genderData);
  //     addQuiz(countryData); // Add country data to the store
  //     onNext(dob);
  //   } else {
  //     showAlert('Error', 'Please answer all questions');
  //   }
  // };

  const onContinue = () => {
    if(name){
      const nameData = {
        id: 1,
        question: 'What is you name?',
        answer: name,
      };
      addQuiz(nameData);
    }

    if(dob){
      const dobData = {
        id: 2,
        question: 'What is your date of birth?',
        answer: dob.format('YYYY-MM-DD'),
      };
      addQuiz(dobData);
    }

    if(gender){
      const genderData = {
        id: 3,
        question: 'What is your gender?',
        answer: gender,
      };
      addQuiz(genderData);
    }

    if(country){
      const countryData = {
        id: 26, // Assigning quizID = 26 for country
        question: 'What is your country?',
        answer: country,
      };
      addQuiz(countryData);
    }

      onNext(dob);
  };

  const genderList = [
    {label: 'Woman', value: 'Woman'},
    {label: 'Transgender man', value: 'Transgender man'},
    {label: 'Non-binary', value: 'Non-binary'},
    {label: 'Two-spirited', value: 'Two-spirited'},
    {
      label: 'Another gender not listed above',
      value: 'Another gender not listed above',
    },
    {label: 'Prefer not to answer', value: 'Prefer not to answer'},
  ];

  // Use countryList for dropdown menu, convert it to objects with label/value
  const countryDropdownList = countryList.map(c => ({
    label: c,
    value: c,
  }));

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={styles.headerContainer}
          entering={FadeInUp.delay(200).duration(800)}>
          <Text style={styles.welcomeText}>Nice to meet you!</Text>
          <Text style={styles.subText}>
            Let's get to know you better, so I can help you reach your health
            and wellness goals
          </Text>
        </Animated.View>

        <Animated.View
          style={styles.formContainer}
          entering={FadeInDown.delay(400).duration(800)}
          layout={Layout.springify()}>
          <Animated.View entering={SlideInRight.delay(600).duration(600)}>
            <NameInput
              placeholder="Enter your name here"
              value={name}
              onChangeText={setName}
              label="What is your preferred name?"
            />
          </Animated.View>

          <Animated.View entering={SlideInRight.delay(800).duration(600)}>
            <DateDropdownPicker
              label={ dob === undefined 
                ? "What is your date of birth? (Not selected)"
                : "What is your date of birth?"
              }
              onDateChange={setDOB}
              initialDate={dob}
              // required
            />
            {Platform.OS === 'ios' ? 
              dob === undefined ? <PrimaryButton
                text={'I prefer not to say'}
                style={{marginVertical: 20}}
              /> : <SecondaryButton  
                onPress={() => setDOB(undefined)} 
                text={'I prefer not to say'}
                style={{marginVertical: 20}}
              />
              : null
            }
          </Animated.View>

          <Animated.View
            style={styles.inputGroup}
            entering={SlideInRight.delay(1000).duration(600)}>
            <Text style={styles.label}>
              How do you describe your gender identity?
            </Text>
            <SelectList
              data={genderList}
              setSelected={setGender}
              dropdownStyles={styles.dropdown}
              placeholder="Select your gender..."
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
          </Animated.View>

          {/* Country Dropdown */}
          <Animated.View
            style={styles.inputGroup}
            entering={FadeInDown.delay(1200).duration(600)}>
            <Text style={styles.label}>Which country are you from?</Text>
            <SelectList
              data={countryDropdownList}
              setSelected={setCountry}
              dropdownStyles={styles.dropdown}
              placeholder="Select your country..."
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
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={styles.buttonContainer}
          entering={FadeInUp.delay(1400).duration(600)}>
          <Button
            text="Continue"
            onPress={onContinue}
            backgroundColor={lightTheme.primary}
            textColor="white"
            style={styles.continueButton}
          />
        </Animated.View>
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontWeight: 'bold',
    fontSize: 28,
    color: lightTheme.textDark,
    marginBottom: 15,
    textAlign: 'center',
  },
  subText: {
    color: lightTheme.textLight,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.LatoRegular,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontSize: 16,
    color: lightTheme.textDark,
    marginBottom: 10,
    fontWeight: '600',
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
    paddingBottom: 20,
  },
  continueButton: {
    width: '100%',
    height: 55,
  },
});

export default NameSection;
