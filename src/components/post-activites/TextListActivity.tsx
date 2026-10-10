import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface WarningSignsResponse {
  thoughts: string;
  feelings: string;
  behaviors: string;
}

interface TextListActivityProps {
  activity?: any;
  response?: string[] | WarningSignsResponse;
  onResponseChange: (response: string[] | WarningSignsResponse) => void;
}

const TextListActivity: React.FC<TextListActivityProps> = ({
  activity,
  response = [],
  onResponseChange,
}) => {
  const [inputText, setInputText] = useState('');
  const [savedStatus, setSavedStatus] = useState({
    thoughts: false,
    feelings: false,
    behaviors: false,
    generalText: false, // For regular text input activities
    entireList: false, // For saving the entire list
  });

  // Check if this is the warning signs activity (3.3.1) using multiple ID patterns
  const isWarningSignsActivity =
    activity?.id === 'activity_3_3_1' ||
    activity?.id === '3.3.1' ||
    activity?.id?.includes('activity_3_3_1') ||
    (activity?.id?.includes('Signs of Irritation') &&
      activity?.id?.includes('activity_3_3_1'));

  const [items, setItems] = useState<string[]>(() => {
    if (isWarningSignsActivity) {
      return [];
    }
    return Array.isArray(response) ? response : [];
  });
  const [warningSignsData, setWarningSignsData] =
    useState<WarningSignsResponse>(() => {
      if (
        isWarningSignsActivity &&
        typeof response === 'object' &&
        !Array.isArray(response)
      ) {
        return response as WarningSignsResponse;
      }
      return {thoughts: '', feelings: '', behaviors: ''};
    });
  const onResponseChangeRef = useRef(onResponseChange);
  onResponseChangeRef.current = onResponseChange;

  useEffect(() => {
    if (isWarningSignsActivity) {
      onResponseChangeRef.current(warningSignsData);
    } else {
      onResponseChangeRef.current(items);
    }
  }, [items, warningSignsData, isWarningSignsActivity]);

  const updateWarningSignsResponse = (
    field: keyof WarningSignsResponse,
    text: string,
  ) => {
    const newData = {...warningSignsData, [field]: text};
    setWarningSignsData(newData);
    // Reset saved status when text changes
    setSavedStatus(prev => ({...prev, [field]: false}));
  };

  const handleSaveSection = (field: keyof WarningSignsResponse) => {
    if (warningSignsData[field].trim()) {
      setSavedStatus(prev => ({...prev, [field]: true}));
      Alert.alert('Saved', `Your ${field} have been saved successfully.`);
      // Optionally trigger haptic feedback here if available
    } else {
      Alert.alert('Error', `Please enter some ${field} before saving.`);
    }
  };

  const handleSaveGeneralText = () => {
    if (inputText.trim()) {
      setSavedStatus(prev => ({...prev, generalText: true}));
      Alert.alert('Saved', 'Your text has been saved successfully.');
      // Optionally trigger haptic feedback here if available
    } else {
      Alert.alert('Error', 'Please enter some text before saving.');
    }
  };

  const handleSaveEntireList = () => {
    if (items.length > 0) {
      setSavedStatus(prev => ({...prev, entireList: true}));
      Alert.alert(
        'Saved',
        `Your list of ${items.length} item${
          items.length === 1 ? '' : 's'
        } has been saved successfully.`,
      );
      // Optionally trigger haptic feedback here if available
    } else {
      Alert.alert('Error', 'Please add some items to the list before saving.');
    }
  };

  const handleTextInputChange = (text: string) => {
    setInputText(text);
    // Reset saved status when text changes
    setSavedStatus(prev => ({...prev, generalText: false}));
  };

  const handleAddItem = () => {
    if (inputText.trim()) {
      const newItems = [...items, inputText.trim()];
      setItems(newItems);
      setInputText('');
      // Reset saved status when list changes
      setSavedStatus(prev => ({...prev, entireList: false}));
    } else {
      Alert.alert('Error', 'Please enter some text before adding.');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    // Reset saved status when list changes
    setSavedStatus(prev => ({...prev, entireList: false}));
  };

  return (
    <View style={styles.container}>
      {isWarningSignsActivity ? (
        <View>
          {/* Warning Signs Activity - Three separate text boxes */}
          <View style={styles.warningSectionContainer}>
            <Text style={styles.warningSectionTitle}>Thoughts:</Text>
            <Text style={styles.warningSectionExample}>
              Ex. I hate my life, my kids are spoiled brats
            </Text>
            <TextInput
              style={styles.warningSectionInput}
              placeholder="List your thoughts when you're highly irritable..."
              value={warningSignsData.thoughts}
              onChangeText={text =>
                updateWarningSignsResponse('thoughts', text)
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[
                styles.saveButton,
                savedStatus.thoughts && styles.saveButtonSaved,
              ]}
              onPress={() => handleSaveSection('thoughts')}
              activeOpacity={0.7}>
              <MaterialIcons
                name={savedStatus.thoughts ? 'check' : 'save'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.saveButtonText}>
                {savedStatus.thoughts ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.warningSectionContainer}>
            <Text style={styles.warningSectionTitle}>
              Feelings & Sensations:
            </Text>
            <Text style={styles.warningSectionExample}>
              Ex. Overwhelmed, Sensitive to loud noises, Urge to kick my dog
            </Text>
            <TextInput
              style={styles.warningSectionInput}
              placeholder="List your feelings and sensations when you're highly irritable..."
              value={warningSignsData.feelings}
              onChangeText={text =>
                updateWarningSignsResponse('feelings', text)
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[
                styles.saveButton,
                savedStatus.feelings && styles.saveButtonSaved,
              ]}
              onPress={() => handleSaveSection('feelings')}
              activeOpacity={0.7}>
              <MaterialIcons
                name={savedStatus.feelings ? 'check' : 'save'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.saveButtonText}>
                {savedStatus.feelings ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.warningSectionContainer}>
            <Text style={styles.warningSectionTitle}>Behaviors:</Text>
            <Text style={styles.warningSectionExample}>
              Ex. Snapping at husband, Grumpy with the kids
            </Text>
            <TextInput
              style={styles.warningSectionInput}
              placeholder="List your behaviors when you're highly irritable..."
              value={warningSignsData.behaviors}
              onChangeText={text =>
                updateWarningSignsResponse('behaviors', text)
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[
                styles.saveButton,
                savedStatus.behaviors && styles.saveButtonSaved,
              ]}
              onPress={() => handleSaveSection('behaviors')}
              activeOpacity={0.7}>
              <MaterialIcons
                name={savedStatus.behaviors ? 'check' : 'save'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.saveButtonText}>
                {savedStatus.behaviors ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter triggers and warning signs..."
              value={inputText}
              onChangeText={handleTextInputChange}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.saveButtonInline,
                savedStatus.generalText && styles.saveButtonSaved,
              ]}
              onPress={handleSaveGeneralText}
              activeOpacity={0.7}>
              <MaterialIcons
                name={savedStatus.generalText ? 'check' : 'save'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.saveButtonText}>
                {savedStatus.generalText ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <MaterialIcons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {items.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>
                Your triggers and warning signs:
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {items.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listItemText}>{item}</Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveItem(index)}>
                      <MaterialIcons name="close" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={[
                  styles.saveAllButton,
                  savedStatus.entireList && styles.saveButtonSaved,
                ]}
                onPress={handleSaveEntireList}
                activeOpacity={0.7}>
                <MaterialIcons
                  name={savedStatus.entireList ? 'check' : 'save'}
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.saveAllButtonText}>
                  {savedStatus.entireList ? 'List Saved' : 'Save All Items'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingBottom: 100, // Add bottom padding to prevent Complete button overlay
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    minHeight: 44,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#2D7D7A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  listContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  warningSectionContainer: {
    marginBottom: 24,
  },
  warningSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  warningSectionExample: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  warningSectionInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    minHeight: 100,
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#2D7D7A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  saveButtonInline: {
    backgroundColor: '#2D7D7A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonSaved: {
    backgroundColor: '#10B981',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  saveAllButton: {
    backgroundColor: '#2D7D7A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  saveAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default TextListActivity;
