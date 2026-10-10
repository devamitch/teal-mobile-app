import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {lightTheme} from '@/constants/colors';
import {PostActivityConfig} from '@/data/videoData';

interface RatingScaleActivityProps {
  activity: PostActivityConfig;
  response?: {[key: string]: number} | number;
  onResponseChange: (
    activityId: string,
    response: {[key: string]: number} | number,
  ) => void;
}

const RatingScaleActivity: React.FC<RatingScaleActivityProps> = ({
  activity,
  response,
  onResponseChange,
}) => {
  const [ratings, setRatings] = useState<{[key: string]: number}>(
    typeof response === 'object' ? response || {} : {},
  );
  const [singleRating, setSingleRating] = useState(
    typeof response === 'number' ? response : 0, // Changed: Use null for "no selection"
  );

  const hasInitialized = useRef(false);
  const scale = activity.scaleRange || {
    min: 1,
    max: 5,
    minLabel: 'Low',
    maxLabel: 'High',
  };
  const hasMultipleItems = activity.options && activity.options.length > 0;

  // Initialize from existing response
  useEffect(() => {
    if (response && !hasInitialized.current) {
      hasInitialized.current = true;
      if (hasMultipleItems && typeof response === 'object') {
        setRatings(response);
      } else if (!hasMultipleItems && typeof response === 'number') {
        setSingleRating(response);
      }
    }
  }, [response, hasMultipleItems]);

  // Notify parent of changes (deferred to avoid setState during render)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasMultipleItems) {
        // Only send response if all required items are rated
        const allItemsRated = activity.options?.every(
          option => ratings[option.id] && ratings[option.id] >= scale.min,
        );
        if (allItemsRated) {
          onResponseChange(activity.id, ratings);
        }
      } else {
        // Only send response if single rating is valid (within scale range)
        if (singleRating >= scale.min && singleRating <= scale.max) {
          onResponseChange(activity.id, singleRating);
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [
    ratings,
    singleRating,
    hasMultipleItems,
    activity.id,
    onResponseChange,
    scale.min,
    scale.max,
    activity.options,
  ]);

  const handleRating = (itemId: string, rating: number) => {
    console.log(`Rating ${itemId}: ${rating}`); // Debug log
    setRatings(prev => ({
      ...prev,
      [itemId]: rating,
    }));
  };

  const handleSingleRating = (rating: number) => {
    console.log(`Single rating: ${rating}`); // Debug log
    setSingleRating(rating);
  };

  // Check if activity is completed
  const isCompleted = () => {
    if (hasMultipleItems) {
      return (
        activity.options?.every(
          option => ratings[option.id] && ratings[option.id] >= scale.min,
        ) || false
      );
    } else {
      return singleRating >= scale.min && singleRating <= scale.max;
    }
  };

  const renderRatingScale = (
    itemId: string,
    currentRating: number,
    onRate: (rating: number) => void,
  ) => {
    const scaleValues = Array.from(
      {length: scale.max - scale.min + 1},
      (_, i) => scale.min + i,
    );

    return (
      <View style={styles.scaleContainer}>
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>{scale.minLabel}</Text>
          <Text style={styles.scaleLabel}>{scale.maxLabel}</Text>
        </View>

        <View style={styles.scaleButtons}>
          {scaleValues.map(value => (
            <TouchableOpacity
              key={value}
              style={[
                styles.scaleButton,
                currentRating === value && styles.selectedScaleButton,
              ]}
              onPress={() => onRate(value)}>
              <Text
                style={[
                  styles.scaleButtonText,
                  currentRating === value && styles.selectedScaleButtonText,
                ]}>
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Debug: Log completion status
  useEffect(() => {
    console.log(`Activity ${activity.id} completion status:`, isCompleted());
    console.log('Current ratings:', hasMultipleItems ? ratings : singleRating);
  }, [ratings, singleRating]);

  return (
    <View style={styles.container}>
      {/* Debug info - remove in production */}
      <Text style={styles.debugText}>
        Status: {isCompleted() ? 'Completed' : 'Incomplete'}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {hasMultipleItems ? (
          activity.options?.map(option => (
            <View key={option.id} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{option.text}</Text>
              {renderRatingScale(option.id, ratings[option.id] || 0, rating =>
                handleRating(option.id, rating),
              )}
            </View>
          ))
        ) : (
          <View style={styles.itemContainer}>
            {renderRatingScale('single', singleRating, handleSingleRating)}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  scaleContainer: {
    alignItems: 'center',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  scaleLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  scaleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  scaleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#DDD',
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

export default RatingScaleActivity;
