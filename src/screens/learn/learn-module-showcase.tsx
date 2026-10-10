import {useMemo, useCallback, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {lightTheme} from '../../constants/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Styles from './LearnStyle';
import FONT_FAMILIES from '@/constants/fonts';
import Colors from '@/constants/colors';
import BackButton from '@/components/ui/buttons/back-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAppStore} from '@/core/stores';

function getVideoActivityPattern(
  videos: any[],
  _activities: any[],
  moduleNumber: string,
) {
  const cards = [];
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const videoNumber = `${moduleNumber}.${i + 1}`;
    cards.push({...video, _type: 'video'}); // No numbering for videos

    // Handle multiple activities for a single video
    const activities = videos[i].postActivities || [];
    activities.forEach((activity: any, activityIndex: number) => {
      const activityNumber = `${videoNumber}.${activityIndex + 1}`;
      const isCalendarActivity = i === 0 && activityIndex === 0; // First activity of first video (moduleNumber.1.1)
      const isMentalHealthReview = i === 1 && activityIndex === 0; // First activity of second video (moduleNumber.2.1)
      // Crisis support review should not apply to warning signs activity (3.3.1)
      // Only apply to specific crisis support activities, not warning signs
      const isCrisisSupportReview = false; // Disabled for now - was incorrectly matching warning signs activity

      if (isMentalHealthReview) {
        // For activity_2_2_1, use its own title and description
        if (activity.id === 'activity_2_2_1') {
          cards.push({
            ...activity,
            _type: 'activity',
            title: activity.question || 'Distraction Strategies',
            _number: activityNumber,
            type: activity.type,
            question: activity.question,
            description: activity.description,
            _parentVideoId: video.id,
          });
        } else {
          cards.push({
            ...activity,
            _type: 'activity',
            title: '',
            _number: activityNumber,
            type: 'mental_health_review',
            question: 'How can I temporarily take my mind off my problems?',
            description:
              'Which of the following grounding techniques would you find helpful? Try to select a range of approaches that you could use in different settings (e.g., out in public, at home, at the office). Select at least five:',
            _parentVideoId: video.id, // Track parent video for activity completion
          });
        }
      } else if (isCrisisSupportReview) {
        // Create crisis support review activity
        cards.push({
          ...activity,
          _type: 'activity',
          title: 'Review Your Crisis Support Contacts',
          _number: activityNumber,
          type: 'crisis_support_review',
          question: 'Review Your Crisis Support Contacts',
          description:
            'Review and update your emergency and support contacts from onboarding',
          _parentVideoId: video.id, // Track parent video for activity completion
        });
      } else {
        cards.push({
          ...activity,
          _type: 'activity',
          title: activity.question,
          _number: activityNumber,
          showCalendar: isCalendarActivity,
          type: isCalendarActivity ? 'calendar' : activity.type,
          _parentVideoId: video.id, // Track parent video for activity completion
        });
      }
    });
  }
  return cards;
}

type RootStackParamList = {
  VideoPlayer: {
    videoId: string;
    videoUrl: string;
    srtUrl: string;
    title: string;
    chapterId?: string;
    startPos?: number;
    module?: any;
    currentIndex?: number;
  };
  ActivityDetails: {
    activity: any;
    activityType: any;
    title: any;
    thumbnailUrl?: any;
  };
};

const LearnModuleShowcaseScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const {module} = route.params as {module: any};

  // Restrict access to only modules 1, 2, and 3
  if (module?.id && !['1', '2', '3'].includes(module.id)) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>This module is not yet available</Text>
        <Text style={styles.errorSubtext}>
          More modules will be updated once their activities are done
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get completion tracking from store
  const {isItemComplete} = useAppStore(state => state.completion);

  // Load completion data when component mounts and when navigation focuses
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Completion data is now automatically synchronized through Zustand persistence
      console.log('Screen focused - completion data is automatically loaded');
    });

    return unsubscribe;
  }, [navigation]);

  const cards = useMemo(() => {
    const activities = module.videos.flatMap(
      (video: any) => video.postActivities || [],
    );
    return getVideoActivityPattern(module.videos, activities, module.id);
  }, [module]);

  const ContentCard = useCallback(
    ({
      title,
      subtitle,
      image,
      tag,
      progress,
      duration,
      onPress,
      isStressCard = false,
      number,
      isCompleted = false,
    }: {
      title: string;
      subtitle?: string;
      image: any;
      tag?: string;
      progress?: number;
      duration?: string;
      onPress: () => void;
      isStressCard?: boolean;
      number?: string;
      isCompleted?: boolean;
    }) => (
      <View style={styles.fullWidthCard}>
        <TouchableOpacity
          style={[
            isStressCard ? Styles.stressContentCard : Styles.contentCard,
            styles.fullWidthCardOverride,
          ]}
          onPress={onPress}>
          <View
            style={
              isStressCard ? Styles.stressCardContainer : Styles.cardContainer
            }>
            <View
              style={
                isStressCard
                  ? Styles.stressCardImageContainer
                  : Styles.cardImageContainer
              }>
              <Image
                source={typeof image === 'string' ? {uri: image} : image}
                style={isStressCard ? Styles.stressCardImage : Styles.cardImage}
                resizeMode="cover"
              />
            </View>
            {/* Completion tick mark */}
            {isCompleted && (
              <View style={styles.completionBadge}>
                <MaterialIcons name="check" size={16} color="white" />
              </View>
            )}
            <View
              style={
                isStressCard ? Styles.stressCardContent : Styles.cardContent
              }>
              {tag && (
                <View style={Styles.tagContainer}>
                  <Text style={Styles.tagText}>{tag}</Text>
                </View>
              )}
              <Text
                style={isStressCard ? Styles.stressCardTitle : Styles.cardTitle}
                numberOfLines={isStressCard ? 2 : 1}>
                {number ? `${number}: ${title}` : title}
              </Text>
              <View style={Styles.authorContainer}></View>
              {progress !== undefined && progress !== null && (
                <View style={Styles.progressContainer}>
                  <View style={[Styles.progressBar, {width: `${progress}%`}]} />
                </View>
              )}
              {!progress && duration && duration.includes('mins') && (
                <View style={Styles.playButton}>
                  <Ionicons name="play" size={18} color={Colors.white} />
                  <Text style={Styles.playText}>Play</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    ),
    [],
  );

  const handleCardPress = (item: any) => {
    // Allow navigation to any content, even if completed (users can revisit anytime)

    // Find the current index of this item in the cards array
    const currentIndex = cards.findIndex(
      card => card.id === item.id && card._type === item._type,
    );

    if (item._type === 'video') {
      console.log('Video item:', item);
      console.log('Video URL:', item.videoUrl);
      console.log('Has videoUrl:', !!item.videoUrl);

      navigation.navigate('VideoPlayer', {
        videoId: item.id,
        videoUrl: item.videoUrl,
        srtUrl: item.srtUrl,
        title: item.title,
        chapterId: item.id,
        startPos: 0,
        module,
        currentIndex,
      });
    } else {
      (navigation as any).navigate('ActivityDetails', {
        activity: item,
        activityType: item.type,
        title: item.title,
        thumbnailUrl: item.thumbnailUrl,
        module,
        currentIndex,
      });
    }
  };

  const renderCard = (item: any, index: number) => {
    const isVideo = item._type === 'video';
    const moduleId = 'current_module'; // Use consistent moduleId with video player

    // Use consistent item ID format
    let itemId: string;
    if (isVideo) {
      itemId = item.id; // For videos, use the video ID directly
    } else {
      // For activities, use the activity ID or _number
      itemId = item.id || item._number || `activity_${index}`;
    }

    // Check completion store for consistent state
    const isCompleted = isItemComplete(moduleId, itemId);

    // Log completion status for debugging
    console.log(`Item ${itemId} (${item._type}) completed:`, isCompleted);

    // Fallback to question if title is missing
    const cardTitle =
      item.title && item.title.trim().length > 0 ? item.title : item.question;
    return (
      <ContentCard
        key={index}
        title={cardTitle}
        subtitle={isVideo ? item.author : undefined}
        image={item.thumbnailUrl}
        tag={isVideo ? 'Video' : 'Activity'}
        duration={isVideo ? item.duration : undefined}
        onPress={() => handleCardPress(item)}
        number={item._number}
        isCompleted={isCompleted}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerContent}>
          <Text
            style={styles.headerTitle}
            numberOfLines={2}
            ellipsizeMode="tail">
            {module.title}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContent}>
          {cards.map((item, index) => renderCard(item, index))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    marginBottom: 8,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: lightTheme.primary,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  listContent: {
    gap: 0,
  },
  fullWidthCard: {
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  fullWidthCardOverride: {
    width: '100%',
    height: 140, // Fixed height to prevent cards from being too tall
    overflow: 'hidden',
  },
  completionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 999,
    borderWidth: 2,
    borderColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: lightTheme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LearnModuleShowcaseScreen;
