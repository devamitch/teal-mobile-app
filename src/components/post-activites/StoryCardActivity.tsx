import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {lightTheme} from '@/constants/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PostActivityConfig} from '@/data/videoData';

interface StoryCardActivityProps {
  activity: PostActivityConfig;
  response?: any;
  onResponseChange: (response: any) => void;
}

const StoryCardActivity: React.FC<StoryCardActivityProps> = ({
  activity,
  response,
  onResponseChange,
}) => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only set response once when component first mounts
    if (!hasInitialized.current && !response) {
      hasInitialized.current = true;
      // Use setTimeout to avoid setting state during render
      const timer = setTimeout(() => {
        onResponseChange({
          viewed: true,
          timestamp: new Date().toISOString(),
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array - only run on mount

  const renderStoryContent = () => {
    const storyText = activity.description || '';
    const paragraphs = storyText.split('\n').filter(p => p.trim().length > 0);

    return (
      <View style={styles.storyContainer}>
        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.storyParagraph}>
            {paragraph.trim()}
          </Text>
        ))}
      </View>
    );
  };

  const getStoryIcon = () => {
    if (activity.tags?.includes('vignette')) return 'auto-stories';
    if (activity.tags?.includes('example_story')) return 'lightbulb';
    if (activity.tags?.includes('behavioral_activation_concept'))
      return 'psychology';
    if (activity.tags?.includes('bids_for_connection')) return 'favorite';
    if (activity.tags?.includes('emotional_support')) return 'support';
    if (activity.tags?.includes('stop_skill_example')) return 'stop-circle';
    if (activity.tags?.includes('cognitive_restructuring_example'))
      return 'psychology';
    return 'menu-book';
  };

  const getStoryCategory = () => {
    if (activity.tags?.includes('vignette')) return 'Real-Life Scenario';
    if (activity.tags?.includes('example_story')) return 'Example Case';
    if (activity.tags?.includes('behavioral_activation_concept'))
      return 'Concept Illustration';
    if (activity.tags?.includes('bids_for_connection'))
      return 'Relationship Example';
    if (activity.tags?.includes('emotional_support')) return 'Support Scenario';
    if (activity.tags?.includes('stop_skill_example'))
      return 'Crisis Management';
    if (activity.tags?.includes('cognitive_restructuring_example'))
      return 'Thought Pattern Example';
    return 'Story';
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.storyHeader}>
          <View style={styles.categoryContainer}>
            <MaterialIcons
              name={getStoryIcon()}
              size={20}
              color={lightTheme.gradientMiddle}
            />
            <Text style={styles.categoryText}>{getStoryCategory()}</Text>
          </View>
        </View>

        <View style={styles.storyCard}>
          <View style={styles.storyIconContainer}>
            <MaterialIcons
              name="format-quote"
              size={24}
              color={lightTheme.gradientMiddle}
            />
          </View>

          {renderStoryContent()}

          <View style={styles.storyFooter}>
            <MaterialIcons
              name="format-quote"
              size={24}
              color={lightTheme.gradientMiddle}
              style={styles.closingQuote}
            />
          </View>
        </View>

        {activity.tags?.includes('reflection') && (
          <View style={styles.reflectionCard}>
            <MaterialIcons name="psychology" size={20} color="#FF9800" />
            <Text style={styles.reflectionText}>
              Take a moment to reflect on this scenario. How might you apply
              this in your own life?
            </Text>
          </View>
        )}

        {(activity.tags?.includes('behavioral_activation_concept') ||
          activity.tags?.includes('stop_skill_example') ||
          activity.tags?.includes('cognitive_restructuring_example')) && (
          <View style={styles.takeawaysCard}>
            <View style={styles.takeawaysHeader}>
              <MaterialIcons name="school" size={20} color="#4CAF50" />
              <Text style={styles.takeawaysTitle}>Key Learning Points</Text>
            </View>
            <Text style={styles.takeawaysText}>
              This example demonstrates important concepts that can help you
              manage similar situations in your own life.
            </Text>
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
  storyHeader: {
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: lightTheme.gradientMiddle,
    marginLeft: 6,
  },
  storyCard: {
    backgroundColor: '#FAFBFC',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: lightTheme.gradientMiddle,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storyIconContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  storyContainer: {
    marginBottom: 10,
  },
  storyParagraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  storyFooter: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  closingQuote: {
    transform: [{scaleY: -1}],
  },
  reflectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  reflectionText: {
    fontSize: 14,
    color: '#E65100',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  takeawaysCard: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  takeawaysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  takeawaysTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 8,
  },
  takeawaysText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 18,
  },
});

export default StoryCardActivity;
