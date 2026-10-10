import EZ from '@/assets/images/ez.svg';
import BackButton from '@/components/ui/buttons/back-button';
import {lightTheme} from '@/constants/colors';
import useAppStore from '@/core/stores';
import React, {useEffect} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import {useShallow} from 'zustand/react/shallow';
import SizeBox from '../size-box';
import HeaderStyles from './MainHeaderStyle';

interface MainHeaderProps {
  rightButtonText?: string; // Text for right-side button
  onRightPress?: () => void; // Handler for right-side button
  onPressEmode?: any;
  isEmodeOn?: boolean;
  showBackButton?: boolean; // New prop to control back button
  onNextPress?: any;
  isChatBarHide?: boolean;
  nextButtonText?: string; // Custom text for the next button
}

const MAX_NAME_LENGTH = 15;

const MainHeader = ({
  rightButtonText,
  onRightPress,
  onPressEmode,
  isEmodeOn = true,
  showBackButton = false,
  onNextPress,
  isChatBarHide = false,
  nextButtonText = 'We are here for you',
}: MainHeaderProps) => {
  // Get userData and engagement quizData from store
  const {userData, engagement} = useAppStore(
    useShallow(state => ({
      userData: state.user.userData,
      engagement: state.engagement,
    })),
  );
  const Colors = lightTheme;

  // Helper to truncate user name if too long
  const getDisplayName = (name?: string) => {
    if (!name) return 'Jane';
    if (name.length > MAX_NAME_LENGTH) {
      return `${name.slice(0, MAX_NAME_LENGTH)}...`;
    }
    return name;
  };

  // Try to get the name answer from quizData (id: 1)
  let onboardingName: string | undefined;
  if (engagement?.quiz && Array.isArray(engagement.quiz)) {
    const nameQuiz = engagement.quiz.find(q => q.id === 1 && q.answer);
    if (
      nameQuiz &&
      typeof nameQuiz.answer === 'string' &&
      nameQuiz.answer.trim() !== ''
    ) {
      onboardingName = nameQuiz.answer.trim();
    }
  }

  // Fallback: use displayName from userData (your original method)
  const displayName = onboardingName
    ? onboardingName
    : userData?.displayName
    ? userData.displayName.replace(
        /\w\S*/g,
        w => w.charAt(0).toUpperCase() + w.slice(1),
      )
    : undefined;

  useEffect(() => {
    console.log('MainHeader Name Check:');
    console.log('onboardingName from quizData:', onboardingName);
    console.log('userData.displayName:', userData?.displayName);
    console.log('Final displayName used:', getDisplayName(displayName));
  }, [onboardingName, userData?.displayName, displayName]);

  useEffect(() => {
    console.log('engagement.quiz:', engagement?.quiz);
    const nameQuiz = engagement?.quiz?.find(q => q.id === 1);
    console.log('quizData nameQuiz:', nameQuiz);
  }, [engagement]);

  return (
    <View
      style={[
        HeaderStyles.container,
        {height: isChatBarHide ? 220 : Platform.OS === 'android' ? 230 : 250},
      ]}>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.2)', 'transparent']}
        style={HeaderStyles.gradient}
        pointerEvents="none"
      />
      <SizeBox height={Platform.OS === 'android' ? 30 : 50} />
      <SizeBox height={25} />
      <View style={HeaderStyles.textContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          {showBackButton && (
            <BackButton
              onPress={onPressEmode}
              iconColor="white"
              borderColor="white"
              style={{marginRight: 15}}
            />
          )}
          <View style={{flex: 1}}>
            <Text style={HeaderStyles.mainText} numberOfLines={1}>
              {`Hi ${getDisplayName(displayName).replace(
                /\w\S*/g,
                w => w.charAt(0).toUpperCase() + w.slice(1),
              )} 👋🏻 `}
            </Text>
            <Text style={HeaderStyles.subText}>
              Take time to rest and rejuvenate
            </Text>
          </View>
          {/* Right-side button */}
          {rightButtonText && (
            <TouchableOpacity
              style={[
                HeaderStyles.nextBtnContainer,
                {marginLeft: 10, backgroundColor: Colors.gradientMiddle},
              ]}
              onPress={onRightPress}>
              <Text style={[HeaderStyles.nextBtnText, {color: 'white'}]}>
                {rightButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {isEmodeOn && (
          <TouchableOpacity
            style={HeaderStyles.iconContainer}
            onPress={onPressEmode}>
            <EZ />
          </TouchableOpacity>
        )}
      </View>
      {/* Add this line: */}
      {isChatBarHide && <SizeBox height={40} />}
      <SizeBox height={25} />
      {!isChatBarHide ? (
        <TouchableOpacity
          style={HeaderStyles.nextBtnContainer}
          onPress={onNextPress}>
          <Text style={HeaderStyles.nextBtnText}>{nextButtonText}</Text>
          <Feather name="chevron-right" color={Colors.textDark} size={35} />
        </TouchableOpacity>
      ) : (
        <SizeBox height={50} />
      )}
    </View>
  );
};

export default MainHeader;
