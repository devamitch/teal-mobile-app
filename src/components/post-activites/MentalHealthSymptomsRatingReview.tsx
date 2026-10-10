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
import Slider from '@react-native-community/slider';
import useAppStore from '@/core/stores';
import Colors from '@/constants/colors';

interface MentalHealthSymptomsRatingReviewProps {
  activity?: any;
  response?: any;
  onResponseChange: (response: any) => void;
}

const MentalHealthSymptomsRatingReview: React.FC<
  MentalHealthSymptomsRatingReviewProps
> = ({onResponseChange}) => {
  const {getQuizWithID, addQuiz} = useAppStore(state => state.engagement);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSymptoms, setEditedSymptoms] = useState<string[]>([]);
  const [symptomRatings, setSymptomRatings] = useState<{[key: string]: number}>(
    {},
  );

  // Get mental health symptoms from onboarding screen 7 (quiz ID 10)
  const mentalHealthData = getQuizWithID(10);
  const originalSymptoms = mentalHealthData?.answer || [];

  useEffect(() => {
    // Initialize edited symptoms with original data
    if (Array.isArray(originalSymptoms)) {
      setEditedSymptoms(
        originalSymptoms.filter(
          symptom => symptom !== 'None' && symptom !== 'Skipped',
        ),
      );

      // Initialize ratings for existing symptoms
      const initialRatings: {[key: string]: number} = {};
      originalSymptoms
        .filter(symptom => symptom !== 'None' && symptom !== 'Skipped')
        .forEach(symptom => {
          initialRatings[symptom] = 3; // Default to middle rating
        });
      setSymptomRatings(initialRatings);
    }

    // If no symptoms were selected during onboarding, automatically enter edit mode
    if (
      !Array.isArray(originalSymptoms) ||
      originalSymptoms.length === 0 ||
      (originalSymptoms.length === 1 &&
        (originalSymptoms[0] === 'None' || originalSymptoms[0] === 'Skipped'))
    ) {
      setIsEditing(true);
      setEditedSymptoms([]);
      setSymptomRatings({});
    }
  }, [originalSymptoms]);

  const availableSymptoms = [
    'Sadness or Depression',
    'Anxiety',
    'Sudden sadness or tearfulness or mood swings',
    'Anger or irritability',
  ];

  const handleSymptomToggle = (symptom: string) => {
    setEditedSymptoms(prev => {
      const newSymptoms = prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom];

      // Update ratings - add new symptom with default rating or remove rating
      setSymptomRatings(prevRatings => {
        const newRatings = {...prevRatings};
        if (newSymptoms.includes(symptom) && !prevRatings[symptom]) {
          newRatings[symptom] = 3; // Default middle rating
        } else if (!newSymptoms.includes(symptom)) {
          delete newRatings[symptom];
        }
        return newRatings;
      });

      return newSymptoms;
    });
  };

  const handleRatingChange = (symptom: string, rating: number) => {
    setSymptomRatings(prev => ({
      ...prev,
      [symptom]: rating,
    }));
  };

  const handleSaveChanges = () => {
    // Update the onboarding quiz data with new symptoms
    const updatedQuizData = {
      id: 10,
      question: `Which of the following mental health symptoms bother you the most in the weeks leading up to your period?`,
      answer: editedSymptoms.length > 0 ? editedSymptoms : ['None'],
    };
    addQuiz(updatedQuizData);

    // Update activity response
    const wasFirstTimeSelection =
      !Array.isArray(originalSymptoms) ||
      originalSymptoms.length === 0 ||
      (originalSymptoms.length === 1 &&
        (originalSymptoms[0] === 'None' || originalSymptoms[0] === 'Skipped'));

    onResponseChange({
      reviewed: true,
      completed: true, // Always mark as completed when saving changes
      timestamp: new Date().toISOString(),
      originalSymptoms,
      editedSymptoms,
      symptomRatings,
      wasEdited: !wasFirstTimeSelection,
      wasFirstTimeSelection,
    });

    setIsEditing(false);
    const message = wasFirstTimeSelection
      ? 'Your mental health symptoms and ratings have been saved.'
      : 'Your mental health symptoms and ratings have been updated.';
    Alert.alert('Success', message);
  };

  const handleCancelEdit = () => {
    const filteredOriginal = Array.isArray(originalSymptoms)
      ? originalSymptoms.filter(
          symptom => symptom !== 'None' && symptom !== 'Skipped',
        )
      : [];
    setEditedSymptoms(filteredOriginal);

    // Reset ratings to original or default
    const resetRatings: {[key: string]: number} = {};
    filteredOriginal.forEach(symptom => {
      resetRatings[symptom] = symptomRatings[symptom] || 3;
    });
    setSymptomRatings(resetRatings);

    setIsEditing(false);
  };

  const handleDoneReviewing = () => {
    onResponseChange({
      reviewed: true,
      completed: true, // Add completed flag to trigger activity completion
      timestamp: new Date().toISOString(),
      originalSymptoms,
      editedSymptoms: originalSymptoms.filter(
        (symptom: string) => symptom !== 'None' && symptom !== 'Skipped',
      ),
      symptomRatings,
      wasEdited: false,
      wasFirstTimeSelection: false,
    });
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

  const renderRatingScale = (symptom: string) => (
    <View key={`rating-${symptom}`} style={styles.ratingContainer}>
      <Text style={styles.ratingQuestion}>
        How much does "{symptom}" annoy you? (1-5 scale)
      </Text>
      <View style={styles.ratingLabels}>
        <Text style={styles.ratingLabel}>Not at all</Text>
        <Text style={styles.ratingLabel}>Extremely</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={symptomRatings[symptom] || 3}
        onValueChange={value => handleRatingChange(symptom, value)}
        minimumTrackTintColor={Colors.lightGreen}
        maximumTrackTintColor="#E5E7EB"
        thumbTintColor={Colors.lightGreen}
        disabled={isEditing}
      />
      <View style={styles.ratingValue}>
        <Text style={styles.ratingValueText}>
          Rating: {symptomRatings[symptom] || 3}/5
        </Text>
      </View>
    </View>
  );

  const currentSymptoms = isEditing
    ? editedSymptoms
    : originalSymptoms.filter(
        (symptom: string) => symptom !== 'None' && symptom !== 'Skipped',
      );
  const hasSymptoms = currentSymptoms.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <MaterialIcons name="psychology" size={24} color="#2D7D7A" />
          <Text style={styles.headerTitle}>
            Review Your Mental Health Symptoms
          </Text>
        </View>

        <Text style={styles.description}>
          {hasSymptoms
            ? 'Review the mental health symptoms you selected during onboarding and rate how much they annoy you.'
            : 'No symptoms were selected during onboarding. Please select the mental health symptoms that apply to you.'}
        </Text>

        {/* Symptoms Review Card */}
        <View style={styles.reviewCard}>
          <View style={styles.reviewCardHeader}>
            <MaterialIcons name="checklist" size={20} color="#2D7D7A" />
            <Text style={styles.reviewCardTitle}>Your Selected Symptoms</Text>
            {!isEditing && hasSymptoms && (
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
            <View style={styles.symptomsContainer}>
              <Text style={styles.editingHelpText}>
                Please select the mental health symptoms that bother you the
                most in the weeks leading up to your period:
              </Text>
              {availableSymptoms.map(symptom =>
                renderSymptomItem(symptom, editedSymptoms.includes(symptom)),
              )}
            </View>
          ) : hasSymptoms ? (
            // Show only selected symptoms when not editing
            <View style={styles.symptomsContainer}>
              {currentSymptoms.map((symptom: string) =>
                renderSymptomItem(symptom, true),
              )}
            </View>
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

        {/* Rating Scales Section */}
        {hasSymptoms && !isEditing && (
          <View style={styles.ratingsSection}>
            <View style={styles.ratingSectionHeader}>
              <MaterialIcons name="star_rate" size={20} color="#2D7D7A" />
              <Text style={styles.ratingSectionTitle}>Rate Your Symptoms</Text>
            </View>
            <Text style={styles.ratingSectionDescription}>
              Rate how much each symptom annoys you on a scale of 1-5:
            </Text>
            {currentSymptoms.map((symptom: string) =>
              renderRatingScale(symptom),
            )}
          </View>
        )}

        {/* Action Buttons for Review Mode */}
        {!isEditing && hasSymptoms && (
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
            This information helps personalize your experience. The ratings help
            us understand how symptoms affect you personally.
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
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
    marginLeft: 8,
  },
  symptomsContainer: {
    gap: 8,
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
  editingHelpText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
    fontStyle: 'italic',
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
  ratingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ratingSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  ratingSectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  ratingContainer: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  ratingQuestion: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  ratingValue: {
    alignItems: 'center',
    marginTop: 8,
  },
  ratingValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D7D7A',
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
  reviewActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
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

export default MentalHealthSymptomsRatingReview;
