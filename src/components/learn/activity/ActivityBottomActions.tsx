import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ActivityBottomActionsProps {
  currentActivityIndex: number;
  totalActivities: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const ActivityBottomActions: React.FC<ActivityBottomActionsProps> = ({
  currentActivityIndex,
  totalActivities,
  isSubmitting,
  onPrevious,
  onNext,
}) => {
  return (
    <Animated.View
      style={styles.bottomActions}
      entering={SlideInDown?.delay(200)}
      exiting={SlideOutDown?.delay(200)}>
      <View style={styles.bottomGradient}>
        <View style={styles.actionButtons}>
          {currentActivityIndex > 0 && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onPrevious}
              activeOpacity={0.8}>
              <MaterialIcons name="arrow-back" size={20} color="#374151" />
              <Text style={styles.secondaryButtonText}>Previous</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              {flex: currentActivityIndex === 0 ? 1 : 0.6},
            ]}
            onPress={onNext}
            activeOpacity={0.8}>
            <View style={styles.primaryButtonGradient}>
              <Text style={styles.primaryButtonText}>
                {isSubmitting
                  ? 'Saving...'
                  : currentActivityIndex < totalActivities - 1
                  ? 'Next'
                  : 'Complete'}
              </Text>
              {!isSubmitting && (
                <MaterialIcons
                  name={
                    currentActivityIndex < totalActivities - 1
                      ? 'arrow-forward'
                      : 'check'
                  }
                  size={20}
                  color="white"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bottomGradient: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2D7D7A',
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 120,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    gap: 8,
    flex: 0.4,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActivityBottomActions;
