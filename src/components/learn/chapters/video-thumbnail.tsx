'use client';

import type React from 'react';
import {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {MEDIA_CHAPTER_THEME as THEME} from '@/data/module-data';
import {getImageSource} from '@/utils/image-utils';

interface VideoThumbnailProps {
  thumbnailUrl: string;
  duration: string;
  isActive?: boolean;
  isCompleted?: boolean;
  onPress: () => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnailUrl,
  duration,
  isActive = false,
  isCompleted = false,
  onPress,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.thumbnailContainer}>
        {!imageError ? (
          <Image
            source={getImageSource(thumbnailUrl)}
            style={styles.thumbnail}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
            <MaterialIcons
              name="play-circle-outline"
              size={32}
              color={THEME.colors.textLight}
            />
          </View>
        )}

        {/* Play Overlay */}
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <MaterialIcons
              name="play-arrow"
              size={20}
              color={THEME.colors.primary}
            />
          </View>
        </View>

        {/* Duration Badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>

        {/* Status Indicators */}
        {isActive && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.activeIndicator}>
            <Text style={styles.activeText}>CURRENT</Text>
          </Animated.View>
        )}

        {isCompleted && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.completedIndicator}>
            <MaterialIcons
              name="check-circle"
              size={16}
              color={THEME.colors.success}
            />
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: THEME.spacing.md,
  },
  thumbnailContainer: {
    position: 'relative',
    width: 120,
    height: 68,
    borderRadius: THEME.borderRadius.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: THEME.colors.background,
    fontSize: 10,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: THEME.colors.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeText: {
    color: THEME.colors.background,
    fontSize: 8,
    fontWeight: '700',
  },
  completedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: THEME.colors.background,
    borderRadius: 8,
    padding: 2,
  },
});

export default VideoThumbnail;
