import useAppStore from '@/core/stores';
import {MEDIA_CHAPTER_THEME as theme} from '@/data/module-data';
import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BorderlessButton, RectButton} from 'react-native-gesture-handler';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useShallow} from 'zustand/react/shallow';
import VideoProgress from './VideoProgress';

interface VideoControlsProps {
  visible?: boolean;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  buffering?: boolean;
  volume?: number;
  shuffleMode?: boolean;
  repeatMode?: 'none' | 'one' | 'all';
  ccEnabled?: boolean;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  onFullscreen?: () => void;
  onClose?: () => void;
  onShowChapters?: () => void;
  onShowSettings?: () => void;
  onCCToggle?: () => void;
  style?: any;
}
const VideoControls: React.FC<VideoControlsProps> = ({
  visible,
  ccEnabled,
  onPlayPause,
  onSeek,
  onNext,
  onPrevious,
  onVolumeChange,
  onFullscreen,
  onClose,
  onShowChapters,
  onShowSettings,
  onCCToggle,
  style,
}) => {
  const insets = useSafeAreaInsets();

  // Get all necessary state and actions from the store
  const {
    isPlaying,
    currentTime,
    duration,
    isBuffering: buffering,
    volume,
    shuffleMode,
    repeatMode,
    isCcEnabled,
    showControls,
    setIsPlaying,
    setCurrentTime,
    setVolume,
    setShuffleMode,
    setRepeatMode,
    setCcEnabled,
    playNextVideo,
    playPreviousVideo,
    setShowControls,
  } = useAppStore(useShallow(state => state?.playlist));

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')}`;

  const togglePlayPause = () => {
    if (isPlaying) {
      setShowControls(true);
    }
    setIsPlaying?.(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime?.(time);
    setShowControls?.(true);
  };

  const toggleVolume = () => {
    setVolume?.(volume > 0 ? 0 : 1);
  };

  const toggleShuffle = () => {
    setShuffleMode?.(!shuffleMode);
  };

  const toggleRepeatMode = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode ?? 'none');
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode?.(modes?.[nextIndex] || 'all');
  };

  const toggleCC = () => {
    setCcEnabled?.(!isCcEnabled);
  };

  // if (!visible) return null;
  return (
    <Animated.View
      style={styles.overlay}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}>
      <View style={styles.blur}>
        {/* Top */}
        <View
          style={[
            styles.top,
            {
              paddingTop: insets.top + theme.spacing.lg,
              opacity: isPlaying ? 0 : 1,
            },
          ]}>
          <RectButton
            onPress={() => {
              setShowControls?.(false);
              onClose?.();
            }}
            style={styles.iconBtn}
            accessible
            accessibilityRole="button">
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={theme.colors.textLight}
            />
          </RectButton>

          <View style={styles.topRight}>
            <BorderlessButton
              onPress={toggleCC}
              style={styles.iconBtn}
              accessible
              accessibilityRole="button">
              <MaterialIcons
                name={
                  isCcEnabled ? 'closed-caption' : 'closed-caption-disabled'
                }
                size={24}
                color={theme.colors.textLight}
              />
            </BorderlessButton>

            <BorderlessButton
              onPress={() => {
                /* Implement chapter list */
                onShowChapters?.();
              }}
              style={styles.iconBtn}
              accessible
              accessibilityRole="button">
              <MaterialIcons
                name="list"
                size={24}
                color={theme.colors.textLight}
              />
            </BorderlessButton>

            <BorderlessButton
              onPress={() => {
                /* Implement settings */
                onShowSettings?.();
              }}
              style={styles.iconBtn}
              accessible
              accessibilityRole="button">
              <MaterialIcons
                name="settings"
                size={24}
                color={theme.colors.textLight}
              />
            </BorderlessButton>

            <BorderlessButton
              onPress={() => {
                /* Implement fullscreen */
              }}
              style={styles.iconBtn}
              accessible
              accessibilityRole="button">
              <MaterialIcons
                name="fullscreen"
                size={24}
                color={theme.colors.textLight}
              />
            </BorderlessButton>
          </View>
        </View>

        {/* Center */}
        <View style={[styles.center, isPlaying && {opacity: 0}]}>
          <RectButton onPress={playPreviousVideo} style={styles.centerBtn}>
            <View accessible accessibilityRole="button">
              <MaterialIcons
                name="skip-previous"
                size={32}
                color={theme.colors.text}
              />
            </View>
          </RectButton>

          <RectButton
            onPress={togglePlayPause}
            style={[
              styles.playBtn,
              {
                overflow: 'hidden',
                padding: theme.spacing.xl,
                shadowRadius: 1,
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                boxShadow: '0 2px 3px rgba(0,0,0,0.25)',
                elevation: 1,
              },
              isPlaying && {
                opacity: 1,
              },
            ]}
            accessible
            accessibilityRole="button">
            <BlurView
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                },
              ]}
              blurType="xlight"
              blurAmount={20}
              reducedTransparencyFallbackColor={theme.colors.blur}
            />
            <MaterialIcons
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={48}
              color={theme.colors.primary}
            />
          </RectButton>

          <RectButton onPress={playNextVideo} style={styles.centerBtn}>
            <View accessible accessibilityRole="button">
              <MaterialIcons
                name="skip-next"
                size={32}
                color={theme.colors.text}
              />
            </View>
          </RectButton>
        </View>

        {/* Bottom */}
        <View
          style={[
            styles.bottom,
            {
              paddingBottom: insets.bottom + theme.spacing.lg,
              opacity: isPlaying ? 0 : 1,
            },
          ]}>
          <VideoProgress
            currentTime={currentTime ?? 0}
            duration={duration ?? 0}
            onSeek={handleSeek}
            buffering={buffering}
          />

          <View style={styles.bottomRow}>
            <View style={styles.bottomLeft}>
              <BorderlessButton onPress={toggleVolume} style={styles.iconBtn}>
                <View accessible accessibilityRole="button">
                  <MaterialIcons
                    name={volume > 0 ? 'volume-up' : 'volume-off'}
                    size={20}
                    color={theme.colors.text}
                  />
                </View>
              </BorderlessButton>
              <Text style={styles.time}>
                {formatTime(currentTime ?? 0)} / {formatTime(duration ?? 0)}
              </Text>
            </View>

            <View style={styles.bottomRight}>
              <BorderlessButton onPress={toggleShuffle} style={styles.iconBtn}>
                <View accessible accessibilityRole="button">
                  <MaterialIcons
                    name="shuffle"
                    size={20}
                    color={
                      shuffleMode ? theme.colors.primary : theme.colors.text
                    }
                  />
                </View>
              </BorderlessButton>

              <BorderlessButton
                onPress={toggleRepeatMode}
                style={styles.iconBtn}>
                <View accessible accessibilityRole="button">
                  <MaterialIcons
                    name={repeatMode === 'one' ? 'repeat-one' : 'repeat'}
                    size={20}
                    color={
                      repeatMode !== 'none'
                        ? theme.colors.primary
                        : theme.colors.text
                    }
                  />
                </View>
              </BorderlessButton>
            </View>
          </View>
        </View>
      </View>
      <RectButton
        style={[
          {
            zIndex: isPlaying ? 1 : 0,
            backgroundColor: 'rgba(0,0,0,0.01)',
            position: isPlaying ? 'absolute' : 'static',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        ]}
        onPress={togglePlayPause}
        accessible
        accessibilityRole="button"
        enabled={!isPlaying}
      />
    </Animated.View>
  );
};

export default VideoControls;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  blur: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  topRight: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xxl,
  },
  centerBtn: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryLight,
  },
  playBtn: {
    borderRadius: theme.borderRadius.full,
  },
  bottom: {
    paddingHorizontal: theme.spacing.lg,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  bottomRight: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  iconBtn: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryLight,
    overflow: 'hidden',
  },
  time: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
});
