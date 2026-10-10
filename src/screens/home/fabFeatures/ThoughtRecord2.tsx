import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {PrimaryButton} from '@/components/ui';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import {insertThoughtRecord} from '@/services/sqlite/feminine-health';
import {Toast} from '@/utils/toast';
import {useRoute} from '@react-navigation/native';
import BackButton from '@/components/ui/buttons/back-button';

const questions = [
  'How does that make you feel?',
  'What are the evidence for your feeling?',
  'What are the evidence against your feeling?',
  'What did you do?',
];

const ThoughtRecord2 = ({navigation}: {navigation: any}) => {
  const route = useRoute();
  const [answers, setAnswers] = useState({
    feel: '',
    evidence_for: '',
    evidence_against: '',
    what_i_did: '',
  });

  // @ts-ignore
  const {thought} = route.params || {};

  const handleAnswerChange = (key: keyof typeof answers, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (Object.values(answers).some(answer => answer.trim() === '')) {
      Toast('Please answer all questions before submitting.');
      return;
    }
    // Here you can handle the submission of the answers
    await insertThoughtRecord({
      thought,
      ...answers,
    });
    Toast('Your thought record has been saved.');
    console.log('Submitted Answers:', {thought, ...answers});
    navigation.replace('BottomTabNavigation');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <BackButton onPress={() => navigation.goBack()} />
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.title}>Let's break that down</Text>
              </View>

              <View style={{width: 40}} />
            </View>
            {thought ? (
              <Text style={styles.thoughtHeader}>
                Your thought: "{thought}"
              </Text>
            ) : null}

            <View style={styles.questionsContainer}>
              {questions.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                  <Text style={styles.questionText}>{question}</Text>
                  <TextInput
                    style={styles.input}
                    value={
                      answers[
                        Object.keys(answers)[index] as keyof typeof answers
                      ]
                    }
                    onChangeText={text =>
                      handleAnswerChange(
                        Object.keys(answers)[index] as keyof typeof answers,
                        text,
                      )
                    }
                    placeholder="Type your answer here..."
                    multiline
                    placeholderTextColor={lightTheme.textLight}
                  />
                </View>
              ))}
            </View>

            <View style={styles.bottomContainer}>
              <PrimaryButton
                text="Submit"
                onPress={handleSubmit}
                style={styles.submitButton}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: lightTheme.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: lightTheme.primary,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  thoughtHeader: {
    fontSize: 18,
    textAlign: 'center',
    color: lightTheme.textMild,
    fontFamily: FONT_FAMILIES.LatoRegular,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  questionsContainer: {
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    color: lightTheme.textDark,
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  input: {
    borderWidth: 1,
    borderColor: lightTheme.buttonBorder,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    color: lightTheme.textDark,
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  submitButton: {
    borderRadius: 14,
    width: '100%',
  },
});

export default ThoughtRecord2;
