import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ActivityHeaderProps {
  insets: {top: number};
  currentActivityIndex: number;
  totalActivities: number;
  progressAnimatedStyle: any;
  onBack: () => void;
}

const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  insets,
  currentActivityIndex,
  totalActivities,
  progressAnimatedStyle,
  onBack,
}) => {
  return (
    <View style={[styles.header, {paddingTop: insets.top + 20}]}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            Activity {currentActivityIndex + 1}
          </Text>
          <Text style={styles.headerSubtitle}>
            {currentActivityIndex + 1} of {totalActivities}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.progressText}>
            {Math.round(((currentActivityIndex + 1) / totalActivities) * 100)}%
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2D7D7A',
    borderRadius: 4,
  },
});

export default ActivityHeader;
