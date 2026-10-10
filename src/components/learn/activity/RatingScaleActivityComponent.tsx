import {lightTheme} from '@/constants/colors';
import {
  ActivityResponse,
  RatingScaleActivity,
} from '@/core/stores/slices/playlist/types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface RatingScaleActivityProps {
  activity: RatingScaleActivity;
  response?: ActivityResponse<RatingScaleActivity>;
  onResponseChange: (response: ActivityResponse<RatingScaleActivity>) => void;
}

export const VideoRatingScaleActivityComponent: React.FC<
  RatingScaleActivityProps
> = ({activity, response, onResponseChange}) => {
  const [rating, setRating] = useState(response?.rating || 0);
  const {min, max, minLabel, maxLabel} = activity.scaleRange;

  useEffect(() => {
    if (rating >= min && rating <= max) {
      onResponseChange({rating});
    }
  }, [rating, min, max, onResponseChange]);

  const scaleValues = Array.from({length: max - min + 1}, (_, i) => min + i);

  return (
    <View style={styles.container}>
      <View style={styles.scaleContainer}>
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>{minLabel}</Text>
          <Text style={styles.scaleLabel}>{maxLabel}</Text>
        </View>

        <View style={styles.scaleButtons}>
          {scaleValues.map(value => (
            <TouchableOpacity
              key={value}
              style={[
                styles.scaleButton,
                rating === value && styles.selectedScaleButton,
              ]}
              onPress={() => setRating(value)}>
              <Text
                style={[
                  styles.scaleButtonText,
                  rating === value && styles.selectedScaleButtonText,
                ]}>
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
  scaleContainer: {
    marginTop: 16,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scaleLabel: {
    fontSize: 12,
    color: '#666',
  },
  scaleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  selectedScaleButton: {
    borderColor: lightTheme.gradientMiddle,
    backgroundColor: lightTheme.gradientMiddle,
  },
  scaleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  selectedScaleButtonText: {
    color: '#FFF',
  },
});

export default VideoRatingScaleActivityComponent;
