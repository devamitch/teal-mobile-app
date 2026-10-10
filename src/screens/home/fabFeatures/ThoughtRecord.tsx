import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import SP1 from '@/assets/images/sp1.svg';
import Moods from '@/components/common/Mood';
import BackButton from '@/components/ui/buttons/back-button';
import {PrimaryButton} from '@/components/ui';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import {Toast} from '@/utils/toast';

const ThoughtRecord = ({navigation}: {navigation: any}) => {
  const [fadeAnim] = useState(new Animated.Value(1));

  const [response, setResponse] = useState({
    thought: '',
    feel: '',
    evidenceFor: '',
    evidenceAgainst: '',
    alternativeThought: '',
  });

  const handleUpdateResponse = (key: keyof typeof response, value: string) => {
    setResponse(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleContinuePress = () => {
    try {
      if (response.thought.trim() === '') {
        throw new Error('Thought should not be empty');
      }
      navigation.navigate('ThoughtRecords2', {
        thought: response.thought,
      });
    } catch (error) {
      Toast(String(error));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <BackButton
        style={{position: 'absolute', top: 60, left: 20, zIndex: 10}}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
            {/* Header with logo/illustration */}
            <View style={styles.imageContainer}>
              <SP1 width={280} height={280} />
            </View>

            {/* Text content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                Let's take a quick pause and reflect
              </Text>

              <View style={{alignItems: 'center'}}>
                <Moods />
              </View>

              <TextInput
                style={styles.textInput}
                placeholder="Take a moment to explore what you are thinking or feeling."
                placeholderTextColor="#A0AEC0"
                multiline={true}
                textAlignVertical="top"
                value={response.thought}
                onChangeText={val => handleUpdateResponse('thought', val)}
              />
            </View>

            {/* Bottom section with button */}
            <View style={styles.bottomContainer}>
              <PrimaryButton
                text="Continue"
                onPress={handleContinuePress}
                style={styles.nextButton}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between', // Added this line
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Added flex to allow proper distribution
  },
  textContainer: {
    justifyContent: 'center',
    paddingHorizontal: 8,
    flex: 1, // Added flex to allow proper distribution
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1A1A1A',
    lineHeight: 28,
    fontFamily: 'YoungSerif-Regular',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
    minHeight: 150,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  brandName: {
    color: '#2DD4BF', // Teal color
    fontSize: 32,
    fontWeight: '800',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 24,
    fontWeight: '400',
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  nextButton: {
    borderRadius: 14,
    marginBottom: 16,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  activeDot: {
    backgroundColor: '#2DD4BF',
    width: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 20,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    width: '90%',
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    fontSize: 16,
  },
  button: {
    padding: 8,
    borderRadius: 14,
    margin: 5,
    backgroundColor: lightTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    textAlign: 'center',
    color: lightTheme.primaryContrast,
  },
});

export default ThoughtRecord;
