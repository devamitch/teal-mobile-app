import BackButton from '@/components/ui/buttons/back-button';
import Button from '@/components/ui/buttons/button';
import {FONT_FAMILIES, IMAGES, lightTheme} from '@/constants';
import useAppStore from '@/core/stores';
import {RootStackParamList} from '@/navigations/MainNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useState, useEffect} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AlertBox from '@/components/ui/modal/alert-box';

const {width} = Dimensions.get('screen');

const emojies = [
  {image: IMAGES.emo_scale_1, value: 1},
  {image: IMAGES.emo_scale_2, value: 2},
  {image: IMAGES.emo_scale_3, value: 3},
  {image: IMAGES.emo_scale_4, value: 4},
  {image: IMAGES.emo_scale_5, value: 5},
  {image: IMAGES.emo_scale_6, value: 6},
];

type QuestionListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'QuestionList'
>;

// Hardcoded for your use-case
const activityId = '1.2.1';

const QuestionList: React.FC<QuestionListScreenProps> = ({navigation}) => {
  // Use separate selectors to avoid infinite re-render
  const getQuizWithID = useAppStore(state => state.engagement.getQuizWithID);
  const currentVideoId = useAppStore(
    state => state.interactive_video.currentVideoId,
  );
  const saveActivityResponse = useAppStore(
    state => state.interactive_video.saveActivityResponse,
  );
  const getActivityResponse = useAppStore(
    state => state.interactive_video.getActivityResponse,
  );

  const insets = useSafeAreaInsets();

  const [emoValue, setValue] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  // Alert box states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);

  const symptoms = getQuizWithID(10);

  const showAlert = (
    title: string,
    message: string,
    shouldNavigate = false,
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShouldNavigateBack(shouldNavigate);
    setAlertVisible(true);
  };

  // Add debugging
  useEffect(() => {
    console.log('=== DEBUG INFO ===');
    console.log('symptoms:', symptoms);
    console.log('symptoms type:', typeof symptoms);
    console.log('symptoms.answer:', symptoms?.answer);
    console.log('symptoms.answer type:', typeof symptoms?.answer);
    console.log('symptoms.answer isArray:', Array.isArray(symptoms?.answer));
    if (symptoms?.answer) {
      console.log('symptoms.answer length:', symptoms.answer.length);
      console.log('symptoms.answer content:', symptoms.answer);
    }
    console.log('==================');
  }, [symptoms]);

  const handlePrevious = () => {
    navigation.goBack();
  };

  const onContinue = async () => {
    if (Object.keys(emoValue).length === symptoms?.answer?.length) {
      setSubmitting(true);

      // Prepare response payload
      const response = {
        values: emoValue,
      };

      try {
        // Save the activity response to the interactive_video store
        await saveActivityResponse(currentVideoId, activityId, response);
        setSubmitting(false);
        navigation.goBack();
      } catch (error) {
        setSubmitting(false);
        showAlert('Error', 'Failed to save your responses, please try again.');
      }
    } else {
      showAlert('Error', 'Please answer all questions');
    }
  };

  if (!symptoms) {
    console.log('DEBUG: symptoms is null/undefined');
    return (
      <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
        <View style={styles.contentContainer}>
          <Text style={styles.questionTitle}>
            No quiz data found (symptoms is null/undefined)
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!symptoms.answer) {
    console.log('DEBUG: symptoms.answer is null/undefined');
    return (
      <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
        <View style={styles.contentContainer}>
          <Text style={styles.questionTitle}>
            No answer data found (symptoms.answer is null/undefined)
          </Text>
          <Text style={styles.questionTitle}>
            Available symptoms keys: {Object.keys(symptoms).join(', ')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!Array.isArray(symptoms.answer)) {
    console.log('DEBUG: symptoms.answer is not an array');
    return (
      <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
        <View style={styles.contentContainer}>
          <Text style={styles.questionTitle}>Answer data is not an array</Text>
          <Text style={styles.questionTitle}>
            Type: {typeof symptoms.answer}
          </Text>
          <Text style={styles.questionTitle}>
            Value: {JSON.stringify(symptoms.answer)}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (symptoms.answer.length === 0) {
    console.log('DEBUG: symptoms.answer is empty array');
    return (
      <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
        <View style={styles.contentContainer}>
          <Text style={styles.questionTitle}>
            No symptoms to display (empty array)
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />

        <BackButton
          iconColor={lightTheme.gradientMiddle}
          borderColor={lightTheme.gradientMiddle}
          style={[styles.backButton, {top: insets.top + 20}]}
          onPress={handlePrevious}
        />

        <View style={styles.contentContainer}>
          <Text style={styles.questionTitle}>
            Which PMD symptoms are most problematic for you? Below is a list of
            symptoms that you previously identified as being ones that you
            commonly struggle with.
          </Text>
          <Text style={styles.debugText}>
            Found {symptoms.answer.length} symptoms
          </Text>
          {symptoms.answer.map((item: string, index: number) => (
            <View key={`symptom-${index}`} style={styles.symptomContainer}>
              <Text style={styles.symptomText}>{item}</Text>
              <View style={{flexDirection: 'row', paddingBottom: 10}}>
                <Text>Not a problem</Text>
                <Text style={{marginLeft: 'auto'}}>Very serious Problem</Text>
              </View>
              <View style={styles.emojiContainer}>
                {emojies.map(({image, value}, emojiIndex) => (
                  <TouchableOpacity
                    key={`emoji-${index}-${emojiIndex}`}
                    onPress={() => {
                      setValue(prev => ({...prev, [item]: value}));
                    }}
                    style={[
                      styles.emojiButton,
                      value === emoValue[item] && styles.selectedEmoji,
                    ]}>
                    <Image
                      style={[
                        styles.emojiImage,
                        value === emoValue[item] && {
                          tintColor: lightTheme.primary,
                        },
                      ]}
                      source={image}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            text={submitting ? 'Saving...' : 'Continue'}
            onPress={onContinue}
            disabled={submitting}
            backgroundColor={lightTheme.primary}
            textColor="white"
            style={styles.continueButton}
          />
        </View>
      </SafeAreaView>

      <AlertBox
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => {
          setAlertVisible(false);
          if (shouldNavigateBack) {
            setShouldNavigateBack(false);
          }
        }}
        onModalHide={() => {
          if (shouldNavigateBack) {
            navigation.goBack();
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    lineHeight: 26,
    textAlign: 'justify',
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  symptomContainer: {
    marginBottom: 20,
  },
  symptomText: {
    fontSize: 16,
    marginBottom: 10,
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
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  continueButton: {
    width: '100%',
    height: 55,
  },
});

export default QuestionList;
