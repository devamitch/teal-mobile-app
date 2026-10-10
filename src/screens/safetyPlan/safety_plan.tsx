import ProgressHeader from '@/components/common/headers/ProgressHeader';
import {PrimaryButton} from '@/components/ui';
import useAppStore from '@/core/stores';
import React, {useState} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import SP1 from '../../assets/images/sp1.svg';
import SP2 from '../../assets/images/sp2.svg';
import SP3 from '../../assets/images/sp3.svg';
import SP4 from '../../assets/images/sp4.svg';
import SP5 from '../../assets/images/sp5.svg';
import SP6 from '../../assets/images/sp6.svg';

const SafetyPlan = ({navigation}: {navigation: any}) => {
  const {addSafetyPlan, getSafetyPlanWithID} = useAppStore(
    state => state.engagement,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [visitedPages, setVisitedPages] = useState<number[]>([]);

  const [responses, setResponses] = useState({
    1: getSafetyPlanWithID(0)?.answer ?? '',
    2: getSafetyPlanWithID(1)?.answer ?? '',
    3: getSafetyPlanWithID(2)?.answer ?? '',
    4: getSafetyPlanWithID(3)?.answer ?? '',
    5: getSafetyPlanWithID(4)?.answer ?? '',
    6: getSafetyPlanWithID(5)?.answer ?? '',
  });

  const handleChangeResponse = (key: number, val: string) => {
    setResponses(prev => ({
      ...prev,
      [key]: val,
    }));
  };

  const pages = [
    {
      id: 1,
      SvgComponent: SP1,
      title: 'What are my triggers or warning signs?',
      placeholder:
        'List thoughts, feelings, bodily sensations, behaviors or situations that make you feel unsafe.',
    },
    {
      id: 2,
      SvgComponent: SP2,
      title: 'How can I take my mind off my problem?',
      placeholder: 'Write your ideas',
    },

    {
      id: 3,
      SvgComponent: SP6,
      title: 'What must I do to make my environment safer?',
      placeholder:
        'Write down how to limit your access to means of hurting yourself.',
    },
  ];

  const handleNext = () => {
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Mark current page as visited
      setVisitedPages(prev => [...new Set([...prev, currentPage])]);

      // Change content
      if (currentPage < pages.length) {
        setCurrentPage(currentPage + 1);
      } else {
        const answers = [responses[1], responses[2], responses[3]];
        pages.map((val, index) => {
          addSafetyPlan({
            id: index,
            question: val.title,
            answer: answers[index],
          });
        });
        navigation.replace('Emode');
      }

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const {SvgComponent, title, placeholder} = pages[currentPage - 1];

  // Render the appropriate TextInput based on current page
  const renderTextInput = () => {
    switch (currentPage) {
      case 1:
        return (
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#A0AEC0"
            multiline={true}
            textAlignVertical="top"
            value={responses[1]}
            onChangeText={val => handleChangeResponse(1, val)}
          />
        );
      case 2:
        return (
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#A0AEC0"
            multiline={true}
            textAlignVertical="top"
            value={responses[2]}
            onChangeText={val => handleChangeResponse(2, val)}
          />
        );
      case 3:
        return (
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#A0AEC0"
            multiline={true}
            textAlignVertical="top"
            value={responses[3]}
            onChangeText={val => handleChangeResponse(3, val)}
          />
        );
      case 4:
        return (
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#A0AEC0"
            multiline={true}
            textAlignVertical="top"
            value={responses[4]}
            onChangeText={val => handleChangeResponse(4, val)}
          />
        );
      case 5:
        return (
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#A0AEC0"
            multiline={true}
            textAlignVertical="top"
            value={responses[5]}
            onChangeText={val => handleChangeResponse(5, val)}
          />
        );
      case 6:
        return (
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#A0AEC0"
            multiline={true}
            textAlignVertical="top"
            value={responses[6]}
            onChangeText={val => handleChangeResponse(6, val)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
            <ProgressHeader
              currentStep={currentPage}
              totalSteps={pages.length}
              onBackPress={() => {
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
              onSkipPress={() => navigation.replace('Emode')}
              onExit={() => navigation.goBack()}
            />

            {/* Header with logo/illustration */}
            <View style={styles.imageContainer}>
              <SvgComponent width={280} height={280} />
            </View>

            {/* Text content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              {renderTextInput()}
            </View>

            {/* Bottom section with button */}
            <View style={styles.bottomContainer}>
              <PrimaryButton
                text="Continue"
                onPress={handleNext}
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
    paddingTop: 10,
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
    // Removed marginTop to let space-between handle spacing
  },
  nextButton: {
    borderRadius: 14,
    marginBottom: 16,
  },
  nextButtonText: {
    color: '#FFFFFF',
    borderRadius: 14,
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
});

export default SafetyPlan;
