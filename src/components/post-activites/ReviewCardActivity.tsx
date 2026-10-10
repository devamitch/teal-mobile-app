import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Define types
interface PostActivityConfig {
  id: string;
  tags?: string[];
  question?: string;
  responseType?: string;
  type?: string;
  // Add other properties as needed
}

interface ReviewCardActivityProps {
  activity: PostActivityConfig;
  response?: any;
  onResponseChange: (response: any) => void;
}

const ReviewCardActivity: React.FC<ReviewCardActivityProps> = ({
  activity,
  response,
  onResponseChange,
}) => {
  const hasSetResponse = useRef(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{[key: string]: string}>({});

  // Check if this is the anger management summary activity (3.6.1)
  const isAngerSummaryActivity =
    activity.id === 'activity_3_6_1' ||
    activity.id === '3.6.1' ||
    activity.id?.includes('activity_3_6_1') ||
    activity.id?.includes('3.6.') ||
    (activity.id?.includes('Overall Module Example') &&
      activity.id?.includes('activity_3_6_1')) ||
    activity.question?.includes(
      'strategies that you identified for coping with anger',
    ) ||
    (activity.responseType === 'review' &&
      activity.question?.includes('coping with anger')); // Additional check based on question content

  // Debug logging
  console.log('ReviewCardActivity - Activity ID:', activity.id);
  console.log('ReviewCardActivity - Activity Question:', activity.question);
  console.log('ReviewCardActivity - Response Type:', activity.responseType);
  console.log(
    'ReviewCardActivity - Is Anger Summary Activity:',
    isAngerSummaryActivity,
  );

  // Use the proper detection logic
  const finalIsAngerSummary = isAngerSummaryActivity;

  // Sample data for anger management activities (in real app, this would come from stored responses)
  const angerManagementData = {
    '3.1.1': {
      title: 'PMD-Related Anger & Irritability Impact',
      type: 'text',
      content:
        'Sample reflection on how anger and irritability have affected my relationships, work, and daily activities...',
    },
    '3.2.1': {
      title: 'High-Risk Days for Anger & Irritability',
      type: 'calendar',
      content: 'Days 22-26 of cycle, stressful work meetings, late evenings',
    },
    '3.2.2': {
      title: 'Times When More Irritable',
      type: 'text',
      content:
        'Morning rush hours, after 8 PM, during busy weekdays, when hungry',
    },
    '3.3.1': {
      title: 'Warning Signs',
      type: 'warning_signs',
      content: {
        thoughts: 'I hate my life, everyone is annoying me',
        feelings: 'Overwhelmed, sensitive to loud noises, urge to snap',
        behaviors: 'Snapping at family, avoiding conversations, clenching jaw',
      },
    },
    '3.4.1': {
      title: 'Intervention Strategies',
      type: 'text',
      content:
        'Take a walk, listen to music, deep breathing, call a friend, take a shower',
    },
    '3.4.2': {
      title: 'Avoidance Strategies',
      type: 'text',
      content:
        'Avoid crowded places, skip social events, delegate household tasks, postpone difficult conversations',
    },
    '3.5.1': {
      title: 'Sharing with Loved Ones',
      type: 'text',
      content:
        'Tell partner about my cycle patterns, ask family for understanding during tough days',
    },
    '3.5.2': {
      title: 'Conflict Prevention',
      type: 'text',
      content:
        'Warn family when feeling irritable, use "I need space" signals, plan easier activities together',
    },
  };

  // Use sample data for demo purposes (in real app, would use stored responses)
  const reviewData = finalIsAngerSummary
    ? angerManagementData
    : [
        'Take deep breaths',
        'Practice mindfulness',
        'Exercise regularly',
        'Get enough sleep',
      ];

  useEffect(() => {
    // Only set response once to prevent infinite loops
    if (!hasSetResponse.current && !response) {
      hasSetResponse.current = true;
      onResponseChange({
        reviewed: true,
        timestamp: new Date().toISOString(),
        reviewData,
      });
    }
  }, []); // Empty dependency array to run only once

  const handleEdit = (activityId: string) => {
    if (finalIsAngerSummary) {
      const activityData =
        angerManagementData[activityId as keyof typeof angerManagementData];
      if (activityData.type === 'warning_signs') {
        const warningContent = activityData.content as {
          thoughts: string;
          feelings: string;
          behaviors: string;
        };
        setEditValues({
          [`${activityId}_thoughts`]: warningContent.thoughts,
          [`${activityId}_feelings`]: warningContent.feelings,
          [`${activityId}_behaviors`]: warningContent.behaviors,
        });
      } else {
        setEditValues({[activityId]: activityData.content as string});
      }
      setEditMode(activityId);
    }
  };

  const handleSave = (activityId: string) => {
    Alert.alert(
      'Saved',
      `Your changes for ${activityId} have been saved successfully.`,
    );
    setEditMode(null);
    // In real app, would save to storage/database here
  };

  const handleCancel = () => {
    setEditMode(null);
    setEditValues({});
  };

  const renderAngerManagementSummary = () => {
    return (
      <View>
        {Object.entries(angerManagementData).map(([activityId, data]) => (
          <View key={activityId} style={styles.activitySection}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>{data.title}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(activityId)}>
                <MaterialIcons name="edit" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {editMode === activityId ? (
              <View style={styles.editContainer}>
                {data.type === 'warning_signs' ? (
                  <View>
                    <Text style={styles.subSectionTitle}>Thoughts:</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editValues[`${activityId}_thoughts`] || ''}
                      onChangeText={text =>
                        setEditValues(prev => ({
                          ...prev,
                          [`${activityId}_thoughts`]: text,
                        }))
                      }
                      multiline
                      placeholder="Enter your thoughts..."
                    />

                    <Text style={styles.subSectionTitle}>
                      Feelings & Sensations:
                    </Text>
                    <TextInput
                      style={styles.editInput}
                      value={editValues[`${activityId}_feelings`] || ''}
                      onChangeText={text =>
                        setEditValues(prev => ({
                          ...prev,
                          [`${activityId}_feelings`]: text,
                        }))
                      }
                      multiline
                      placeholder="Enter your feelings and sensations..."
                    />

                    <Text style={styles.subSectionTitle}>Behaviors:</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editValues[`${activityId}_behaviors`] || ''}
                      onChangeText={text =>
                        setEditValues(prev => ({
                          ...prev,
                          [`${activityId}_behaviors`]: text,
                        }))
                      }
                      multiline
                      placeholder="Enter your behaviors..."
                    />
                  </View>
                ) : (
                  <TextInput
                    style={styles.editInput}
                    value={editValues[activityId] || ''}
                    onChangeText={text =>
                      setEditValues(prev => ({...prev, [activityId]: text}))
                    }
                    multiline
                    placeholder="Edit your response..."
                  />
                )}

                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSave(activityId)}>
                    <MaterialIcons name="save" size={16} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.contentContainer}>
                {data.type === 'warning_signs' ? (
                  <View>
                    <View style={styles.warningSectionPreview}>
                      <Text style={styles.warningSubTitle}>Thoughts:</Text>
                      <Text style={styles.warningContent}>
                        {
                          (
                            data.content as {
                              thoughts: string;
                              feelings: string;
                              behaviors: string;
                            }
                          ).thoughts
                        }
                      </Text>
                    </View>
                    <View style={styles.warningSectionPreview}>
                      <Text style={styles.warningSubTitle}>
                        Feelings & Sensations:
                      </Text>
                      <Text style={styles.warningContent}>
                        {
                          (
                            data.content as {
                              thoughts: string;
                              feelings: string;
                              behaviors: string;
                            }
                          ).feelings
                        }
                      </Text>
                    </View>
                    <View style={styles.warningSectionPreview}>
                      <Text style={styles.warningSubTitle}>Behaviors:</Text>
                      <Text style={styles.warningContent}>
                        {
                          (
                            data.content as {
                              thoughts: string;
                              feelings: string;
                              behaviors: string;
                            }
                          ).behaviors
                        }
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.activityContent}>
                    {data.content as string}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderContactList = (contacts: any[]) => (
    <View style={styles.contactList}>
      {contacts.map((contact, index) => (
        <View key={index} style={styles.contactItem}>
          <MaterialIcons name="person" size={20} color="#2D7D7A" />
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactPhone}>{contact.phone}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderStringList = (items: string[]) => (
    <View style={styles.stringList}>
      {items.map((item, index) => (
        <View key={index} style={styles.stringItem}>
          <MaterialIcons name="check-circle" size={16} color="#2D7D7A" />
          <Text style={styles.stringText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  const renderReviewContent = () => {
    // Special case for anger management summary
    if (finalIsAngerSummary) {
      return renderAngerManagementSummary();
    }

    // For regular review data (arrays)
    const regularData = reviewData as any[];
    if (regularData.length === 0) {
      return (
        <Text style={{color: '#999', fontStyle: 'italic'}}>
          No review data available.
        </Text>
      );
    }
    if (typeof regularData[0] === 'object') {
      return renderContactList(regularData);
    } else {
      return renderStringList(regularData as string[]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.reviewCard}>{renderReviewContent()}</View>

        {activity.tags?.includes('ez_mode_access') && (
          <View style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color="#1D4ED8" />
            <Text style={styles.infoText}>
              This information will be available in EZ mode for quick access.
            </Text>
          </View>
        )}

        {activity.tags?.includes('share_option') && (
          <TouchableOpacity style={styles.shareButton}>
            <MaterialIcons name="share" size={20} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>
              Share with Support Network
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contactList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 10,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  contactPhone: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  editButton: {
    padding: 4,
  },
  stringList: {
    gap: 8,
  },
  stringItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stringText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 10,
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#1D4ED8',
    marginLeft: 8,
    flex: 1,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D7D7A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  // New styles for anger management summary
  activitySection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  editContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  editInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D7D7A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activityContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  warningSectionPreview: {
    marginBottom: 12,
  },
  warningSubTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  warningContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

export default ReviewCardActivity;
