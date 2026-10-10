import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ReactNode, useLayoutEffect} from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import {useShallow} from 'zustand/react/shallow';

// Import screens
import Emode from '@/screens/home/eMode/Emode';
import SavedContentScreen from '@/screens/home/eMode/SavedContents';
import Article from '../screens/article/Article';
import LoginScreen from '../screens/auth/login';
import RegistrationScreen from '../screens/auth/register';
import Chat from '../screens/chat/Chat';
import Podcast from '../screens/podcast/Podcast';
import ReviewSafetyPlan from '../screens/safetyPlan/ReviewSafetyPlan';
import SafetyPlan from '../screens/safetyPlan/safety_plan';
import ReviewStrategies from '../screens/strategies/ReviewStrategies';
import Strategies from '../screens/strategies/strategies';
import VideoPlaylist from '../screens/video_playlist/VideoPlaylist';
import WelcomeScreen from '../screens/welcome/welcome_screen';
import TermsOfServiceScreen from '@/screens/welcome/terms-of-service';
import BottomTabNavigation from './BottomTabNavigation';

// Import new screens
import ForgotPassword from '@/screens/auth/forgot-password';
import LogSymptomScreen from '@/screens/home/fabFeatures/LogSymptoms';
import ThoughtRecord from '@/screens/home/fabFeatures/ThoughtRecord';
import ThoughtRecord2 from '@/screens/home/fabFeatures/ThoughtRecord2';
import InteractiveVideoScreen from '../screens/learn/chapters/chapters-screen';
import PostActivityScreen from '../screens/learn/chapters/post-activity-screen copy';
// import InteractiveQuestionScreen from '../screens/learn/chapters/questionary-screen';
import ProfileScreen from '../screens/profile/Profile';
import ChangePasswordScreen from '../screens/profile/edit_profile/ChangePassword';
import EditProfileScreen from '../screens/profile/edit_profile/EditProfile';
import SubscriptionScreen from '../screens/profile/subscription/Subscription';

// Import types and constants
import useAppStore from '@/core/stores';
import {OnboardingScreen, QuizScreeen} from '@/screens';
import CalendarScreen from '@/screens/calendar/Calendar';
import HealthTimelineScreen from '@/screens/health-timeline/HealthTimeline';
import DayDetailScreen from '@/screens/health-timeline/[id]';
import HelpAndSupportScreen from '@/screens/help-and-support/help-and-support';
import ChapterDetailScreen from '@/screens/learn/chapters/chapter-detail-screen';
import VideoPlayerScreen from '@/screens/learn/chapters/video-player-screen';
import QuestionList from '@/screens/question-list/question-list';
import EditQuizScreen from '@/screens/quiz/edit_quiz';
import QuizOption from '@/screens/quiz/quiz_option';
import {ChevronLeft} from 'lucide-react-native';
import {View} from 'react-native';
import {BorderlessButton} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {lightTheme} from '../constants/colors';
import LearnModuleShowcaseScreen from '@/screens/learn/learn-module-showcase';
import ActivityDetailsScreen from '@/screens/learn/activity-details-screen';
import Disclaimer from '@/screens/discalimer/discalimer';

interface QuizProps {
  start_progress?: number;
  end_progress?: number;
  isBackButtonNotVisible?: boolean;
}

// Define navigation types
export type RootStackParamList = {
  // Onboarding Screens
  OnboardingScreen: undefined;

  // Auth Screens
  Welcome: undefined;
  TermsOfService: undefined;
  Login: undefined;
  Registration: undefined;
  ForgotPassword: undefined;

  // Main App Screens
  BottomTabNavigation: undefined;
  Emode: undefined;
  SavedContent: undefined;
  Chat: undefined;
  SafetyPlan: undefined;
  ReviewSafetyPlan: undefined;
  Strategies: undefined;
  ReviewStrategies: undefined;
  Calendar: undefined;
  HealthTimeline: undefined;
  DayDetail: {dateId: string; fromDirection?: 'past' | 'future'};
  Quiz: QuizProps;
  OnBoardingQuiz: QuizProps;

  EditQuiz: undefined;
  QuizOption: undefined;
  Disclaimer: undefined;

  // Profile screens
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Subscription: undefined;
  HelpAndSupport: undefined;

  // Interactive screens
  InteractiveVideo: undefined;
  InteractiveQuestion: undefined;
  PostActivity: {
    videoId: string;
    activityIndex?: number;
    chapterId?: number;
  };
  ThoughtRecord: undefined;
  ThoughtRecords2: {thought: string};
  LogSymptoms: {date?: string};
  QuestionList: {question: string; answers: ReactNode}[];
  // chapters
  ChapterDetails: {chapterId?: string};
  VideoPlayer: {
    chapterId?: string;
    videoId?: string;
    startPos?: number;
    videoUrl?: string;
    srtUrl?: string;
    title?: string;
  };

  // Content Screens
  Article: {id?: string} | undefined;
  Podcast: {id?: string} | undefined;
  VideoPlaylist: {id?: string} | undefined;
  LearnModuleShowcase: {module: any};
  ActivityDetails: {
    activity: any;
    activityType: any;
    title: any;
    thumbnailUrl?: any;
  };
};

