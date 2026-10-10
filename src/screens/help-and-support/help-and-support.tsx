'use client';

import BackButton from '@/components/ui/buttons/back-button';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  SafeAreaView,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Your Provided Color Theme ---
const lightTheme = {
  primary: '#049299',
  primaryLight: '#CCEDEE',
  background: '#FAFAFA',
  gradientTop: '#055558',
  gradientMiddle: '#049299',
  gradientBottom: '#2DBABC',
  secondary: '#E3E582',
  textDark: '#000000',
  textMild: '#414142',
  textLight: '#828282',
  highlight: '#FDC500',
  highlightBackground: '#FDC5001A',
  primaryContrast: '#FAFAFA',
  buttonBorder: '#E8ECF4',
  physicalSymptomBg: '#8442B81F',
  psychologicalSymptomBg: '#E7F1E8',
};

// --- Mapped Constants for a clean and consistent design ---
const COLORS = {
  background: lightTheme.background,
  surface: lightTheme.primaryContrast, // Using primaryContrast for card backgrounds
  primary: lightTheme.primary,
  text: lightTheme.textDark,
  textSecondary: lightTheme.textMild,
  textMuted: lightTheme.textLight,
  border: lightTheme.buttonBorder,
};

const SPACING = {
  small: 8,
  medium: 16,
  large: 24,
};

// --- Reusable Components with new styles ---

const ScreenHeader = ({title}: {title: string}) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

const InfoRow = ({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.infoRow}
    onPress={onPress}
    activeOpacity={0.7}>
    <Icon
      name={icon}
      size={22}
      color={COLORS.primary}
      style={styles.infoRowIcon}
    />
    <View style={styles.infoRowTextContainer}>
      <Text style={styles.infoRowTitle}>{title}</Text>
      {subtitle && <Text style={styles.infoRowSubtitle}>{subtitle}</Text>}
    </View>
    <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
  </TouchableOpacity>
);

const FAQItem = ({
  question,
  answer,
  index,
  expandedFAQ,
  setExpandedFAQ,
}: any) => {
  const isExpanded = expandedFAQ === index;

  const toggleFAQ = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFAQ(isExpanded ? null : index);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={toggleFAQ}
        activeOpacity={0.7}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Icon
          name={isExpanded ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

// --- Main Screen Component ---
const HelpAndSupportScreen = () => {
  const navigation = useNavigation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleLinkPress = (url: string, errorMsg: string) => {
    Linking.openURL(url).catch(() => console.warn(errorMsg));
  };

  const contactOptions = [
    {
      icon: 'mail-outline',
      title: 'Email Support',
      subtitle: 'info@AuraCoremedical.com',
      onPress: () =>
        handleLinkPress(
          'mailto:info@AuraCoremedical.com',
          'Could not open email client.',
        ),
    },
    {
      icon: 'globe-outline',
      title: 'Visit Our Website',
      subtitle: 'myteal.ca',
      onPress: () =>
        handleLinkPress('https://myteal.ca/', 'Could not open website.'),
    },
    {
      icon: 'call-outline',
      title: 'Phone Support',
      subtitle: '+1 587-879-0772',
      onPress: () =>
        handleLinkPress('tel:+15878790772', 'Could not open phone app.'),
    },
  ];

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer:
        "Go to Settings > Account > Reset Password, or contact support for assistance. You'll receive an email with instructions to create a new password.",
    },
    {
      question: 'How can I update my profile information?',
      answer:
        'Navigate to Settings > Profile to edit your personal information. Make sure to save your changes before leaving the page.',
    },
    {
      question: 'Who can I contact for technical issues?',
      answer:
        'For technical support, please email us at info@AuraCoremedical.com or call our support line. Our technical team is available during business hours.',
    },
  ];

  return (
    <SafeAreaView style={styles.flex1}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <BackButton
            onPress={() => navigation.goBack()}
            style={{top: 60, alignSelf: 'flex-start', marginLeft: 20}}
          />
          <ScreenHeader title="Help & Support" />
        </View>

        <Text style={styles.pageDescription}>
          Have questions? We're here to help you get the most out of your
          experience.
        </Text>

        <Section title="Contact Us">
          {contactOptions.map((item, index) => (
            <React.Fragment key={item.title}>
              <InfoRow {...item} />
              {index < contactOptions.length - 1 && (
                <View style={styles.separator} />
              )}
            </React.Fragment>
          ))}
        </Section>

        <Section title="Frequently Asked Questions">
          {faqs.map((faq, index) => (
            <React.Fragment key={index}>
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                index={index}
                expandedFAQ={expandedFAQ}
                setExpandedFAQ={setExpandedFAQ}
              />
              {index < faqs.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Aura Medical Inc.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet using your lightTheme ---
const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: SPACING.large,
  },
  headerContainer: {
    padding: SPACING.medium,
    paddingTop: SPACING.large,
    paddingBottom: SPACING.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  pageDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.large,
    marginBottom: SPACING.large,
  },
  sectionContainer: {
    marginHorizontal: SPACING.medium,
    marginBottom: SPACING.large,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: SPACING.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.medium,
    backgroundColor: COLORS.surface,
  },
  infoRowIcon: {
    marginRight: SPACING.medium,
  },
  infoRowTextContainer: {
    flex: 1,
  },
  infoRowTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  infoRowSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.medium * 2 + SPACING.small,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.medium,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginRight: SPACING.small,
  },
  faqAnswerContainer: {
    paddingHorizontal: SPACING.medium,
    paddingBottom: SPACING.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  faqAnswer: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    paddingTop: SPACING.medium,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.medium,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});

export default HelpAndSupportScreen;
