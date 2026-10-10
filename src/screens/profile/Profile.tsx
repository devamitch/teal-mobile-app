import {useMemo, useState} from 'react';
import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import Feather from 'react-native-vector-icons/Feather';

import Colors from '@/constants/colors';
import {IMAGES} from '@/constants';
import profile_styles from './ProfileStyle';
import ProfileMenuItem from './components/ProfileMenuItem';
import useAppStore from '@/core/stores';
import {useShallow} from 'zustand/react/shallow';
import LogoCarousel from '@/components/profile/logo-carousel';
import PreferenceModal from './components/PreferencesModal';
import MainHeader from '@/components/common/headers/MainHeader';

const Profile = ({navigation}: any) => {
  const [preferenceModalVisible, setPreferenceModalVisible] = useState(false);
  const {userData} = useAppStore(useShallow(state => state.user));
  const {quiz} = useAppStore(useShallow(state => state.engagement));
  const {logout} = useAppStore(state => state.user);
  const {clearAuth} = useAppStore(state => state.auth);
  const {getQuizWithID} = useAppStore(state => state.engagement);

  const quiz_length = Object.keys(quiz).length;

  const questionnaireTitle = getQuizWithID(24)
    ? 'Personalization'
    : quiz_length === 0
    ? 'Personalization'
    : `Onboarding (${Math.round((quiz_length * 100) / 23)}% Completed)`;

  // Check if user has a profile photo
  const hasProfilePhoto = useMemo(() => {
    return !!userData?.photoURL;
  }, [userData?.photoURL]);

  // Format email to truncate if longer than 25 characters
  const formatEmail = useMemo(() => {
    if (!userData?.email) return '';
    return userData.email.length > 25
      ? `${userData.email.substring(0, 22)}...`
      : userData.email;
  }, [userData?.email]);

  const logoutDevice = async () => {
    try {
      await auth().signOut();
      logout();
      clearAuth();
    } catch (error) {
      console.error(error);
    }
  };

  const navigateTo = (screen: string) => () => navigation.navigate(screen);

  return (
    <View style={profile_styles.mainContainer}>
      <MainHeader
        isEmodeOn={true}
        showBackButton={false}
        onPressEmode={() => navigation.navigate('Emode')}
        onNextPress={() => navigation.navigate('Chat')}
      />
      <ScrollView
        contentContainerStyle={{paddingBottom: 32}}
        showsVerticalScrollIndicator={false}>
        {/* Subscription Card */}
        <View style={[profile_styles.subscriptionCard]}>
          <TouchableOpacity
            style={profile_styles.subscriptionContent}
            onPress={navigateTo('Subscription')}>
            <Image source={IMAGES.crown} style={profile_styles.crownIcon} />
            <View style={profile_styles.subscriptionTextContainer}>
              <Text style={profile_styles.subscriptionTitle}>
                Upgrade Plan Now
              </Text>
              <Text style={profile_styles.subscriptionSubtitle}>
                Unlock Your Full Health Potential
              </Text>
            </View>
            <Feather name="chevron-right" color={Colors.white} size={25} />
          </TouchableOpacity>
        </View>

        {/* Menu Card */}
        <View style={profile_styles.menuCard}>
          <ProfileMenuItem
            title={questionnaireTitle}
            icon="form"
            iconType="AntDesign"
            onPress={navigateTo('QuizOption')}
          />

          <ProfileMenuItem
            title="Preferences"
            icon="clipboard"
            onPress={() => setPreferenceModalVisible(true)}
          />
          <ProfileMenuItem
            title="Account"
            icon="user"
            onPress={navigateTo('EditProfile')}
          />
          {/*<ProfileMenuItem title="Settings" icon="settings" />*/}
          <ProfileMenuItem
            title="Help and Support"
            icon="help-circle"
            onPress={navigateTo('HelpAndSupport')}
          />
          <ProfileMenuItem
            title="Logout"
            icon="log-out"
            color={Colors.red}
            onPress={logoutDevice}
            isLast={true}
          />

          <View style={profile_styles.divider} />

          {/* Logo */}
          <LogoCarousel />
        </View>
        <PreferenceModal
          visible={preferenceModalVisible}
          onRequestClose={() => setPreferenceModalVisible(false)}
        />
      </ScrollView>
    </View>
  );
};

export default Profile;
