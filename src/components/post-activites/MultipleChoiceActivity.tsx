import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PostActivityConfig} from '@/data/videoData';

interface MultipleChoiceActivityProps {
  activity: PostActivityConfig;
  response?: string | string[];
  onResponseChange: (response: string | string[]) => void;
}

const MultipleChoiceActivity: React.FC<MultipleChoiceActivityProps> = ({
  activity,
  response,
  onResponseChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Array.isArray(response) ? response : response ? [response] : [],
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const onResponseChangeRef = useRef(onResponseChange);
  onResponseChangeRef.current = onResponseChange;

  useEffect(() => {
    if (activity.responseType === 'single') {
      onResponseChangeRef.current(selectedOptions[0] || '');
    } else {
      onResponseChangeRef.current(selectedOptions);
    }
  }, [selectedOptions, activity.responseType]);

  const handleOptionSelect = (optionId: string) => {
    if (activity.responseType === 'single') {
      setSelectedOptions([optionId]);

      // Show feedback for educational questions
      if (activity.correctAnswer) {
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 3000);
      }
    } else {
      setSelectedOptions(prev => {
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId);
        } else {
          const newSelection = [...prev, optionId];
          if (
            activity.maxSelections &&
            newSelection.length > activity.maxSelections
          ) {
            return prev; // Don't allow selection beyond max
          }
          return newSelection;
        }
      });
    }
  };

  const isSelected = (optionId: string) => selectedOptions.includes(optionId);

  const isCorrectAnswer = (optionId: string) =>
    activity.correctAnswer === optionId;

  const groupedOptions =
    activity.options?.reduce((acc, option) => {
      const category = option.category || 'default';
      if (!acc[category]) acc[category] = [];
      acc[category].push(option);
      return acc;
    }, {} as {[key: string]: typeof activity.options}) || {};

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(groupedOptions).map(([category, options]) => (
          <View key={category} style={styles.categoryContainer}>
            {category !== 'default' && (
              <Text style={styles.categoryTitle}>{category}</Text>
            )}

            {options.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  isSelected(option.id) && styles.selectedOption,
                  showFeedback &&
                    isCorrectAnswer(option.id) &&
                    styles.correctOption,
                  showFeedback &&
                    isSelected(option.id) &&
                    !isCorrectAnswer(option.id) &&
                    styles.incorrectOption,
                ]}
                onPress={() => handleOptionSelect(option.id)}>
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected(option.id) && styles.selectedOptionText,
                    ]}>
                    {option.text}
                  </Text>

                  {isSelected(option.id) && (
                    <MaterialIcons
                      name={
                        activity.responseType === 'single'
                          ? 'radio-button-checked'
                          : 'check-box'
                      }
                      size={20}
                      color="#2D7D7A"
                    />
                  )}

                  {!isSelected(option.id) && (
                    <MaterialIcons
                      name={
                        activity.responseType === 'single'
                          ? 'radio-button-unchecked'
                          : 'check-box-outline-blank'
                      }
                      size={20}
                      color="#D1D5DB"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Feedback section */}
      {showFeedback && (
        <View
          style={[
            styles.feedbackContainer,
            isCorrectAnswer(selectedOptions[0])
              ? styles.correctFeedback
              : styles.incorrectFeedback,
          ]}>
          <MaterialIcons
            name={
              isCorrectAnswer(selectedOptions[0]) ? 'check-circle' : 'error'
            }
            size={20}
            color={isCorrectAnswer(selectedOptions[0]) ? '#4CAF50' : '#FF5252'}
          />
          <Text style={styles.feedbackText}>
            {isCorrectAnswer(selectedOptions[0])
              ? activity.correctFeedback
              : activity.incorrectFeedback}
          </Text>
        </View>
      )}

      {/* Selection count for multiple choice */}
      {activity.responseType !== 'single' && (
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            Selected: {selectedOptions.length}
            {activity.minSelections && ` (min: ${activity.minSelections})`}
            {activity.maxSelections && ` (max: ${activity.maxSelections})`}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    borderColor: '#2D7D7A',
    backgroundColor: '#F0F9FF',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  incorrectOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#2D7D7A',
    fontWeight: '500',
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  correctFeedback: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  incorrectFeedback: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  feedbackText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  selectionInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  selectionText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default MultipleChoiceActivity;
