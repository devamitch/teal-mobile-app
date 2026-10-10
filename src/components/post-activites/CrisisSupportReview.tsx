import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useAppStore from '@/core/stores';
import {SelectList} from 'react-native-dropdown-select-list';

interface CrisisSupportReviewProps {
  activity?: any;
  response?: any;
  onResponseChange: (response: any) => void;
}

interface ContactInfo {
  contactName: string;
  phoneNumber: string;
  relationship: string;
}

const CrisisSupportReview: React.FC<CrisisSupportReviewProps> = ({
  onResponseChange,
}) => {
  const {getQuizWithID, addQuiz} = useAppStore(state => state.engagement);
  const [editingContactType, setEditingContactType] = useState<
    'emotional' | 'practical' | null
  >(null);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use ref to avoid dependency issues with onResponseChange
  const onResponseChangeRef = useRef(onResponseChange);
  onResponseChangeRef.current = onResponseChange;

  // Get all onboarding data from screens 8-14
  const mentalHealthSymptomsData = getQuizWithID(10); // Mental health symptoms
  const symptomTimingStartData = getQuizWithID(11); // When symptoms start
  const symptomTimingReliefData = getQuizWithID(12); // When symptoms get relief
  const symptomSeverityData = getQuizWithID(13); // Symptom severity rating
  const suicidalThoughtsData = getQuizWithID(21); // Suicidal thoughts
  const emotionalSupportData = getQuizWithID(15); // Emotional support contact
  const practicalSupportData = getQuizWithID(16); // Practical support contact

  const [emotionalContact, setEmotionalContact] = useState<ContactInfo>({
    contactName: '',
    phoneNumber: '',
    relationship: '',
  });

  const [practicalContact, setPracticalContact] = useState<ContactInfo>({
    contactName: '',
    phoneNumber: '',
    relationship: '',
  });

  // State for other quiz answers
  const [mentalHealthSymptoms, setMentalHealthSymptoms] = useState<string[]>(
    [],
  );
  const [symptomTimingStart, setSymptomTimingStart] = useState<string>('');
  const [symptomTimingRelief, setSymptomTimingRelief] = useState<string>('');
  const [symptomSeverity, setSymptomSeverity] = useState<number>(0);
  const [suicidalThoughts, setSuicidalThoughts] = useState<string>('');

  const relationshipOptions = [
    {label: 'Parent', value: 'Parent'},
    {label: 'Spouse', value: 'Spouse'},
    {label: 'Child', value: 'Child'},
    {label: 'Sibling', value: 'Sibling'},
    {label: 'Friend', value: 'Friend'},
    {label: 'Relative', value: 'Relative'},
    {label: 'Partner', value: 'Partner'},
    {label: 'Therapist', value: 'Therapist'},
    {label: 'Other', value: 'Other'},
  ];

  useEffect(() => {
    if (!isInitialized) {
      // Initialize contacts with onboarding data
      if (
        emotionalSupportData?.answer &&
        typeof emotionalSupportData.answer === 'object'
      ) {
        setEmotionalContact(emotionalSupportData.answer as ContactInfo);
      }

      if (
        practicalSupportData?.answer &&
        typeof practicalSupportData.answer === 'object'
      ) {
        setPracticalContact(practicalSupportData.answer as ContactInfo);
      }

      // Initialize other quiz answers
      if (mentalHealthSymptomsData?.answer) {
        setMentalHealthSymptoms(
          Array.isArray(mentalHealthSymptomsData.answer)
            ? mentalHealthSymptomsData.answer
            : [mentalHealthSymptomsData.answer],
        );
      }

      if (symptomTimingStartData?.answer) {
        setSymptomTimingStart(symptomTimingStartData.answer);
      }

      if (symptomTimingReliefData?.answer) {
        setSymptomTimingRelief(symptomTimingReliefData.answer);
      }

      if (symptomSeverityData?.answer) {
        setSymptomSeverity(symptomSeverityData.answer);
      }

      if (suicidalThoughtsData?.answer) {
        setSuicidalThoughts(suicidalThoughtsData.answer);
      }

      // Set initial response
      onResponseChangeRef.current({
        reviewed: true,
        timestamp: new Date().toISOString(),
        emotionalSupport: emotionalSupportData?.answer,
        practicalSupport: practicalSupportData?.answer,
        mentalHealthSymptoms: mentalHealthSymptomsData?.answer,
        symptomTimingStart: symptomTimingStartData?.answer,
        symptomTimingRelief: symptomTimingReliefData?.answer,
        symptomSeverity: symptomSeverityData?.answer,
        suicidalThoughts: suicidalThoughtsData?.answer,
      });

      setIsInitialized(true);
    }
  }, [
    isInitialized,
    emotionalSupportData?.answer,
    practicalSupportData?.answer,
    mentalHealthSymptomsData?.answer,
    symptomTimingStartData?.answer,
    symptomTimingReliefData?.answer,
    symptomSeverityData?.answer,
    suicidalThoughtsData?.answer,
  ]);

  const handleSaveContact = (type: 'emotional' | 'practical') => {
    const contact = type === 'emotional' ? emotionalContact : practicalContact;
    const quizId = type === 'emotional' ? 15 : 16;

    if (!contact.contactName && !contact.phoneNumber) {
      Alert.alert('Error', 'Please provide at least a name or phone number.');
      return;
    }

    // Update the onboarding quiz data
    const updatedQuizData = {
      id: quizId,
      question:
        type === 'emotional'
          ? 'Enter the contact information of at least one person whose mere presence would benefit your well-being in that moment.'
          : 'Enter the contact of at least one person who can provide practical support when you are in crisis.',
      answer: contact,
    };
    addQuiz(updatedQuizData);

    // Update activity response
    onResponseChangeRef.current({
      reviewed: true,
      timestamp: new Date().toISOString(),
      emotionalSupport:
        type === 'emotional' ? contact : emotionalSupportData?.answer,
      practicalSupport:
        type === 'practical' ? contact : practicalSupportData?.answer,
      mentalHealthSymptoms: mentalHealthSymptomsData?.answer,
      symptomTimingStart: symptomTimingStartData?.answer,
      symptomTimingRelief: symptomTimingReliefData?.answer,
      symptomSeverity: symptomSeverityData?.answer,
      suicidalThoughts: suicidalThoughtsData?.answer,
      wasEdited: true,
    });

    setEditingContactType(null);
    Alert.alert('Success', `Your ${type} support contact has been updated.`);
  };

  const handleSaveQuizAnswer = (
    quizId: number,
    question: string,
    answer: any,
  ) => {
    // Update the onboarding quiz data
    const updatedQuizData = {
      id: quizId,
      question,
      answer,
    };
    addQuiz(updatedQuizData);

    // Update local state based on quiz ID
    switch (quizId) {
      case 10:
        setMentalHealthSymptoms(Array.isArray(answer) ? answer : [answer]);
        break;
      case 11:
        setSymptomTimingStart(answer);
        break;
      case 12:
        setSymptomTimingRelief(answer);
        break;
      case 13:
        setSymptomSeverity(answer);
        break;
      case 21:
        setSuicidalThoughts(answer);
        break;
    }

    // Update activity response
    onResponseChangeRef.current({
      reviewed: true,
      timestamp: new Date().toISOString(),
      emotionalSupport: emotionalSupportData?.answer,
      practicalSupport: practicalSupportData?.answer,
      mentalHealthSymptoms:
        quizId === 10 ? answer : mentalHealthSymptomsData?.answer,
      symptomTimingStart:
        quizId === 11 ? answer : symptomTimingStartData?.answer,
      symptomTimingRelief:
        quizId === 12 ? answer : symptomTimingReliefData?.answer,
      symptomSeverity: quizId === 13 ? answer : symptomSeverityData?.answer,
      suicidalThoughts: quizId === 21 ? answer : suicidalThoughtsData?.answer,
      wasEdited: true,
    });

    setEditingQuestion(null);
    Alert.alert('Success', 'Your answer has been updated.');
  };

  const handleCancelEdit = () => {
    // Reset to original data
    if (
      emotionalSupportData?.answer &&
      typeof emotionalSupportData.answer === 'object'
    ) {
      setEmotionalContact(emotionalSupportData.answer as ContactInfo);
    }
    if (
      practicalSupportData?.answer &&
      typeof practicalSupportData.answer === 'object'
    ) {
      setPracticalContact(practicalSupportData.answer as ContactInfo);
    }

    // Reset quiz answers to original data
    if (mentalHealthSymptomsData?.answer) {
      setMentalHealthSymptoms(
        Array.isArray(mentalHealthSymptomsData.answer)
          ? mentalHealthSymptomsData.answer
          : [mentalHealthSymptomsData.answer],
      );
    }
    if (symptomTimingStartData?.answer) {
      setSymptomTimingStart(symptomTimingStartData.answer);
    }
    if (symptomTimingReliefData?.answer) {
      setSymptomTimingRelief(symptomTimingReliefData.answer);
    }
    if (symptomSeverityData?.answer) {
      setSymptomSeverity(symptomSeverityData.answer);
    }
    if (suicidalThoughtsData?.answer) {
      setSuicidalThoughts(suicidalThoughtsData.answer);
    }

    setEditingContactType(null);
    setEditingQuestion(null);
  };

  const renderQuizQuestionCard = (
    quizId: number,
    title: string,
    question: string,
    answer: any,
    icon: string,
    editComponent: React.ReactNode,
  ) => {
    const isEditingThis = editingQuestion === quizId;
    const isEmpty =
      !answer ||
      answer === 'Skipped' ||
      (Array.isArray(answer) && answer.length === 0);

    const handleSave = () => {
      let currentAnswer: any;

      // Get current answer based on quiz ID
      switch (quizId) {
        case 10:
          currentAnswer = mentalHealthSymptoms;
          break;
        case 11:
          currentAnswer = symptomTimingStart;
          break;
        case 12:
          currentAnswer = symptomTimingRelief;
          break;
        case 13:
          currentAnswer = symptomSeverity;
          break;
        case 21:
          currentAnswer = suicidalThoughts;
          break;
        default:
          currentAnswer = answer;
      }

      if (
        !currentAnswer ||
        (Array.isArray(currentAnswer) && currentAnswer.length === 0)
      ) {
        Alert.alert('Error', 'Please provide an answer before saving.');
        return;
      }

      handleSaveQuizAnswer(quizId, question, currentAnswer);
    };

    return (
      <View style={styles.contactCard}>
        <View style={styles.contactHeader}>
          <View style={styles.contactTitleContainer}>
            <MaterialIcons name={icon as any} size={20} color="#2D7D7A" />
            <Text style={styles.contactTitle}>{title}</Text>
          </View>
          {!isEditingThis && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setEditingQuestion(quizId);
              }}>
              <MaterialIcons name="edit" size={16} color="#2D7D7A" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.contactDescription}>{question}</Text>

        {isEditingThis ? (
          <View style={styles.editForm}>
            {editComponent}
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isEmpty ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="help-outline" size={32} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>
              No answer provided or skipped
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Tap Edit to provide an answer
            </Text>
          </View>
        ) : (
          <View style={styles.contactInfo}>
            <View style={styles.contactDetail}>
              <MaterialIcons name="check-circle" size={18} color="#6B7280" />
              <Text style={styles.contactDetailText}>
                {Array.isArray(answer) ? answer.join(', ') : answer.toString()}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderContactCard = (
    type: 'emotional' | 'practical',
    contact: ContactInfo,
    title: string,
    description: string,
  ) => {
    const isEditingThis = editingContactType === type;
    const isEmpty = !contact.contactName && !contact.phoneNumber;

    return (
      <View style={styles.contactCard}>
        <View style={styles.contactHeader}>
          <View style={styles.contactTitleContainer}>
            <MaterialIcons
              name={type === 'emotional' ? 'favorite' : 'handyman'}
              size={20}
              color="#2D7D7A"
            />
            <Text style={styles.contactTitle}>{title}</Text>
          </View>
          {!isEditingThis && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setEditingContactType(type);
              }}>
              <MaterialIcons name="edit" size={16} color="#2D7D7A" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.contactDescription}>{description}</Text>

        {isEditingThis ? (
          <View style={styles.editForm}>
            <TextInput
              style={styles.textInput}
              placeholder="Contact Name"
              value={
                type === 'emotional'
                  ? emotionalContact.contactName
                  : practicalContact.contactName
              }
              onChangeText={text => {
                if (type === 'emotional') {
                  setEmotionalContact(prev => ({...prev, contactName: text}));
                } else {
                  setPracticalContact(prev => ({...prev, contactName: text}));
                }
              }}
            />

            <TextInput
              style={styles.textInput}
              placeholder="Phone Number"
              value={
                type === 'emotional'
                  ? emotionalContact.phoneNumber
                  : practicalContact.phoneNumber
              }
              onChangeText={text => {
                if (type === 'emotional') {
                  setEmotionalContact(prev => ({...prev, phoneNumber: text}));
                } else {
                  setPracticalContact(prev => ({...prev, phoneNumber: text}));
                }
              }}
              keyboardType="phone-pad"
            />

            <SelectList
              data={relationshipOptions}
              setSelected={(value: string) => {
                if (type === 'emotional') {
                  setEmotionalContact(prev => ({...prev, relationship: value}));
                } else {
                  setPracticalContact(prev => ({...prev, relationship: value}));
                }
              }}
              placeholder="Select relationship"
              defaultOption={{
                key:
                  type === 'emotional'
                    ? emotionalContact.relationship
                    : practicalContact.relationship,
                value:
                  type === 'emotional'
                    ? emotionalContact.relationship
                    : practicalContact.relationship,
              }}
              boxStyles={styles.selectBox}
              dropdownStyles={styles.dropdown}
            />

            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSaveContact(type)}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isEmpty ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="person-add" size={32} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>
              No contact information provided
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Tap Edit to add contact details
            </Text>
          </View>
        ) : (
          <View style={styles.contactInfo}>
            <View style={styles.contactDetail}>
              <MaterialIcons name="person" size={18} color="#6B7280" />
              <Text style={styles.contactDetailText}>
                {contact.contactName || 'No name provided'}
              </Text>
            </View>

            {contact.phoneNumber && (
              <View style={styles.contactDetail}>
                <MaterialIcons name="phone" size={18} color="#6B7280" />
                <Text style={styles.contactDetailText}>
                  {contact.phoneNumber}
                </Text>
              </View>
            )}

            {contact.relationship && (
              <View style={styles.contactDetail}>
                <MaterialIcons name="group" size={18} color="#6B7280" />
                <Text style={styles.contactDetailText}>
                  {contact.relationship}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <MaterialIcons name="support-agent" size={24} color="#2D7D7A" />
          <Text style={styles.headerTitle}>Crisis Support Review</Text>
        </View>

        <Text style={styles.description}>
          Review and update all your onboarding answers related to crisis
          support. This includes your mental health symptoms, support contacts,
          and related information.
        </Text>

        {/* Mental Health Symptoms Question */}
        {renderQuizQuestionCard(
          10,
          'Mental Health Symptoms',
          'Which mental health symptoms bother you the most in the weeks leading up to your period?',
          mentalHealthSymptoms,
          'psychology',
          <View>
            {[
              'Sadness or Depression',
              'Anxiety',
              'Sudden sadness or tearfulness or mood swings',
              'Anger or irritability',
              'None',
            ].map(symptom => (
              <TouchableOpacity
                key={symptom}
                style={[
                  styles.multiChoiceButton,
                  mentalHealthSymptoms.includes(symptom) &&
                    styles.selectedChoice,
                ]}
                onPress={() => {
                  if (symptom === 'None') {
                    setMentalHealthSymptoms(['None']);
                  } else {
                    setMentalHealthSymptoms(prev =>
                      prev.includes(symptom)
                        ? prev.filter(item => item !== symptom)
                        : [...prev.filter(item => item !== 'None'), symptom],
                    );
                  }
                }}>
                <Text
                  style={[
                    styles.multiChoiceText,
                    mentalHealthSymptoms.includes(symptom) &&
                      styles.selectedChoiceText,
                  ]}>
                  {symptom}
                </Text>
              </TouchableOpacity>
            ))}
          </View>,
        )}

        {/* Symptom Timing Start Question */}
        {renderQuizQuestionCard(
          11,
          'When Symptoms Start',
          'When do your symptoms typically start?',
          symptomTimingStart,
          'schedule',
          <View>
            {[
              'two weeks before my period',
              'one week before my period',
              'a few days before period',
              'right around my period',
            ].map(timing => (
              <TouchableOpacity
                key={timing}
                style={[
                  styles.singleChoiceButton,
                  symptomTimingStart === timing && styles.selectedChoice,
                ]}
                onPress={() => setSymptomTimingStart(timing)}>
                <Text
                  style={[
                    styles.singleChoiceText,
                    symptomTimingStart === timing && styles.selectedChoiceText,
                  ]}>
                  {timing}
                </Text>
              </TouchableOpacity>
            ))}
          </View>,
        )}

        {/* Symptom Timing Relief Question */}
        {renderQuizQuestionCard(
          12,
          'When Symptoms Get Relief',
          'When do you experience relief from your symptoms?',
          symptomTimingRelief,
          'healing',
          <View>
            {[
              'a few days before my period',
              'when my period starts',
              'several days after my period starts',
            ].map(timing => (
              <TouchableOpacity
                key={timing}
                style={[
                  styles.singleChoiceButton,
                  symptomTimingRelief === timing && styles.selectedChoice,
                ]}
                onPress={() => setSymptomTimingRelief(timing)}>
                <Text
                  style={[
                    styles.singleChoiceText,
                    symptomTimingRelief === timing && styles.selectedChoiceText,
                  ]}>
                  {timing}
                </Text>
              </TouchableOpacity>
            ))}
          </View>,
        )}

        {/* Symptom Severity Question */}
        {renderQuizQuestionCard(
          13,
          'Symptom Severity',
          'How bad do your symptoms get? (rate out of 6)',
          symptomSeverity,
          'sentiment_very_dissatisfied',
          <View>
            <Text style={styles.severityLabels}>
              Rate from 1 (I feel miserable) to 6 (I'm ok)
            </Text>
            <View style={styles.severityContainer}>
              {[1, 2, 3, 4, 5, 6].map(rating => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.severityButton,
                    symptomSeverity === rating && styles.selectedSeverity,
                  ]}
                  onPress={() => setSymptomSeverity(rating)}>
                  <Text
                    style={[
                      styles.severityText,
                      symptomSeverity === rating && styles.selectedSeverityText,
                    ]}>
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>,
        )}

        {/* Suicidal Thoughts Question */}
        {renderQuizQuestionCard(
          21,
          'Suicidal Thoughts',
          'Do you experience thoughts of hurting yourself or ending your life?',
          suicidalThoughts,
          'warning',
          <View>
            {['Yes', 'No'].map(answer => (
              <TouchableOpacity
                key={answer}
                style={[
                  styles.singleChoiceButton,
                  suicidalThoughts === answer && styles.selectedChoice,
                  answer === 'Yes' && styles.warningChoice,
                ]}
                onPress={() => setSuicidalThoughts(answer)}>
                <Text
                  style={[
                    styles.singleChoiceText,
                    suicidalThoughts === answer && styles.selectedChoiceText,
                  ]}>
                  {answer}
                </Text>
              </TouchableOpacity>
            ))}
          </View>,
        )}

        {/* Show contact sections only if user has suicidal thoughts */}
        {suicidalThoughts === 'Yes' && (
          <>
            {/* Emotional Support Contact */}
            {renderContactCard(
              'emotional',
              emotionalContact,
              'Emotional Support Contact',
              'Someone whose presence benefits your well-being. Someone you can have a good time or laugh with.',
            )}

            {/* Practical Support Contact */}
            {renderContactCard(
              'practical',
              practicalContact,
              'Practical Support Contact',
              "Someone who can provide practical support in crisis. Someone who will listen and help with practical things like appointments or being there so you're not alone.",
            )}
          </>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={20} color="#1D4ED8" />
          <Text style={styles.infoText}>
            {suicidalThoughts === 'Yes'
              ? 'Your crisis support contacts are shown because you indicated having thoughts of self-harm. These contacts will be available in EZ mode during difficult times.'
              : 'Your answers help personalize your app experience. Crisis support contacts will only be shown if you indicate having thoughts of self-harm.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D7D7A',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  contactDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 12,
    color: '#2D7D7A',
    marginLeft: 2,
    fontWeight: '500',
  },
  contactInfo: {
    gap: 8,
  },
  contactDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactDetailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  editForm: {
    gap: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  selectBox: {
    borderColor: '#D1D5DB',
  },
  dropdown: {
    borderColor: '#D1D5DB',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2D7D7A',
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#1D4ED8',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  // New styles for quiz editing
  multiChoiceButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  singleChoiceButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  selectedChoice: {
    backgroundColor: '#2D7D7A',
    borderColor: '#2D7D7A',
  },
  multiChoiceText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  singleChoiceText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  selectedChoiceText: {
    color: '#FFFFFF',
  },
  severityLabels: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  severityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  selectedSeverity: {
    backgroundColor: '#2D7D7A',
    borderColor: '#2D7D7A',
  },
  severityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  selectedSeverityText: {
    color: '#FFFFFF',
  },
  warningChoice: {
    borderColor: '#EF4444',
  },
});

export default CrisisSupportReview;
