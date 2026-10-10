import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface SafetyPlanReviewProps {
  activity?: any;
  response?: any;
  onResponseChange: (response: any) => void;
}

const SafetyPlanReview: React.FC<SafetyPlanReviewProps> = ({
  onResponseChange,
}) => {
  // Use ref to avoid dependency issues with onResponseChange
  const onResponseChangeRef = useRef(onResponseChange);
  onResponseChangeRef.current = onResponseChange;

  const [reviewData, setReviewData] = useState<any>({});

  useEffect(() => {
    // Initialize with sample data for now
    // In a real implementation, this would collect data from previous activities
    const collectedData: any = {
      triggers: ['Feeling overwhelmed', 'Lack of sleep', 'Work stress'],
      groundingTechniques: [
        'Deep breathing',
        'Cold water on face',
        'Listen to music',
      ],
      reasonsForLiving: 'My family, my goals, and the hope for better days.',
      supportContacts: {
        emotionalSupport: {
          contactName: 'Sample Contact',
          phoneNumber: '555-0123',
          relationship: 'Friend',
        },
      },
      safetyMeasures:
        'Remove harmful items from easy access, create a safe space.',
      timestamp: new Date().toISOString(),
    };

    setReviewData(collectedData);
    onResponseChangeRef.current(collectedData);
  }, []); // Empty dependency array to run only once

  const handleEditSection = (sectionId: string) => {
    Alert.alert(
      'Edit Section',
      'Would you like to go back and edit this section?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Edit',
          onPress: () => {
            // Here you would navigate back to the specific activity
            // This would be implemented based on your navigation structure
            console.log(`Navigate to edit section: ${sectionId}`);
          },
        },
      ],
    );
  };

  const renderSection = (
    title: string,
    icon: string,
    content: any,
    sectionId: string,
    isEmpty: boolean = false,
  ) => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name={icon as any} size={20} color="#2D7D7A" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditSection(sectionId)}>
          <MaterialIcons name="edit" size={16} color="#2D7D7A" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {isEmpty ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="help-outline" size={24} color="#9CA3AF" />
          <Text style={styles.emptyStateText}>No information added</Text>
        </View>
      ) : (
        <View style={styles.sectionContent}>{content}</View>
      )}
    </View>
  );

  const renderTriggersList = () => {
    if (!reviewData.triggers || reviewData.triggers.length === 0) return null;

    return (
      <View>
        {reviewData.triggers.map((trigger: string, index: number) => (
          <View key={index} style={styles.listItem}>
            <MaterialIcons
              name="fiber-manual-record"
              size={8}
              color="#6B7280"
            />
            <Text style={styles.listItemText}>{trigger}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderGroundingTechniques = () => {
    if (
      !reviewData.groundingTechniques ||
      reviewData.groundingTechniques.length === 0
    )
      return null;

    return (
      <View>
        {reviewData.groundingTechniques.map(
          (technique: string, index: number) => (
            <View key={index} style={styles.listItem}>
              <MaterialIcons
                name="fiber-manual-record"
                size={8}
                color="#6B7280"
              />
              <Text style={styles.listItemText}>{technique}</Text>
            </View>
          ),
        )}
      </View>
    );
  };

  const renderSupportContacts = () => {
    const {emotionalSupport, practicalSupport} =
      reviewData.supportContacts || {};

    if (!emotionalSupport && !practicalSupport) return null;

    return (
      <View>
        {emotionalSupport && (
          <View style={styles.contactItem}>
            <Text style={styles.contactType}>Emotional Support:</Text>
            <Text style={styles.contactDetails}>
              {emotionalSupport.contactName} - {emotionalSupport.phoneNumber}
            </Text>
            <Text style={styles.contactRelationship}>
              ({emotionalSupport.relationship})
            </Text>
          </View>
        )}
        {practicalSupport && (
          <View style={styles.contactItem}>
            <Text style={styles.contactType}>Practical Support:</Text>
            <Text style={styles.contactDetails}>
              {practicalSupport.contactName} - {practicalSupport.phoneNumber}
            </Text>
            <Text style={styles.contactRelationship}>
              ({practicalSupport.relationship})
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons name="assignment" size={24} color="#2D7D7A" />
        <Text style={styles.headerTitle}>Safety Plan Review</Text>
      </View>

      <Text style={styles.description}>
        Review your complete safety plan. You can edit any section by tapping
        the edit button.
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderSection(
          'Triggers & Warning Signs',
          'warning',
          renderTriggersList(),
          'triggers',
          !reviewData.triggers || reviewData.triggers.length === 0,
        )}

        {renderSection(
          'Grounding Techniques',
          'self-improvement',
          renderGroundingTechniques(),
          'grounding',
          !reviewData.groundingTechniques ||
            reviewData.groundingTechniques.length === 0,
        )}

        {renderSection(
          'Reasons for Living',
          'favorite',
          <Text style={styles.textContent}>{reviewData.reasonsForLiving}</Text>,
          'reasons',
          !reviewData.reasonsForLiving,
        )}

        {renderSection(
          'Support Contacts',
          'contacts',
          renderSupportContacts(),
          'contacts',
          !reviewData.supportContacts?.emotionalSupport &&
            !reviewData.supportContacts?.practicalSupport,
        )}

        {renderSection(
          'Safety Measures',
          'security',
          <Text style={styles.textContent}>{reviewData.safetyMeasures}</Text>,
          'safety',
          !reviewData.safetyMeasures,
        )}
      </ScrollView>

      <View style={styles.completionCard}>
        <MaterialIcons name="check-circle" size={20} color="#10B981" />
        <Text style={styles.completionText}>
          Your safety plan is now complete and ready to use during difficult
          times.
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
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
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
  sectionContent: {
    paddingLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  textContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  contactItem: {
    marginBottom: 12,
  },
  contactType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  contactDetails: {
    fontSize: 14,
    color: '#374151',
  },
  contactRelationship: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  completionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  completionText: {
    fontSize: 14,
    color: '#065F46',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default SafetyPlanReview;
