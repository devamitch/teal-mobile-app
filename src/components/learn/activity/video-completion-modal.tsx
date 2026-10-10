import {BlurView} from '@react-native-community/blur';
import {type RouteProp} from '@react-navigation/native';
import type React from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {SlideInDown, SlideInUp} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

type ChapterDetailParams = {
  chapterId: string;
  startPosition: number;
};

type ChapterDetailRouteProp = RouteProp<
  {ChapterDetail: ChapterDetailParams},
  'ChapterDetail'
>;

export const VideoCompletionModal: React.FC<{
  visible: boolean;
  video: any;
  onClose: () => void;
  onStartActivity: () => void;
  onSkip: () => void;
}> = ({visible, video, onClose, onStartActivity, onSkip}) => {
  if (!visible || !video) return null;

  const hasActivities = video.postActivities && video.postActivities.length > 0;
  const activityCount = video.postActivities?.length || 0;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver
      useNativeDriverForBackdrop
      animationInTiming={300}
      animationOutTiming={300}
      onModalHide={onClose}
      deviceHeight={screenHeight}
      deviceWidth={screenWidth}
      // hasBackdrop={false}
      style={{flex: 1, padding: 0, margin: 0}}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor="rgba(0,0,0,0.7)"
      />
      <GestureHandlerRootView
        style={[styles.modalOverlay, {flex: 1, overflow: 'hidden'}]}>
        <View
          style={styles.completionModal}
          entering={SlideInUp}
          exiting={SlideInDown}>
          <LinearGradient
            colors={['#2D7D7A', '#1A5A57', '#0D3D3A']}
            style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
            useAngle
            angle={260}
          />
          <View style={styles.modalGradient}>
            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <View style={styles.successIcon}>
                <MaterialIcons name="check" size={32} color="white" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.completionTitle}>Video Complete!</Text>
            <Text style={styles.completionSubtitle}>
              Great job finishing "{video.title}"
            </Text>

            {/* Activity Card */}
            {hasActivities ? (
              <View style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <MaterialIcons name="assignment" size={24} color="#2D7D7A" />
                  <Text style={styles.activityTitle}>Continue Learning</Text>
                </View>

                <Text style={styles.activityDescription}>
                  Complete {activityCount} interactive{' '}
                  {activityCount === 1 ? 'activity' : 'activities'} to reinforce
                  what you've learned
                </Text>

                {/* Activity Preview */}
                <View style={styles.activityPreview}>
                  {video.postActivities
                    .slice(0, 2)
                    .map((activity: any, index: number) => (
                      <View
                        key={activity.id}
                        style={styles.activityPreviewItem}>
                        <View style={styles.activityIcon}>
                          <MaterialIcons
                            name={getActivityIcon(activity.type)}
                            size={16}
                            color="#2D7D7A"
                          />
                        </View>
                        <Text
                          style={styles.activityPreviewText}
                          numberOfLines={2}
                          adjustsFontSizeToFit>
                          {activity.question}
                        </Text>
                      </View>
                    ))}
                  {activityCount > 2 && (
                    <Text style={styles.moreActivities}>
                      +{activityCount - 2} more activities
                    </Text>
                  )}
                </View>

                {/* Progress Indicator */}
                <View style={styles.progressIndicator}>
                  <View style={styles.progressDots}>
                    {Array.from({length: Math.min(activityCount, 5)}).map(
                      (_, i) => (
                        <View key={i} style={styles.progressDot} />
                      ),
                    )}
                  </View>
                  <Text style={styles.progressText}>
                    {activityCount}{' '}
                    {activityCount === 1 ? 'question' : 'questions'}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              {hasActivities ? (
                <>
                  <Pressable
                    style={styles.primaryButton}
                    onPress={onStartActivity}>
                    <LinearGradient
                      colors={['#f5faf5ff', '#e6efe7ff']}
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                      useAngle
                      angle={260}
                      angleCenter={{x: 1, y: 0}}
                    />
                    <View style={styles.buttonGradient}>
                      <MaterialIcons
                        name="play-arrow"
                        size={20}
                        color="black"
                      />
                      <Text
                        style={[styles.primaryButtonText, {color: '#232323'}]}>
                        Answer
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable style={styles.secondaryButton} onPress={onSkip}>
                    <Text style={styles.secondaryButtonText}>Skip for Now</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable style={styles.primaryButton} onPress={onClose}>
                  <LinearGradient
                    colors={['#f5faf5ff', '#e6efe7ff']}
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                    }}
                    useAngle
                    angle={260}
                    angleCenter={{x: 1, y: 0}}
                  />
                  <View style={styles.buttonGradient}>
                    <Text style={styles.primaryButtonText}>Continue</Text>
                  </View>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

// Helper function to get activity icons
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'text':
      return 'edit';
    case 'multiple_choice':
      return 'quiz';
    case 'rating_scale':
      return 'star-rate';
    case 'checklist':
      return 'checklist';
    case 'review_card':
      return 'preview';
    case 'calendar':
      return 'calendar-today';
    case 'story_card':
      return 'auto-stories';
    default:
      return 'assignment';
  }
};

export default VideoCompletionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 200,
    position: 'relative',
    backgroundColor: 'white',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  infoSection: {
    marginBottom: 8,
    overflow: 'hidden',
  },
  infoGradient: {
    padding: 8,
  },
  chapterTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    lineHeight: 34,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flex: 1,
    // overflow: 'hidden',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 125, 122, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  statIcon: {
    marginRight: 2,
  },
  statText: {
    fontSize: 12,
    color: '#2D7D7A',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#2D7D7A',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  videosSection: {
    padding: 20,
    backgroundColor: 'white',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  videoItemContainer: {
    marginBottom: 16,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  completedVideoItem: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  videoThumbnail: {
    width: 120,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 16,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  statusOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  completedBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderRadius: 12,
    padding: 2,
  },
  partialIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  partialFill: {
    height: '100%',
    backgroundColor: '#FFC107',
  },
  playButton: {
    backgroundColor: 'rgba(45, 125, 122, 0.9)',
    borderRadius: 12,
    padding: 2,
  },
  videoProgressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  videoProgressBar: {
    height: '100%',
  },
  videoInfo: {
    flex: 1,
    paddingRight: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
    lineHeight: 22,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoAuthor: {
    fontSize: 12,
    color: '#666',
  },
  videoDuration: {
    fontSize: 12,
    color: '#2D7D7A',
    fontWeight: '600',
  },
  videoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    color: '#666',
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 12,
  },
  activityText: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: '600',
  },
  playVideoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(45, 125, 122, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2D7D7A',
  },
  completedButton: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  fab: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  fabText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionModal: {
    width: screenWidth - 40,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 32,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  activityPreview: {
    marginBottom: 16,
  },
  activityPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  activityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 125, 122, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityPreviewText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  moreActivities: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  progressIndicator: {
    alignItems: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D7D7A',
    marginHorizontal: 2,
  },
  modalActions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
