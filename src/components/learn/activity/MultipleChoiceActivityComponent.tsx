import {lightTheme} from '@/constants/colors';
import {
  ActivityResponse,
  MultipleChoiceActivity,
} from '@/core/stores/slices/playlist/types';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface MultipleChoiceActivityProps {
  activity: MultipleChoiceActivity;
  response?: ActivityResponse<MultipleChoiceActivity>;
  onResponseChange: (
    response: ActivityResponse<MultipleChoiceActivity>,
  ) => void;
}

export const VideoMultipleChoiceActivityComponent: React.FC<
  MultipleChoiceActivityProps
> = ({activity, response, onResponseChange}) => {
  const selectedOptions =
    activity.responseType === 'single'
      ? response && 'selectedId' in response
        ? [response.selectedId as string]
        : []
      : response && 'selectedIds' in response
      ? response.selectedIds
      : [];
  // response?.selectedIds;
  const handleOptionSelect = (optionId: string) => {
    if (activity.responseType === 'single') {
      onResponseChange({
        selectedId: optionId,
      } as ActivityResponse<MultipleChoiceActivity>);
    } else {
      const newSelection = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
      onResponseChange({
        selectedIds: newSelection,
      } as ActivityResponse<MultipleChoiceActivity>);
    }
  };

  const isSelected = (optionId: string) => selectedOptions.includes(optionId);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {activity.options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              isSelected(option.id) && styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect(option.id)}>
            <Text style={styles.optionText}>{option.text}</Text>
            <MaterialIcons
              name={
                activity.responseType === 'single'
                  ? isSelected(option.id)
                    ? 'radio-button-checked'
                    : 'radio-button-unchecked'
                  : isSelected(option.id)
                  ? 'check-box'
                  : 'check-box-outline-blank'
              }
              size={24}
              color={isSelected(option.id) ? lightTheme.gradientMiddle : '#CCC'}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    borderColor: lightTheme.gradientMiddle,
    backgroundColor: '#F0F9FF',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  incorrectOption: {
    borderColor: '#FF5252',
    backgroundColor: '#FFE8E8',
  },
  optionText: {
    fontSize: 14,
    flex: 1,
    marginRight: 16,
  },
  feedbackContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  correctFeedback: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  incorrectFeedback: {
    backgroundColor: '#FFE8E8',
    borderColor: '#FF5252',
    borderWidth: 1,
  },
  feedbackText: {
    fontSize: 14,
  },
});

export default VideoMultipleChoiceActivityComponent;
