import {ProgressBar} from '@/components';
import {lightTheme} from '@/constants';
import {useState, useCallback} from 'react';
import {Text, View, StyleSheet, ScrollView, Alert} from 'react-native';
import NameSection from './components/NameScreen';
import moment from 'moment';
import MensusQuestionComp from './components/MensusQuestionComp';
import MensusDetails from './components/MensusDetails';
import IrregularMensusDetails from './components/IrregularMensusDetails';
import LastPeriodDetails from './components/LastPeriodDetails';
import MentalHealthSymptom from './components/MentalHealthSymptom';
import MentalHealthSymptomTwo from './components/MentalHealthSymptomTwo';
import EmergencyContact from './components/EmergencyContact';
import ContactDetail from './components/ContactDetail';
import MedicaitonScreen from './components/MedicationScreen';
import SymptomLogTime from './components/SymptomLogTime';
import PromptGenScreen from './components/PromptGenerationScreen';
import useAppStore from '@/core/stores';
import FONT_FAMILIES from '@/constants/fonts';
import {RootStackParamList} from '@/navigations/MainNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useShallow} from 'zustand/react/shallow';
import {updateFirebaseDoc} from '@/services/auth/authentication';
import {Toast} from '@/utils/toast';
import ProgressHeader from '@/components/common/headers/ProgressHeader';

type QuizScreenProp = NativeStackScreenProps<
  RootStackParamList,
  'Quiz' | 'OnBoardingQuiz'
>;

