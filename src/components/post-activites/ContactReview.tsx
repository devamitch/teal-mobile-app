import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SelectList} from 'react-native-dropdown-select-list';
import {useAppStore} from '@/core/stores';

interface ContactInfo {
  contactName: string;
  phoneNumber: string;
  relationship: string;
}

interface ContactReviewProps {
  activity?: any;
  response?: any;
  onResponseChange: (response: any) => void;
}

const ContactReview: React.FC<ContactReviewProps> = ({onResponseChange}) => {
  const {getQuizWithID, addQuiz} = useAppStore(state => state.engagement);
  const [editingContactType, setEditingContactType] = useState<
    'emotional' | 'practical' | null
  >(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use ref to avoid dependency issues with onResponseChange
  const onResponseChangeRef = useRef(onResponseChange);
  onResponseChangeRef.current = onResponseChange;

  // Get emotional and practical support data from onboarding
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

      // Set initial response
      onResponseChangeRef.current({
        reviewed: true,
        timestamp: new Date().toISOString(),
        emotionalSupport: emotionalSupportData?.answer,
        practicalSupport: practicalSupportData?.answer,
      });

      setIsInitialized(true);
    }
  }, [
    isInitialized,
    emotionalSupportData?.answer,
    practicalSupportData?.answer,
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
      wasEdited: true,
    });

    setEditingContactType(null);
    Alert.alert('Success', `Your ${type} support contact has been updated.`);
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

    setEditingContactType(null);
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
              onPress={() => setEditingContactType(type)}>
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
            <Text style={styles.emptyStateText}>No contact added</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap edit to add contact
            </Text>
          </View>
        ) : (
          <View style={styles.contactInfo}>
            <View style={styles.contactDetail}>
              <MaterialIcons name="person" size={18} color="#6B7280" />
              <Text style={styles.contactDetailText}>
                {contact.contactName}
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
                <MaterialIcons name="people" size={18} color="#6B7280" />
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
      <View style={styles.headerContainer}>
        <MaterialIcons name="support-agent" size={24} color="#2D7D7A" />
        <Text style={styles.headerTitle}>Support Contacts</Text>
      </View>

      <Text style={styles.description}>
        Review and update your support contacts for crisis situations.
      </Text>

      {renderContactCard(
        'emotional',
        emotionalContact,
        'Emotional Support Contact',
        'Enter the contact information of at least one person whose mere presence would benefit your well-being in that moment.',
      )}

      {renderContactCard(
        'practical',
        practicalContact,
        'Practical Support Contact',
        'Enter the contact of at least one person who can provide practical support when you are in crisis.',
      )}

      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={16} color="#1D4ED8" />
        <Text style={styles.infoText}>
          Having both emotional and practical support contacts helps ensure you
          have the right type of help when you need it most.
        </Text>
      </View>
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
});

export default ContactReview;
