import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PostActivityConfig} from '@/data/videoData';
import AlertBox from '@/components/ui/modal/alert-box';

interface ChecklistActivityProps {
  activity: PostActivityConfig;
  response?: string[];
  onResponseChange: (response: string[]) => void;
}

const ChecklistActivity: React.FC<ChecklistActivityProps> = ({
  activity,
  response,
  onResponseChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    response || [],
  );
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState('');

  // Alert box states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const onResponseChangeRef = useRef(onResponseChange);
  onResponseChangeRef.current = onResponseChange;

  useEffect(() => {
    onResponseChangeRef.current(selectedOptions);
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

        // Check max selections
        if (
          activity.maxSelections &&
          newSelection.length > activity.maxSelections
        ) {
          showAlert(
            'Selection Limit',
            `You can select a maximum of ${activity.maxSelections} options.`,
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
      const newCustomOption = {
        id: customId,
        text: customText.trim(),
        category: 'Custom',
      };

      setCustomOptions(prev => [...prev, newCustomOption.text]);
      setSelectedOptions(prev => [...prev, customId]);
      setCustomText('');
      setShowCustomInput(false);
    }
  };

  const isSelected = (optionId: string) => selectedOptions.includes(optionId);

  // Group options by category
  const groupedOptions =
    activity.options?.reduce((acc, option) => {
      const category = option.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(option);
      return acc;
    }, {} as {[key: string]: typeof activity.options}) || {};

  // Add custom options to the grouped structure
  if (customOptions.length > 0) {
    groupedOptions['Custom'] = customOptions.map((text, index) => ({
      id: `custom_${Date.now()}_${index}`,
      text,
      category: 'Custom',
    }));
  }

  const getSelectionStatus = () => {
    const selected = selectedOptions.length;
    const min = activity.minSelections || 0;
    const max = activity.maxSelections;

    let status = `${selected} selected`;
    if (min > 0) status += ` (min: ${min})`;
    if (max) status += ` (max: ${max})`;

    return status;
  };

  const getStatusColor = () => {
    const selected = selectedOptions.length;
    const min = activity.minSelections || 0;

    if (selected < min) return '#FF5252';
    if (selected >= min) return '#4CAF50';
    return '#666';
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'stimulating the five senses':
        return 'sensors';
      case "changing my body's temperature":
        return 'thermostat';
      case 'intense exercise':
        return 'fitness-center';
      case 'distracting myself':
        return 'games';
      case 'mindfulness activities':
        return 'self-improvement';
      case 'custom':
        return 'add-circle';
      default:
        return 'check-box-outline-blank';
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Selection Status */}
          <View style={styles.statusContainer}>
            <MaterialIcons
              name="checklist"
              size={20}
              color={getStatusColor()}
            />
            <Text style={[styles.statusText, {color: getStatusColor()}]}>
              {getSelectionStatus()}
            </Text>
          </View>

          {/* Instruction */}
          {activity.minSelections && (
            <View style={styles.instructionCard}>
              <MaterialIcons name="info" size={16} color="#2196F3" />
              <Text style={styles.instructionText}>
                Please select at least {activity.minSelections} option
                {activity.minSelections > 1 ? 's' : ''} that would be helpful
                for you.
              </Text>
            </View>
          )}

          {/* Options by Category */}
          {Object.entries(groupedOptions).map(([category, options]) => (
            <View key={category} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <MaterialIcons
                  name={getCategoryIcon(category)}
                  size={18}
                  color="#2D7D7A"
                />
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.categoryCount}>
                  {options.filter(opt => isSelected(opt.id)).length}/
                  {options.length}
                </Text>
              </View>

              {options.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    isSelected(option.id) && styles.selectedOption,
                  ]}
                  onPress={() => handleOptionToggle(option.id)}>
                  <View style={styles.optionContent}>
                    <MaterialIcons
                      name={
                        isSelected(option.id)
                          ? 'check-box'
                          : 'check-box-outline-blank'
                      }
                      size={20}
                      color={isSelected(option.id) ? '#2D7D7A' : '#D1D5DB'}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isSelected(option.id) && styles.selectedOptionText,
                      ]}>
                      {option.text}
                    </Text>
                  </View>

                  {isSelected(option.id) && (
                    <View style={styles.selectedIndicator}>
                      <MaterialIcons name="done" size={16} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Add Custom Option */}
          {activity.hasAddMore && (
            <View style={styles.customSection}>
              {!showCustomInput ? (
                <TouchableOpacity
                  style={styles.addCustomButton}
                  onPress={() => setShowCustomInput(true)}>
                  <MaterialIcons
                    name="add-circle-outline"
                    size={20}
                    color="#2D7D7A"
                  />
                  <Text style={styles.addCustomText}>Add your own option</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.customInputContainer}>
                  <TextInput
                    style={styles.customInput}
                    placeholder="Enter your own grounding technique..."
                    value={customText}
                    onChangeText={setCustomText}
                    multiline
                    autoFocus
                  />
                  <View style={styles.customInputActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setShowCustomInput(false);
                        setCustomText('');
                      }}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.addButton,
                        !customText.trim() && styles.addButtonDisabled,
                      ]}
                      onPress={handleAddCustomOption}
                      disabled={!customText.trim()}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Summary */}
          {selectedOptions.length > 0 && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Your Selected Techniques:</Text>
              <Text style={styles.summaryText}>
                You've chosen {selectedOptions.length} grounding technique
                {selectedOptions.length > 1 ? 's' : ''} that you can use in
                different settings when you need to take a step back.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <AlertBox
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onModalHide={() => {}}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    color: '#1D4ED8',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  categoryCount: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    borderColor: '#2D7D7A',
    backgroundColor: '#F0F9FF',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  selectedOptionText: {
    color: '#2D7D7A',
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2D7D7A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2D7D7A',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  addCustomText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D7D7A',
    marginLeft: 8,
  },
  customInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  customInputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  addButton: {
    backgroundColor: '#2D7D7A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
});

export default ChecklistActivity;
