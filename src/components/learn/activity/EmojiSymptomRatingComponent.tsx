import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {lightTheme} from '@/constants/colors';

// Use text emojis for simplicity and compatibility
const EmojiList = [
  {id: '1', emoji: '😤', MoodName: 'Cranky', value: 1},
  {id: '2', emoji: '😰', MoodName: 'Stressed', value: 2},
  {id: '3', emoji: '😔', MoodName: 'Down', value: 3},
  {id: '4', emoji: '😴', MoodName: 'Wiped', value: 4},
  {id: '5', emoji: '😌', MoodName: 'Serene', value: 5},
  {id: '6', emoji: '😊', MoodName: 'Joyful', value: 6},
];

interface EmojiSymptomRatingProps {
  activity: {
    question: string;
    description?: string;
    symptoms: Array<{id: string; text: string}>;
  };
  onResponseChange: (response: {[key: string]: number}) => void;
}

const EmojiSymptomRatingComponent: React.FC<EmojiSymptomRatingProps> = ({
  activity,
  onResponseChange,
}) => {
  const [ratings, setRatings] = useState<{[key: string]: number}>({});

  useEffect(() => {
    // Only send response if all symptoms are rated
    const allSymptomsRated = activity.symptoms.every(
      symptom => ratings[symptom.id] !== undefined,
    );

    if (allSymptomsRated) {
      onResponseChange(ratings);
    }
  }, [ratings, activity.symptoms, onResponseChange]);

  const handleSymptomRating = (symptomId: string, emojiValue: number) => {
    setRatings(prev => ({
      ...prev,
      [symptomId]: emojiValue,
    }));
  };

  const renderEmojiScale = (symptomId: string, currentRating: number) => {
    return (
      <View style={styles.emojiContainer}>
        {EmojiList.map(emoji => {
          const isSelected = currentRating === emoji.value;

          return (
            <TouchableOpacity
              key={emoji.id}
              style={[
                styles.emojiButton,
                isSelected && styles.selectedEmojiButton,
              ]}
              onPress={() => handleSymptomRating(symptomId, emoji.value)}>
              <View style={styles.emojiWrapper}>
                <Text style={styles.emojiText}>{emoji.emoji}</Text>
              </View>
              {/* <Text
                style={[
                  styles.emojiLabel,
                  isSelected && styles.selectedEmojiLabel,
                ]}>
                {emoji.MoodName}
              </Text> */}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {activity.symptoms.map(symptom => (
          <View key={symptom.id} style={styles.symptomContainer}>
            <Text style={styles.symptomTitle}>{symptom.text}</Text>
            <Text style={styles.symptomSubtitle}>
              How does this symptom make you feel?
            </Text>
            {renderEmojiScale(symptom.id, ratings[symptom.id] || 0)}
          </View>
        ))}

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {Object.keys(ratings).length} of {activity.symptoms.length} symptoms
            rated
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  symptomContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  symptomTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  symptomSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  emojiButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    minWidth: 60,
    flex: 1,
  },
  selectedEmojiButton: {
    backgroundColor: lightTheme.primary + '20',
    borderWidth: 2,
    borderColor: lightTheme.primary,
  },
  emojiWrapper: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  emojiText: {
    fontSize: 32,
  },
  emojiLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedEmojiLabel: {
    color: lightTheme.primary,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default EmojiSymptomRatingComponent;
