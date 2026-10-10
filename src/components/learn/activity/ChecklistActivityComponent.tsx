import AlertBox from '@/components/ui/modal/alert-box';
import {lightTheme} from '@/constants/colors';
import {
  ActivityResponse,
  ChecklistActivity,
} from '@/core/stores/slices/playlist/types';
import React, {useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ChecklistActivityProps {
  activity: ChecklistActivity;
  response?: ActivityResponse<ChecklistActivity>;
  onResponseChange: (response: ActivityResponse<ChecklistActivity>) => void;
}

export const VideoChecklistActivityComponent: React.FC<
  ChecklistActivityProps
> = ({activity, response, onResponseChange}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    response?.selectedIds || [],
  );
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const onResponseChangeRef = useRef(onResponseChange);
  onResponseChangeRef.current = onResponseChange;

  useEffect(() => {
    onResponseChangeRef.current({selectedIds: selectedOptions});
  }, [selectedOptions]);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        const newSelection = [...prev, optionId];
        if (
          activity.minSelections &&
          newSelection.length < activity.minSelections
        ) {
          showAlert(
            'Minimum Selection',
            `Please select at least ${activity.minSelections} options.`,
          );
          return prev;
        }
        return newSelection;
      }
    });
  };

  const handleAddCustomOption = () => {
    if (customText.trim()) {
      const customId = `custom_${Date.now()}`;
      setCustomOptions(prev => [...prev, customText.trim()]);
      setSelectedOptions(prev => [...prev, customId]);
      setCustomText('');
      setShowCustomInput(false);
    }
  };

  const isSelected = (optionId: string) => selectedOptions.includes(optionId);

  const groupedOptions = activity.options.reduce((acc, option) => {
    const category = option.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(option);
    return acc;
  }, {} as {[key: string]: typeof activity.options});

  if (customOptions.length > 0) {
    groupedOptions['Custom'] = customOptions.map((text, index) => ({
      id: `custom_${index}`,
      text,
      category: 'Custom',
    }));
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {Object.entries(groupedOptions).map(([category, options]) => (
            <View key={category} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {options.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    isSelected(option.id) && styles.selectedOption,
                  ]}
                  onPress={() => handleOptionToggle(option.id)}>
                  <MaterialIcons
                    name={
                      isSelected(option.id)
                        ? 'check-box'
                        : 'check-box-outline-blank'
                    }
                    size={24}
                    color={
                      isSelected(option.id) ? lightTheme.gradientMiddle : '#CCC'
                    }
                  />
                  <Text style={styles.optionText}>{option.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {activity.hasAddMore && (
            <View style={styles.customSection}>
              {!showCustomInput ? (
                <TouchableOpacity
                  style={styles.addCustomButton}
                  onPress={() => setShowCustomInput(true)}>
                  <Text style={styles.addCustomText}>Add your own option</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.customInputContainer}>
                  <TextInput
                    style={styles.customInput}
                    placeholder="Enter your option..."
                    value={customText}
                    onChangeText={setCustomText}
                  />
                  <View style={styles.customInputActions}>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddCustomOption}
                      disabled={!customText.trim()}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <AlertBox
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onModalHide={() => setAlertVisible(false)}
      />
    </>
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
  categoryContainer: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: lightTheme.gradientMiddle,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#F0F9FF',
    borderColor: lightTheme.gradientMiddle,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
  customSection: {
    marginTop: 16,
  },
  addCustomButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  addCustomText: {
    color: lightTheme.gradientMiddle,
    fontWeight: '600',
  },
  customInputContainer: {
    marginTop: 8,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  customInputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButton: {
    backgroundColor: lightTheme.gradientMiddle,
    padding: 8,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default VideoChecklistActivityComponent;