// Create our typed stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Main Navigation Component
const MainNavigation = () => {
  // Get authentication state from store
  const {isLogin, user, accessToken, isNewUser} = useAppStore(
    useShallow(state => state.user),
  );
  const {resetPlaylist} = useAppStore(useShallow(state => state.playlist));

  // Get first launch state from store
  const {isFirstLaunch, setFirstLaunch} = useAppStore(
    useShallow(state => ({
      isFirstLaunch: state.app.isFirstLaunch,
      setFirstLaunch: state.app.setIsFirstTimeLaunched,
    })),
  );
  const insets = useSafeAreaInsets();

  // Completion data is now loaded automatically by Zustand persistence
  useLayoutEffect(() => {
    console.log(
      'Main navigation mounted - completion data automatically loaded',
    );
  }, []);

  // Configure Google Sign-In once
  useLayoutEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '904995166325-5957lvq85fsf9kq7a2ug96gfg49nidds.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const isUserLogin = isLogin && user && accessToken;
  const isNewUserLogin = isUserLogin && isNewUser;

  // Determine initial route based on auth state
  const getInitialRouteName = (): keyof RootStackParamList => {
    if (isFirstLaunch) {
      return 'OnboardingScreen';
    } else if (isNewUserLogin) {
      return 'Disclaimer';
    } else if (isUserLogin) {
      return 'BottomTabNavigation';
    }
    return 'Welcome';
  };

  const initialRouteName = getInitialRouteName();

  const OnboardingStackGroup = (
    <Stack.Group
      screenOptions={{
        animation: 'fade',
        gestureEnabled: false,
      }}>
      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        listeners={{
          beforeRemove: () => {
            setFirstLaunch(false);
          },
        }}
      />
    </Stack.Group>
  );

  const AuthenticationStackGroup = (
    <Stack.Group
      screenOptions={{
        animation: 'slide_from_bottom',
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Group>
  );

  const NewUserStackGroup = (
    <Stack.Group
      screenOptions={{
        animation: 'fade',
        gestureEnabled: false,
      }}>
      <Stack.Screen name="Disclaimer" component={Disclaimer} />
      <Stack.Screen name="OnBoardingQuiz" component={QuizScreeen} />
    </Stack.Group>
  );

  const UserStackGroup = (
    <Stack.Group
      screenOptions={{
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
      />

      {/* Add Quiz screen here - available for authenticated users */}
      <Stack.Screen
        name="Quiz"
        component={QuizScreeen} // Make sure this matches your import
        options={{
          contentStyle: {backgroundColor: 'white'},
          gestureEnabled: false, // Prevent going back during quiz
        }}
      />

      <Stack.Screen name="ActivityDetails" component={ActivityDetailsScreen} />
      <Stack.Screen
        name="EditQuiz"
        component={EditQuizScreen} // Make sure this matches your import
        options={{
          contentStyle: {backgroundColor: 'white'},
          gestureEnabled: false, // Prevent going back during quiz
        }}
      />
      <Stack.Screen
        name="QuizOption"
        component={QuizOption} // Make sure this matches your import
        options={{
          contentStyle: {backgroundColor: 'white'},
          gestureEnabled: false, // Prevent going back during quiz
        }}
      />

      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="SafetyPlan" component={SafetyPlan} />
      <Stack.Screen name="ReviewSafetyPlan" component={ReviewSafetyPlan} />
      <Stack.Screen name="Strategies" component={Strategies} />
      <Stack.Screen name="ReviewStrategies" component={ReviewStrategies} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="HelpAndSupport" component={HelpAndSupportScreen} />
      <Stack.Screen
        name="InteractiveVideo"
        component={InteractiveVideoScreen}
        options={({navigation}) => ({
          headerShown: true, // Hide header for video screen
          headerBackground: () => (
            <View
              style={{
                height: insets?.top + 200,
              }}>
              <LinearGradient
                colors={['#2D7D7A', '#0b7b76ff', '#0d645eff']}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
                useAngle
                angle={360}
                // angleCenter={{x: 1, y: 0}}
              />
            </View>
          ),
          headerTitle: 'Thriving with PMDs',
          headerTintColor: 'white',

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <BorderlessButton
              onPress={() => navigation?.goBack()}
              style={{padding: 10}}>
              <ChevronLeft size={24} color="white" />
            </BorderlessButton>
          ),
          headerRight: () => (
            <BorderlessButton
              onPress={() => resetPlaylist?.()}
              style={{padding: 10}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                Rest
              </Text>
              {/* <Reset size={24} color="white" /> */}
            </BorderlessButton>
          ),
          navigationBarHidden: false,
        })}
      />
      {/*<Stack.Screen
        name="InteractiveQuestion"
        component={InteractiveQuestionScreen}
        options={({navigation}) => ({
          headerShown: true, // Hide header for video screen
          headerBackground: () => (
            <View
              style={{
                height: insets?.top + 200,
              }}>
              <LinearGradient
                colors={['#2D7D7A', '#0b7b76ff', '#0d645eff']}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
                useAngle
                angle={360}
                // angleCenter={{x: 1, y: 0}}
              />
            </View>
          ),
          headerTitle: 'Thriving with PMDs',
          headerTintColor: 'white',

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <BorderlessButton
              onPress={() => navigation?.goBack()}
              style={{padding: 10}}>
              <ChevronLeft size={24} color="white" />
            </BorderlessButton>
          ),
          headerRight: () => (
            <BorderlessButton
              onPress={() => resetPlaylist?.()}
              style={{padding: 10}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                Rest
              </Text>
            </BorderlessButton>
          ),
          navigationBarHidden: false,
        })}
      />*/}
      <Stack.Screen name="ChapterDetails" component={ChapterDetailScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <Stack.Screen name="QuestionList" component={QuestionList} />
      <Stack.Screen
        name="LearnModuleShowcase"
        component={LearnModuleShowcaseScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostActivity"
        component={PostActivityScreen}
        options={({navigation}) => ({
          headerTransparent: true,
          headerShown: false,
          headerBackground: () => (
            <View
              style={{
                height: insets?.top + 200,
              }}>
              <LinearGradient
                colors={['#2D7D7A', '#0b7b76ff', '#0d645eff']}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
                useAngle
                angle={360}
                // angleCenter={{x: 1, y: 0}}
              />
            </View>
          ),
          headerTitle: '',
          headerTintColor: 'white',

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <BorderlessButton
              onPress={() => navigation?.goBack()}
              style={{padding: 10}}>
              <ChevronLeft size={24} color="white" />
            </BorderlessButton>
          ),

          navigationBarHidden: false,
        })}
      />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="HealthTimeline" component={HealthTimelineScreen} />
      <Stack.Screen
        name="DayDetail"
        component={DayDetailScreen}
        options={({route}) => {
          const params = route.params as {
            dateId: string;
            fromDirection?: 'past' | 'future';
          };
          const fromDirection = params?.fromDirection;

          return {
            animation:
              fromDirection === 'past' ? 'slide_from_left' : 'slide_from_right',
            animationDuration: 250,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          };
        }}
      />
      <Stack.Screen name="ThoughtRecord" component={ThoughtRecord} />
      <Stack.Screen
        name="ThoughtRecords2"
        component={ThoughtRecord2}
        initialParams={{thought: ''}} // Default value for thought
      />
      <Stack.Screen name="LogSymptoms" component={LogSymptomScreen} />
      <Stack.Screen name="Article" component={Article} />
      <Stack.Screen name="Podcast" component={Podcast} />
      <Stack.Screen name="VideoPlaylist" component={VideoPlaylist} />
      <Stack.Screen name="Emode" component={Emode} />
      <Stack.Screen name="SavedContent" component={SavedContentScreen} />
    </Stack.Group>
  );

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: lightTheme.background},
      }}>
      {isFirstLaunch
        ? OnboardingStackGroup
        : isNewUserLogin
        ? NewUserStackGroup
        : isUserLogin
        ? UserStackGroup
        : AuthenticationStackGroup}
    </Stack.Navigator>
  );
};

// Add Global Type Declaration
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  halfScreen: {
    position: 'absolute',
    top: 50,
    left: 50,
    bottom: 100,
    right: 100,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bottomControls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  leftControls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 20,
  },
  rightControls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    position: 'absolute',
    top: 20,
    bottom: 20,
    right: 20,
  },
  topControls: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    paddingBottom: 10,
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    paddingBottom: 10,
    paddingTop: Platform.OS === 'web' ? 25 : 0,
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftRightControlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: 'white',
    padding: 10,
    paddingTop: 50,
    lineHeight: 12,
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: 'white',
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
  pickerContainer: {
    width: 100,
    alignSelf: 'center',
    color: 'white',
    borderWidth: 1,
    borderColor: 'red',
  },
  indicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    height: '100%',
  },
  indicatorText: {
    color: 'white',
  },
  seekbarContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    height: 30,
  },
  seekbarTrack: {
    backgroundColor: '#333',
    height: 1,
    position: 'relative',
    top: 14,
    width: '100%',
  },
  seekbarFill: {
    backgroundColor: '#FFF',
    height: 1,
    width: '100%',
  },
  seekbarHandle: {
    position: 'absolute',
    marginLeft: -7,
    height: 28,
    width: 28,
  },
  seekbarCircle: {
    borderRadius: 12,
    position: 'relative',
    top: 8,
    left: 8,
    height: 12,
    width: 12,
  },
  picker: {
    // flex: 1,
    color: Platform.OS === 'web' ? 'black' : 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    // width: 100,
    // height: 40,
  },
  pickerItem: {
    // color: 'white',
    width: 100,
    height: 40,
  },
  emptyPickerItem: {
    color: 'white',
    marginTop: 20,
    marginLeft: 20,
    flex: 1,
    width: 100,
    height: 40,
  },
  topControlsContainer: {
    paddingTop: 30,
  },
});

export default MainNavigation;
