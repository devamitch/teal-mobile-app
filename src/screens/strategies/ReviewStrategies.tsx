import useAppStore from '@/core/stores';
import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';

const ReviewStrategies = ({navigation}: {navigation: any}) => {
  const {getStatergiesWithID, setStatergyWithID} = useAppStore(
    state => state.engagement,
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedAnswer, setEditedAnswer] = useState<string>('');

  const strategiesData = [
    {
      id: 0,
      question: 'What moment makes you feel truly alive?',
      answer: getStatergiesWithID(0)?.answer ?? '',
    },
    {
      id: 1,
      question: 'Which moment helps you feel balanced?',
      answer: getStatergiesWithID(1)?.answer ?? '',
    },
    {
      id: 2,
      question: 'Which activity gets your heart racing?',
      answer: getStatergiesWithID(2)?.answer ?? '',
    },
    {
      id: 3,
      question: 'What steps help you slow down and breathe with ease?',
      answer: getStatergiesWithID(3)?.answer ?? '',
    },
  ];

  const handleEdit = (index: number, currentAnswer: string) => {
    setEditingIndex(index);
    setEditedAnswer(currentAnswer);
  };

  const handleSave = (id: number) => {
    setStatergyWithID(id, editedAnswer);
    setEditingIndex(null);
    setEditedAnswer('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.headerTitle}>Review Strategies</Text>

          {strategiesData.map((item, index) => (
            <View key={index} style={styles.qaContainer}>
              <View style={styles.questionHeader}>
                <Text style={styles.question}>{item.question}</Text>
                {editingIndex !== index ? (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(index, item.answer)}>
                    <MaterialIcons
                      name="edit"
                      size={20}
                      color={Colors.lightGreen}
                    />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {editingIndex === index ? (
                <>
                  <TextInput
                    style={styles.answerInput}
                    value={editedAnswer}
                    onChangeText={setEditedAnswer}
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSave(item.id)}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.answer}>
                  {item.answer || 'No answer provided'}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 4,
    borderColor: Colors.lightGreen,
    borderWidth: 1,
  },
  editButtonText: {
    color: Colors.lightGreen,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  qaContainer: {
    marginBottom: 24,
    backgroundColor: '#FAFBFC', // Light background
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
  },
  question: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.black,
    flexShrink: 1,
    marginRight: 10,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  answer: {
    fontSize: 16,
    color: Colors.darkGrayColor,
    lineHeight: 24,
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  answerInput: {
    fontSize: 16,
    color: Colors.darkGrayColor,
    lineHeight: 24,
    fontFamily: FONT_FAMILIES.LatoRegular,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
});

export default ReviewStrategies;
