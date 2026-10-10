import {FONT_FAMILIES, lightTheme} from '@/constants';
import {RootStackParamList} from '@/navigations/MainNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width} = Dimensions.get('screen');

type QuestionListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'QuestionList'
>;

const QuestionList: React.FC<QuestionListScreenProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <SafeAreaView style={[styles.container, {paddingTop: insets.top, justifyContent: 'center', alignItems: 'center'}]}>
        <Text>Question List Placeholder</Text>
      </SafeAreaView>
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
