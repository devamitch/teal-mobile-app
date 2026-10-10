import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useAppStore from '@/core/stores';

interface MentalHealthSymptomsReviewProps {
  activity?: any;
  response?: any;
  onResponseChange: (response: any) => void;
}

const MentalHealthSymptomsReview: React.FC<MentalHealthSymptomsReviewProps> = ({
  onResponseChange,
}) => {
  const {getQuizWithID, addQuiz} = useAppStore(state => state.engagement);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSymptoms, setEditedSymptoms] = useState<string[]>([]);

  // Get mental health symptoms from onboarding screen 7 (quiz ID 10)
  const mentalHealthData = getQuizWithID(10);
  const originalSymptoms = mentalHealthData?.answer || [];

  useEffect(() => {
    // Initialize edited symptoms with original data
    if (Array.isArray(originalSymptoms)) {
      setEditedSymptoms(originalSymptoms);
    }

    // If no symptoms were selected during onboarding, automatically enter edit mode
    if (!Array.isArray(originalSymptoms) || originalSymptoms.length === 0) {
      setIsEditing(true);
      setEditedSymptoms([]);
    }

    // Don't auto-trigger response on mount - let user interact first
    // The response will be triggered when user saves or finishes reviewing
  }, [originalSymptoms]);

  const availableSymptoms = [
    'Depressed mood, sadness, feeling down, blue, or empty',
    'Anxiety, tension, feeling keyed up, or on edge',
    'Mood swings',
    'Irritability or persistent anger',
    'Decreased interest in usual activities (e.g., work, school, friends, hobbies)',
    'Difficulty concentrating',
    'Lethargy, easy fatigability, or marked lack of energy',
    'Marked change in appetite, overeating, or specific food cravings',
    'Hypersomnia or insomnia',
    'Feeling overwhelmed or out of control',
    'Physical symptoms (e.g., breast tenderness or swelling, joint or muscle pain, a sensation of "bloating," weight gain)',
  ];

  const handleSymptomToggle = (symptom: string) => {
    setEditedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handleDoneReviewing = () => {
    // Mark as reviewed without editing
    onResponseChange({
      reviewed: true,
      completed: true, // Add completed flag to trigger activity completion
      timestamp: new Date().toISOString(),
      originalSymptoms,
      editedSymptoms: originalSymptoms,
      wasEdited: false,
      wasFirstTimeSelection: false,
    });
  };

  const handleSaveChanges = () => {
    // Update the onboarding quiz data with new symptoms
    const updatedQuizData = {
      id: 10,
      question: `Which of the following mental health symptoms bother you the most in the weeks leading up to your period?`,
      answer: editedSymptoms,
    };
    addQuiz(updatedQuizData);

    // Update activity response
    const wasFirstTimeSelection =
      !Array.isArray(originalSymptoms) || originalSymptoms.length === 0;
    onResponseChange({
      reviewed: true,
      completed: true, // Always mark as completed when saving changes
      timestamp: new Date().toISOString(),
      originalSymptoms,
      editedSymptoms,
      wasEdited: !wasFirstTimeSelection,
      wasFirstTimeSelection,
    });

    setIsEditing(false);
    const message = wasFirstTimeSelection
      ? 'Your mental health symptoms have been saved.'
      : 'Your mental health symptoms have been updated.';
    Alert.alert('Success', message);
  };

  const handleCancelEdit = () => {
    setEditedSymptoms(Array.isArray(originalSymptoms) ? originalSymptoms : []);
    setIsEditing(false);
  };

  const renderSymptomItem = (symptom: string, isSelected: boolean) => (
    <TouchableOpacity
      key={symptom}
      style={[
        styles.symptomItem,
        isSelected && styles.selectedSymptomItem,
        !isEditing && styles.readOnlyItem,
      ]}
      onPress={() => isEditing && handleSymptomToggle(symptom)}
      disabled={!isEditing}>
      <View style={styles.symptomContent}>
        <MaterialIcons
          name={isSelected ? 'check-circle' : 'radio-button-unchecked'}
          size={20}
          color={isSelected ? '#2D7D7A' : '#D1D5DB'}
        />
        <Text
          style={[
            styles.symptomText,
            isSelected && styles.selectedSymptomText,
          ]}>
          {symptom}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <MaterialIcons name="psychology" size={24} color="#2D7D7A" />
          <Text style={styles.headerTitle}>Mental Health Symptoms Review</Text>
        </View>

        <Text style={styles.description}>
          {Array.isArray(originalSymptoms) && originalSymptoms.length > 0
            ? 'These are the mental health symptoms you selected during onboarding. You can review and update them if needed.'
            : 'No symptoms were selected during onboarding. Please select the mental health symptoms that apply to you.'}
        </Text>

        {/* Symptoms List */}
        <View style={styles.symptomsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isEditing
                ? 'Select symptoms that apply to you:'
                : 'Your current symptoms:'}
            </Text>
            {!isEditing &&
              Array.isArray(originalSymptoms) &&
              originalSymptoms.length > 0 && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}>
                  <MaterialIcons name="edit" size={18} color="#2D7D7A" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
          </View>

          {isEditing ? (
            // Show all available symptoms when editing
            <View>
              {(!Array.isArray(originalSymptoms) ||
                originalSymptoms.length === 0) && (
                <Text style={styles.editingHelpText}>
                  Please select the mental health symptoms that bother you the
                  most in the weeks leading up to your period:
                </Text>
              )}
              {availableSymptoms.map(symptom =>
                renderSymptomItem(symptom, editedSymptoms.includes(symptom)),
              )}
            </View>
          ) : // Show only selected symptoms when not editing
          Array.isArray(originalSymptoms) && originalSymptoms.length > 0 ? (
            originalSymptoms.map(symptom => renderSymptomItem(symptom, true))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="info" size={24} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>
                No mental health symptoms were selected during onboarding.
              </Text>
              <TouchableOpacity
                style={styles.startEditingButton}
                onPress={() => setIsEditing(true)}>
                <Text style={styles.startEditingButtonText}>
                  Select Symptoms
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Action Buttons for Review Mode */}
        {!isEditing &&
          Array.isArray(originalSymptoms) &&
          originalSymptoms.length > 0 && (
            <View style={styles.reviewActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Edit Symptoms</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleDoneReviewing}>
                <Text style={styles.doneButtonText}>Done Reviewing</Text>
              </TouchableOpacity>
            </View>
          )}

        {/* Action Buttons for Editing */}
        {isEditing && (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEdit}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={20} color="#1D4ED8" />
          <Text style={styles.infoText}>
            This information helps personalize your experience and will be
            available in EZ mode for quick access.
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
  symptomsContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#2D7D7A',
    marginLeft: 4,
    fontWeight: '500',
  },
  symptomItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedSymptomItem: {
    borderColor: '#2D7D7A',
    backgroundColor: '#F0F9FF',
  },
  readOnlyItem: {
    backgroundColor: '#F9FAFB',
  },
  symptomContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  symptomText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  selectedSymptomText: {
    color: '#2D7D7A',
    fontWeight: '500',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2D7D7A',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 16,
  },
  startEditingButton: {
    backgroundColor: '#2D7D7A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startEditingButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  editingHelpText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
    fontStyle: 'italic',
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
  reviewActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  doneButton: {
    flex: 1,
    backgroundColor: '#2D7D7A',
    paddingVertical: 12,
    borderRadius: 8,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default MentalHealthSymptomsReview;
