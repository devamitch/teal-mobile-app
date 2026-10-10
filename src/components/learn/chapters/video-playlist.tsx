import useAppStore from '@/core/stores';
import type {VideoData} from '@/data/module-data';
import {MEDIA_CHAPTER_THEME as THEME} from '@/data/module-data';
import type React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import Animated, {FadeInUp} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useShallow} from 'zustand/react/shallow';
import ThumbnailPlayer from '../videoplayer/ThumbnailPlayer';

interface VideoPlaylistProps {
  onVideoPress: (videoId: string, chapterId: string) => void;
}

const CurrentVideoPlaylist: React.FC<VideoPlaylistProps> = ({onVideoPress}) => {
  const {getCurrentChapter, getCurrentVideo} = useAppStore(
    useShallow(state => state?.playlist),
  );
  const currentVideo = getCurrentVideo?.();
  const currentChapter = getCurrentChapter?.();
  const topics = currentChapter?.videos || [];
  if (!topics.length) return null;

  return (
    <Animated.View entering={FadeInUp.delay(300)} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Playing </Text>
        <Text style={styles.subtitle}>{topics.length} videos</Text>
      </View>

      <View style={styles.playlist}>
        {topics.map((topic, index) => (
          <CurrentChapterVideoItem
            key={topic.id}
            topic={topic}
            index={index}
            isActive={currentVideo?.id === topic.id}
            onPress={() => onVideoPress(topic.id, currentChapter?.id || '')}
            videoId={topic.id}
            chapterId={currentChapter?.id || ''}
          />
        ))}
      </View>
    </Animated.View>
  );
};

interface VideoItemProps {
  topic: VideoData;
  index: number;
  chapterId: string;
  videoId: string;
  isActive: boolean;
  onPress: () => void;
}

const CurrentChapterVideoItem: React.FC<VideoItemProps> = ({
  topic,
  index,
  isActive,
  onPress,
  chapterId,
  videoId,
}) => {
  return (
    <RectButton
      style={[styles.videoItem, isActive && styles.activeVideoItem]}
      onPress={onPress}>
      <View style={styles.videoNumber}>
        <ThumbnailPlayer
          {...topic}
          chapterId={chapterId}
          videoId={videoId}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: 0,
            right: 0,
            zIndex: 1,
          }}
        />
        <View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              bottom: 0,
              right: 0,
              zIndex: 1,
              backgroundColor: isActive
                ? 'transparent'
                : THEME.colors.primaryLight,
              borderRadius: THEME.borderRadius.sm,
            },
          ]}>
          <Text
            style={[styles.numberText, isActive && styles.activeNumberText]}>
            {(index + 1).toString().padStart(2, '0')}
          </Text>
        </View>
      </View>

      <View style={styles.videoContent}>
        <Text
          style={[styles.videoTitle, isActive && styles.activeVideoTitle]}
          numberOfLines={2}>
          {topic.title}
        </Text>

        <View style={styles.videoMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons
              name="schedule"
              size={14}
              color={
                isActive ? THEME.colors.primary : THEME.colors.textSecondary
              }
            />
            <Text style={[styles.metaText, isActive && styles.activeMetaText]}>
              {(Number(topic?.duration || 0) / 60).toFixed(2)} min
            </Text>
          </View>

          {(topic?.postActivities?.length || 0) > 0 ? (
            <View style={styles.metaItem}>
              <MaterialIcons
                name="assignment"
                size={14}
                color={
                  isActive ? THEME.colors.primary : THEME.colors.textSecondary
                }
              />
              <Text
                style={[styles.metaText, isActive && styles.activeMetaText]}>
                {topic?.postActivities?.length} Activity
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.statusContainer}>
        {topic.completed ? (
          <View style={styles.completedIcon}>
            <MaterialIcons
              name="check-circle"
              size={20}
              color={THEME.colors.secondary}
            />
          </View>
        ) : isActive ? (
          <View style={styles.playingIcon}>
            <MaterialIcons
              name="play-circle-filled"
              size={20}
              color={THEME.colors.primary}
            />
          </View>
        ) : (
          <View style={styles.unplayedIcon}>
            <MaterialIcons
              name="play-circle-outline"
              size={20}
              color={THEME.colors.textLight}
            />
          </View>
        )}
      </View>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
  },
  header: {
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  playlist: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    ...THEME.shadows.sm,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  activeVideoItem: {
    backgroundColor: THEME.colors.primaryLight,
    borderBottomColor: THEME.colors.primary,
  },
  videoNumber: {
    width: 32,
    height: 32,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  activeNumberText: {
    color: THEME.colors.primary,
  },
  videoContent: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  activeVideoTitle: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  videoMeta: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  activeMetaText: {
    color: THEME.colors.primary,
  },
  statusContainer: {
    marginLeft: THEME.spacing.sm,
  },
  completedIcon: {},
  playingIcon: {},
  unplayedIcon: {},
});

export default CurrentVideoPlaylist;
