import type React from 'react';
import {useCallback, useMemo, useState, useRef} from 'react';
import {FONT_FAMILIES, lightTheme} from '@/constants';
import useAppStore from '@/core/stores';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {useShallow} from 'zustand/react/shallow';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Toast} from '@/utils/toast';

const {width} = Dimensions.get('screen');

// Example preferences to suggest to the user
const EXAMPLE_PREFERENCES = [
  'Talk to me in a supportive tone',
  'Keep your responses concise',
  'Use friendly language',
  'Provide detailed explanations',
  'Be encouraging',
] as const;

interface PreferenceModalProps {
  visible: boolean;
  onRequestClose: () => void;
}

const PreferenceModal: React.FC<PreferenceModalProps> = ({
  visible,
  onRequestClose,
}) => {
  // Simplified state - just track the current input text
  const [currentInput, setCurrentInput] = useState('');

  // Track which examples have been used (permanently removed from quick examples)
  // Use useRef to maintain this across modal opens/closes and preference changes
  const usedExamplesRef = useRef<Set<string>>(new Set());
  const [usedExamples, setUsedExamples] = useState<Set<string>>(
    usedExamplesRef.current,
  );

  // Store preferences using shallow selector for better performance
  const {preferences, addPreference, removePreference, clearPreference} =
    useAppStore(
      useShallow(state => ({
        preferences: state.engagement.preferences,
        addPreference: state.engagement.addPreference,
        removePreference: state.engagement.removePreference,
        clearPreference: state.engagement.clearPreference,
      })),
    );

  // Handle adding a new preference
  const handleAddPreference = useCallback(() => {
    const trimmedInput = currentInput.trim();
    if (!trimmedInput) {
      Toast('Please enter a preference.');
      return;
    }

    // Check for duplicates
    if (preferences.includes(trimmedInput)) {
      Toast('This preference already exists.');
      return;
    }

    addPreference(trimmedInput);
    setCurrentInput(''); // Clear input after adding
  }, [currentInput, preferences, addPreference]);

  // Handle example preference selection
  const handleExamplePress = useCallback(
    (example: string) => {
      // Check if already exists
      if (preferences.includes(example)) {
        Toast('This preference already exists.');
        return;
      }

      // Add to preferences
      addPreference(example);

      // Permanently mark this example as used
      const newUsedExamples = new Set([...usedExamplesRef.current, example]);
      usedExamplesRef.current = newUsedExamples;
      setUsedExamples(newUsedExamples);
    },
    [preferences, addPreference],
  );

  // Handle preference removal
  const handleRemovePreference = useCallback(
    (preferenceToRemove: string) => {
      removePreference(preferenceToRemove);
      // Note: We DON'T remove from usedExamples here - once used, permanently removed from quick examples
    },
    [removePreference],
  );

  // Handle clearing all preferences
  const handleClearAll = useCallback(() => {
    clearPreference();
    setCurrentInput('');
    // Note: We DON'T reset usedExamples here - once used, permanently removed from quick examples
  }, [clearPreference]);

  // Handle text input submission (Enter key)
  const handleSubmitEditing = useCallback(() => {
    handleAddPreference();
  }, [handleAddPreference]);

  // Reset state when modal closes
  const handleModalClose = useCallback(() => {
    setCurrentInput('');
    onRequestClose();
  }, [onRequestClose]);

  // Get available examples (never used examples)
  const availableExamples = useMemo(
    () => EXAMPLE_PREFERENCES.filter(example => !usedExamples.has(example)),
    [usedExamples],
  );

  // Check if all examples have been used
  const allExamplesUsed = useMemo(
    () => usedExamples.size === EXAMPLE_PREFERENCES.length,
    [usedExamples],
  );

  // Memoized example buttons - only show examples that have never been used
  const exampleButtons = useMemo(
    () =>
      availableExamples.map((example, index) => (
        <TouchableOpacity
          key={`example-${example}`}
          onPress={() => handleExamplePress(example)}
          style={styles.exampleButton}>
          <Text style={styles.exampleText}>{example}</Text>
        </TouchableOpacity>
      )),
    [availableExamples, handleExamplePress],
  );

  // Memoized preference list
  const preferenceList = useMemo(
    () =>
      preferences.map((preference, index) => (
        <View
          key={`preference-${preference}-${index}`}
          style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>{preference}</Text>
          <TouchableOpacity
            onPress={() => handleRemovePreference(preference)}
            style={styles.deleteButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Ionicons
              name="trash-outline"
              color={lightTheme.primary}
              size={width * 0.05}
            />
          </TouchableOpacity>
        </View>
      )),
    [preferences, handleRemovePreference],
  );

  return (
    <Modal
      visible={visible}
      onRequestClose={handleModalClose}
      animationType="slide"
      transparent={true}
      statusBarTranslucent>
      <GestureHandlerRootView style={styles.mainContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.titleText}>Preferences</Text>

          <ScrollView
            style={styles.preferenceContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {/* Example preferences section - only show if there are available examples AND not all are used */}
            {!allExamplesUsed && availableExamples.length > 0 && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Quick Examples :</Text>
                <View style={styles.examplesList}>{exampleButtons}</View>
              </View>
            )}

            {/* Current preferences list */}
            {preferences.length > 0 && (
              <View style={styles.currentPreferencesContainer}>
                <Text style={styles.currentPreferencesTitle}>
                  Your Preferences :
                </Text>
                {preferenceList}
              </View>
            )}

            {/* Add new preference input */}
            <View style={styles.addPreferenceContainer}>
              <TextInput
                style={styles.textInput}
                value={currentInput}
                onChangeText={setCurrentInput}
                onSubmitEditing={handleSubmitEditing}
                placeholder={
                  allExamplesUsed
                    ? 'Add your custom preference...'
                    : 'Enter your preference...'
                }
                placeholderTextColor="#999"
                multiline={false}
                returnKeyType="done"
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.addButton,
                  !currentInput.trim() && styles.addButtonDisabled,
                ]}
                onPress={handleAddPreference}
                disabled={!currentInput.trim()}>
                <Ionicons
                  name="add"
                  size={20}
                  color={currentInput.trim() ? '#ffffff' : '#ccc'}
                />
              </TouchableOpacity>
            </View>

            {/* Show helpful message when all examples are used but no current preferences */}
            {allExamplesUsed && preferences.length === 0 && (
              <View style={styles.helpMessageContainer}>
                <Text style={styles.helpMessageText}>
                  💡 All quick examples have been explored! Add your own custom
                  preferences above.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Bottom action buttons */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[
                styles.clearButton,
                preferences.length === 0 && styles.clearButtonDisabled,
              ]}
              onPress={handleClearAll}
              disabled={preferences.length === 0}>
              <Text
                style={[
                  styles.clearButtonText,
                  preferences.length === 0 && styles.clearButtonTextDisabled,
                ]}>
                Clear All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleModalClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    borderRadius: 20,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    width: '90%',
    maxWidth: 400,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '80%',
  },
  titleText: {
    fontSize: 20,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    paddingBottom: 16,
    color: lightTheme.primary,
  },
  preferenceContainer: {
    borderColor: lightTheme.buttonBorder,
    borderWidth: 1,
    borderRadius: 16,
    width: '100%',
    maxHeight: 400,
    marginBottom: 16,
  },
  examplesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.buttonBorder,
  },
  examplesTitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: lightTheme.primary,
    marginBottom: 8,
  },
  examplesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  exampleButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  exampleText: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.LatoRegular,
    color: lightTheme.primary,
    textAlign: 'center',
  },
  helpMessageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  helpMessageText: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.LatoRegular,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  currentPreferencesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  currentPreferencesTitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: lightTheme.primary,
    marginBottom: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceText: {
    flex: 1,
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
  },
  addPreferenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontSize: 15,
    backgroundColor: '#fafbfc',
    color: '#333',
  },
  addButton: {
    backgroundColor: lightTheme.primary,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addButtonDisabled: {
    backgroundColor: '#e9ecef',
    elevation: 0,
    shadowOpacity: 0,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  clearButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  clearButtonDisabled: {
    borderColor: '#e9ecef',
    backgroundColor: '#f1f3f4',
  },
  clearButtonText: {
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    fontSize: 14,
    color: '#dc3545',
    textAlign: 'center',
  },
  clearButtonTextDisabled: {
    color: '#999',
  },
  closeButton: {
    backgroundColor: lightTheme.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
  },
  closeButtonText: {
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default PreferenceModal;
