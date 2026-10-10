import {
  ActivityResponse,
  TextActivity,
} from '@/core/stores/slices/playlist/types';
import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {saveActivityResponseToDB} from '@/services/sqlite/activity-responses';

interface TextActivityProps {
  activity: TextActivity;
  response?: ActivityResponse<TextActivity>;
  onResponseChange: (response: ActivityResponse<TextActivity>) => void;
}

const TextActivityComponent: React.FC<TextActivityProps> = ({
  activity,
  response,
  onResponseChange,
}) => {
  const [text, setText] = useState(response?.text || '');
  const [isSaving, setIsSaving] = useState(false);

  // Handle text changes and notify parent component
  const handleTextChange = useCallback(
    (newText: string) => {
      setText(newText);
      onResponseChange({text: newText});
    },
    [onResponseChange],
  );

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      const success = await saveActivityResponseToDB({
        video_id: 'current_video', // You might want to get this from context/props
        activity_id: activity.id,
        response_text: text,
        response_type: 'single',
      });

      if (success) {
        Alert.alert('Success', 'Your response has been saved!');
      } else {
        Alert.alert('Error', 'Failed to save response. Please try again.');
      }
    } catch (error) {
      console.error('Error saving activity response:', error);
      Alert.alert('Error', 'Failed to save response. Please try again.');
    } finally {
      setIsSaving(false);
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

      <TextInput
        style={styles.textInput}
        placeholder="Type your response..."
        value={text}
        onChangeText={handleTextChange}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Save Button for 3.1.1 */}
      {(activity.id === '3.1.1' || activity.type === 'text') && (
        <TouchableOpacity
          style={[
            styles.saveButton,
            isSaving && styles.saveButtonDisabled,
            (!text || !text.trim()) && styles.saveButtonDisabled,
          ]}
          onPress={handleSaveToDatabase}
          disabled={isSaving || !text || !text.trim()}>
          <MaterialIcons
            name={isSaving ? 'hourglass-empty' : 'save'}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Response'}
          </Text>
        </TouchableOpacity>
      )}
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
  examplesContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D7D7A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default TextActivityComponent;
