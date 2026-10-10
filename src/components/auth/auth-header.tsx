import {FONT_FAMILIES, lightTheme} from '@/constants';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BackButton from '../ui/buttons/back-button';

type ScreenType = 'login' | 'register';

interface AuthHeaderProps {
  screenType?: ScreenType;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  screenType = 'login',
  title,
  subtitle,
  showBackButton = true,
}) => {
  // Set default title and subtitle based on screen type
  const headerTitle =
    title ||
    (screenType === 'login' ? 'Welcome Back! 👋🏻' : 'Join MyTeal app Today ✨');

  const headerSubtitle =
    subtitle ||
    (screenType === 'login'
      ? 'Access your MyTeal account and stay on top of your cycle'
      : 'Create your MyTeal account and take control of your health journey');

  return (
    <View style={styles.header}>
      {showBackButton && <BackButton />}
      <View style={styles.spacer} />

      {/* Title and Subtitle */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{headerTitle}</Text>
        <Text style={styles.subtitle}>{headerSubtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
  spacer: {
    height: 20,
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: lightTheme.textDark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: lightTheme.textLight,
    lineHeight: 22,
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
});

export default AuthHeader;
