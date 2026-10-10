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
import {lightTheme} from '@/constants/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PostActivityConfig} from '@/data/videoData';

interface TextInputActivityProps {
  activity: PostActivityConfig;
  response?: string | string[];
  onResponseChange: (response: string | string[]) => void;
}

const TextInputActivity: React.FC<TextInputActivityProps> = ({
  activity,
  response,
  onResponseChange,
}) => {
  const [currentInput, setCurrentInput] = useState('');
  const [responses, setResponses] = useState<string[]>(
    Array.isArray(response) ? response : response ? [response] : [],
  );
  const [savedStatus, setSavedStatus] = useState({
    multiInput: false,
    singleInput: false,
  });
  const onResponseChangeRef = useRef(onResponseChange);
  onResponseChangeRef.current = onResponseChange;

  useEffect(() => {
    if (activity.hasAddMore) {
      onResponseChangeRef.current(responses);
    } else {
      onResponseChangeRef.current(responses[0] || '');
    }
  }, [responses, activity.hasAddMore]);

  const addResponse = () => {
    if (currentInput.trim()) {
      setResponses(prev => [...prev, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const removeResponse = (index: number) => {
    setResponses(prev => prev.filter((_, i) => i !== index));
  };

  const updateSingleResponse = (text: string) => {
    setResponses([text]);
    // Reset saved status when text changes
    setSavedStatus(prev => ({...prev, singleInput: false}));
  };

  const handleCurrentInputChange = (text: string) => {
    setCurrentInput(text);
    // Reset saved status when text changes
    setSavedStatus(prev => ({...prev, multiInput: false}));
  };

  const handleSaveMultiInput = () => {
    if (currentInput.trim()) {
      setSavedStatus(prev => ({...prev, multiInput: true}));
      Alert.alert('Saved', 'Your input has been saved successfully.');
    } else {
      Alert.alert('Error', 'Please enter some text before saving.');
    }
  };

  const handleSaveSingleInput = () => {
    if (responses[0]?.trim()) {
      setSavedStatus(prev => ({...prev, singleInput: true}));
      Alert.alert('Saved', 'Your response has been saved successfully.');
    } else {
      Alert.alert('Error', 'Please enter some text before saving.');
    }
  };

  return (
    <View style={styles.container}>
      {activity.examples && (
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Examples:</Text>
          {activity.examples.map((example, index) => (
            <Text key={index} style={styles.exampleText}>
              • {example}
            </Text>
          ))}
        </View>
      )}

      {activity.hasAddMore ? (
        <View>
          {/* Display existing responses */}
          {responses.map((resp, index) => (
            <View key={index} style={styles.responseItem}>
              <Text style={styles.responseText}>{resp}</Text>
              <TouchableOpacity
                onPress={() => removeResponse(index)}
                style={styles.removeButton}>
                <MaterialIcons name="close" size={16} color="#FF5252" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Input for new response */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your response..."
              value={currentInput}
              onChangeText={handleCurrentInputChange}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[
                styles.saveButton,
                savedStatus.multiInput && styles.saveButtonSaved,
              ]}
              onPress={handleSaveMultiInput}
              activeOpacity={0.7}>
              <MaterialIcons
                name={savedStatus.multiInput ? 'check' : 'save'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.saveButtonText}>
                {savedStatus.multiInput ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addButton,
                !currentInput.trim() && styles.addButtonDisabled,
              ]}
              onPress={addResponse}
              disabled={!currentInput.trim()}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.singleTextInput}
            placeholder="Type your response..."
            value={responses[0] || ''}
            onChangeText={updateSingleResponse}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[
              styles.saveButtonSingle,
              savedStatus.singleInput && styles.saveButtonSaved,
            ]}
            onPress={handleSaveSingleInput}
            activeOpacity={0.7}>
            <MaterialIcons
              name={savedStatus.singleInput ? 'check' : 'save'}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.saveButtonText}>
              {savedStatus.singleInput ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  examplesContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
  responseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  responseText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    maxHeight: 80,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: lightTheme.gradientMiddle,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#CCC',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  singleTextInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: '#2D7D7A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonSingle: {
    backgroundColor: '#2D7D7A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-end',
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
});

export default TextInputActivity;