const QuizScreen = ({navigation, route}: QuizScreenProp) => {
  const {addQuiz} = useAppStore(state => state.engagement);
  const {isNewUser, setIsNewUser, user, isLogin, accessToken} = useAppStore(
    useShallow(state => state.user),
  );

  const start_progress = route?.params?.start_progress || 1;
  const end_progress = route?.params?.end_progress || 20;

  const [progress, setProgress] = useState(
    typeof start_progress === 'number' ? start_progress : 1,
  );

  const isUserLogin = isLogin && user && accessToken;
  const isNewUserLogin = isUserLogin && isNewUser && (progress === 1);

  const [dob, setDOB] = useState<moment.Moment | undefined>(undefined);
  const [ansOne, setAnsOne] = useState('');
  const [ansTwo, setAnsTwo] = useState('');
  const [ansThree, setAnsThree] = useState<string[]>([]);
  const [ansFour, setAnsFour] = useState('');
  const [ansFive, setAnsFive] = useState('');
  const [ansSix, setAnsSix] = useState('');
  const [ansSeven, setAnsSeven] = useState('');
  const [ansEight, setAnsEight] = useState('');

  const [isSkipMedication, setSkipMedication] = useState(false);
  const [partialQuizCompleted, setPartialQuizCompleted] = useState(false);

  const getAdjustedProgress = useCallback(
    (originalProgress: number) => {
      if (ansOne === 'Yes' && originalProgress >= 4) {
        return originalProgress + 1;
      }
      return originalProgress;
    },
    [ansOne],
  );

  const updateProgress = (val: number) => {
    setProgress(val);
  };

  const question_1 = `Do you get your period at roughly the same time every month?`;
  const question_2 = `Around the ages of 42-50, cycling individuals experience the menopause transition (also called perimenopause), which leads to irregular cycle lengths, and can lead to symptoms like hot flashes, night sweats, or vaginal dryness, among others. Do you believe you are currently experiencing these changes?`;
  const question_3 = `Can you tell us more about the menopause symptoms that are bothering you? Please select all that apply`;
  const question_4 = `How much do these menopausal symptoms bother you?`;
  const question_5 = `When do your symptoms typically start?`;
  const question_6 = `When do you experience relief from your symptoms?`;
  const question_7 = `Do you experience thoughts of hurting yourself or ending your life?`;
  const question_8 = `Would you like a structured way to log your symptoms at the end of each day?\n\nNote: This can be helpful if you would like to confirm a premenstrual disorder or share your symptoms with healthcare providers or explore your symptoms in a more detailed way.`;
  const question_9 = `Would you like to contribute to research? By opting in, your anonymous data can help improve understanding and care for menstrual cycle–related mental health.`;

  const subQuestion1 = `In other words, do you have regular cycles that differ in length by no more than 2-3 days?`;

  const ansSet1 = [
    {
      text: 'Yes',
      onPress: (ans: string) => onAnsSelect(4, question_1, ans, setAnsOne, 3),
    },
    {
      text: 'No, I have irregular cycles',
      onPress: (ans: string) => onAnsSelect(4, question_1, ans, setAnsOne, 3),
    },
    {
      text: 'I am in natural, chemical or surgical menopause',
      onPress: (ans: string) => onAnsSelect(4, question_1, ans, setAnsOne, 3),
    },
    {
      text: `I don't know if my cycles are regular`,
      onPress: (ans: string) => onAnsSelect(4, question_1, ans, setAnsOne, 3),
    },
    {
      text: `Skip`,
      onPress: (ans: string) => onAnsSelect(4, question_1, ans, setAnsOne, 3),
    },
  ];

  const ansSet2 = [
    {
      text: 'Yes',
      onPress: (ans: string) =>
        onAnsSelect(7, question_2, ans, setAnsTwo, getAdjustedProgress(5)),
    },
    {
      text: 'No',
      onPress: (ans: string) =>
        onAnsSelect(7, question_2, ans, setAnsTwo, getAdjustedProgress(6)),
    },
    {
      text: 'Skip',
      onPress: (ans: string) =>
        onAnsSelect(7, question_2, ans, setAnsTwo, getAdjustedProgress(6)),
    },
  ];

  const ansSet3 = [
    {
      text: 'Difficulty in sleeping',
      onPress: (ans: string) => {
        onSelectMultipleChoice(ans, setAnsThree);
      },
    },
    {
      text: 'Difficulty in concentrating',
      onPress: (ans: string) => {
        onSelectMultipleChoice(ans, setAnsThree);
      },
    },
    {
      text: 'Hot flushes',
      onPress: (ans: string) => {
        onSelectMultipleChoice(ans, setAnsThree);
      },
    },
    {
      text: 'Sweating at night',
      onPress: (ans: string) => {
        onSelectMultipleChoice(ans, setAnsThree);
      },
    },
    {
      text: 'Loss of interest in sex',
      onPress: (ans: string) => {
        onSelectMultipleChoice(ans, setAnsThree);
      },
    },
  ];

  const ansSet4 = [
    {
      text: 'Not at all',
      onPress: (ans: string) =>
        onAnsSelect(9, question_4, ans, setAnsFour, getAdjustedProgress(7)),
    },
    {
      text: 'A little',
      onPress: (ans: string) =>
        onAnsSelect(9, question_4, ans, setAnsFour, getAdjustedProgress(7)),
    },
    {
      text: 'Quite a bit',
      onPress: (ans: string) =>
        onAnsSelect(9, question_4, ans, setAnsFour, getAdjustedProgress(7)),
    },
    {
      text: 'Extremely',
      onPress: (ans: string) =>
        onAnsSelect(9, question_4, ans, setAnsFour, getAdjustedProgress(7)),
    },
    {
      text: 'Depends on the symptom',
      onPress: (ans: string) =>
        onAnsSelect(9, question_4, ans, setAnsFour, getAdjustedProgress(7)),
    },
  ];

  const ansSet5 = [
    {
      text: 'two weeks before my period',
      onPress: (ans: string) =>
        onAnsSelect(11, question_5, ans, setAnsFive, getAdjustedProgress(9)),
    },
    {
      text: 'one week before my period',
      onPress: (ans: string) =>
        onAnsSelect(11, question_5, ans, setAnsFive, getAdjustedProgress(9)),
    },
    {
      text: 'a few days before period',
      onPress: (ans: string) =>
        onAnsSelect(11, question_5, ans, setAnsFive, getAdjustedProgress(9)),
    },
    {
      text: 'right around my period',
      onPress: (ans: string) =>
        onAnsSelect(11, question_5, ans, setAnsFive, getAdjustedProgress(9)),
    },
    {
      text: 'Skip',
      onPress: (ans: string) =>
        onAnsSelect(11, question_5, ans, setAnsFive, getAdjustedProgress(9)),
    },
  ];

  const ansSet6 = [
    {
      text: 'a few days before my period',
      onPress: (ans: string) =>
        onAnsSelect(12, question_6, ans, setAnsSix, getAdjustedProgress(10)),
    },
    {
      text: 'when my period starts',
      onPress: (ans: string) =>
        onAnsSelect(12, question_6, ans, setAnsSix, getAdjustedProgress(10)),
    },
    {
      text: 'several days after my period starts',
      onPress: (ans: string) =>
        onAnsSelect(12, question_6, ans, setAnsSix, getAdjustedProgress(10)),
    },
    {
      text: 'Skip',
      onPress: (ans: string) =>
        onAnsSelect(12, question_6, ans, setAnsSix, getAdjustedProgress(10)),
    },
  ];

  const ansSet7 = [
    {
      text: 'Yes',
      onPress: (ans: string) =>
        onAnsSelect(21, question_7, ans, setAnsSeven, getAdjustedProgress(12)),
    },
    {
      text: 'No',
      onPress: (ans: string) =>
        onAnsSelect(21, question_7, ans, setAnsSeven, getAdjustedProgress(13)),
    },
    {
      text: 'Skip',
      onPress: (ans: string) =>
        onAnsSelect(21, question_7, ans, setAnsSeven, getAdjustedProgress(13)),
    },
  ];

  const ansSet8 = [
    {
      text: 'Yes',
      onPress: (ans: string) =>
        onAnsSelect(22, question_8, ans, setAnsSeven, getAdjustedProgress(18)),
    },
    {
      text: 'No',
      onPress: (ans: string) =>
        onAnsSelect(22, question_8, ans, setAnsSeven, getAdjustedProgress(19)),
    },
  ];

  const ansSet9 = [
    {
      text: 'Yes',
      onPress: (ans: string) =>
        onAnsSelect(24, question_9, ans, setAnsEight, getAdjustedProgress(20)),
    },
    {
      text: 'No',
      onPress: (ans: string) =>
        onAnsSelect(24, question_9, ans, setAnsEight, getAdjustedProgress(20)),
    },
  ];

  const medicationQuestionSet1 = [
    {
      id: 17,
      question:
        'Do you take any oral contraceptives, hormonal birth control (e.g., hormonal IUD), or hormone therapy?',
    },
    {id: 18, question: 'Do you take any antidepressant medication(s)?'},
  ];

  const medicationQuestionSet2 = [
    {
      id: 19,
      question: `Would you like reminders of when it's time to take your medication?`,
      yesTag: 'Please specify reminder time:',
    },
    {
      id: 20,
      question: `Are you currently in regular (e.g., weekly) talk therapy?`,
    },
  ];

  const updateQuizData = (id: number, question: string, answer: any) => {
    const data = {id, question, answer};
    addQuiz(data);
  };

  const onAnsSelect = (
    id: number,
    question: string,
    ans: string,
    setAns: (ans: string) => void,
    progress: number,
  ) => {
    updateQuizData(id, question, ans);
    setAns(ans);
    updateProgress(progress);
  };

  const onSelectMultipleChoice = (
    ans: string,
    setAns: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setAns(prevList =>
      prevList.includes(ans)
        ? prevList.filter(item => item !== ans)
        : [...prevList, ans],
    );
  };

  const getAge = (dob: moment.Moment | undefined) => {
    if (dob !== undefined) {
      const today = moment();
      return today.diff(dob, 'years');
    } else {
      // throw new Error('No date of birth provided');
      return 0;
    }
  };

  const onCompletion = async () => {
    if (isNewUser && user) {
      setIsNewUser(false);
      const isFirebaseUpdated = await updateFirebaseDoc(user?.uid, {
        isNewUser: false,
      });
      if (!isFirebaseUpdated) {
        Toast('Unable to connect with server');
      }
    }

    // For full quiz (start_progress=1 and end_progress=20), navigate to BottomTabNavigation
    // For partial quiz retakes, go back to previous screen
    if (start_progress === 1 && end_progress === 20) {
      navigation.navigate('BottomTabNavigation');
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressHeader
          currentStep={progress}
          totalSteps={end_progress}
          onBackPress={() => updateProgress(progress > 1 ? progress - 1 : 1)}
          onExit={() => navigation.goBack()}
          onSkipPress={() => {}}
          showSkipButton={false}
          showBackButton={!isNewUserLogin}
        />
        <Text style={styles.progressText}>{`${progress}/21`}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {progress === 1 && (
          <NameSection
            onNext={dob => {
              setDOB(dob);
              updateProgress(2);
            }}
          />
        )}
        {progress === 2 && (
          <MensusQuestionComp
            question={question_1}
            subQuestion={subQuestion1}
            answerSet={ansSet1}
          />
        )}
        {progress === 3 && ansOne === 'Yes' && (
          <LastPeriodDetails onNext={() => updateProgress(4)} />
        )}
        {progress === 4 && ansOne === 'Yes' && (
          <MensusDetails
            onNext={() =>
              updateProgress(
                getAge(dob) < 42
                  ? getAdjustedProgress(7)
                  : getAdjustedProgress(4),
              )
            }
          />
        )}
        {progress === 3 && ansOne !== 'Yes' && (
          <IrregularMensusDetails
            onNext={() =>
              updateProgress(
                getAge(dob) < 42
                  ? getAdjustedProgress(8)
                  : getAdjustedProgress(5),
              )
            }
          />
        )}
        {progress === getAdjustedProgress(4) && (
          <MensusQuestionComp question={question_2} answerSet={ansSet2} />
        )}
        {progress === getAdjustedProgress(5) && (
          <MensusQuestionComp
            question={question_3}
            answerSet={ansSet3}
            conditionFuntion={(val: string) => ansThree.includes(val)}
            isContinueButtonVisible={true}
            onNext={() => {
              updateQuizData(8, question_3, ansThree);
              updateProgress(getAdjustedProgress(6));
              updateProgress(
                ansThree.includes('None')
                  ? getAdjustedProgress(12)
                  : getAdjustedProgress(6),
              );
            }}
          />
        )}
        {progress === getAdjustedProgress(6) && (
          <MensusQuestionComp question={question_4} answerSet={ansSet4} />
        )}
        {progress === getAdjustedProgress(7) && (
          <MentalHealthSymptom
            onNext={() => {
              updateProgress(getAdjustedProgress(8));
            }}
          />
        )}
        {progress === getAdjustedProgress(8) && (
          <MensusQuestionComp question={question_5} answerSet={ansSet5} />
        )}
        {progress === getAdjustedProgress(9) && (
          <MensusQuestionComp question={question_6} answerSet={ansSet6} />
        )}
        {progress === getAdjustedProgress(10) && (
          <MentalHealthSymptomTwo
            onNext={() => updateProgress(getAdjustedProgress(11))}
          />
        )}
        {progress === getAdjustedProgress(11) && (
          <MensusQuestionComp question={question_7} answerSet={ansSet7} />
        )}
        {progress === getAdjustedProgress(12) && (
          <EmergencyContact
            onNext={() => updateProgress(getAdjustedProgress(13))}
          />
        )}
        {progress === getAdjustedProgress(13) && (
          <ContactDetail
            quizID={15}
            onNext={() => {
              updateProgress(getAdjustedProgress(14));
            }}
            text="Enter the contact information of at least one person whose mere presence would benefit your well-being in that moment. Someone with whom you can have a good time or laugh."
          />
        )}
        {progress === getAdjustedProgress(14) && (
          <ContactDetail
            quizID={16}
            onNext={() => {
              updateProgress(getAdjustedProgress(15));
            }}
            text="Enter the contact of at least one person who can provide practical support when you are in crisis. Someone who will listen to you, accept you no matter what and can help with practical things like taking you to an appointment or showing up so you are not alone."
          />
        )}
        {progress === getAdjustedProgress(15) && (
          <MedicaitonScreen
            questionAndTags={medicationQuestionSet1}
            onNext={val => {
              setSkipMedication(val === true);
              updateProgress(getAdjustedProgress(16));
            }}
          />
        )}
        {progress === getAdjustedProgress(16) && (
          <MedicaitonScreen
            questionAndTags={
              isSkipMedication === true
                ? medicationQuestionSet2
                : medicationQuestionSet2[1]
                ? [medicationQuestionSet2[1]]
                : []
            }
            onNext={() => updateProgress(getAdjustedProgress(17))}
          />
        )}
        {progress === getAdjustedProgress(17) && (
          <MensusQuestionComp question={question_8} answerSet={ansSet8} />
        )}
        {progress === getAdjustedProgress(18) && (
          <SymptomLogTime
            onNext={() => updateProgress(getAdjustedProgress(19))}
          />
        )}
        {progress === getAdjustedProgress(19) && (
          <MensusQuestionComp question={question_9} answerSet={ansSet9} />
        )}
        {progress === getAdjustedProgress(20) &&
          start_progress === 1 &&
          end_progress === 20 && (
            <PromptGenScreen onCompletion={onCompletion} />
          )}
        {/* Show completion for partial quiz sections */}
        {progress > end_progress && start_progress !== 1 && (
          <View style={styles.completionContainer}>
            <Text style={styles.completionText}>Section completed!</Text>
            <Text style={styles.completionSubText}>
              You have finished editing this section of your quiz.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    left: -20,
  },
  progressText: {
    color: lightTheme.textLight,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.LatoRegular,
    marginLeft: -20,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  completionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  completionText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontWeight: 'bold',
    fontSize: 28,
    color: lightTheme.textDark,
    textAlign: 'center',
    marginBottom: 15,
  },
  completionSubText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontSize: 16,
    color: lightTheme.textMild,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default QuizScreen;
