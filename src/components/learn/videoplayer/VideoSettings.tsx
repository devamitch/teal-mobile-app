'use client';

import useAppStore from '@/core/stores';
import {MEDIA_CHAPTER_THEME} from '@/data/module-data';
import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {BorderlessButton, RectButton} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useShallow} from 'zustand/react/shallow';

const theme = MEDIA_CHAPTER_THEME;
const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

interface VideoSettingsProps {
  visible?: boolean;
  onClose?: () => void;
}

const VideoSettings: React.FC<VideoSettingsProps> = ({
  visible = false,
  onClose,
}) => {
  // Get all necessary state and actions from the store
  const {
    playbackSpeed,
    volume,
    isCcEnabled,
    autoPlayNext,
    showControls,
    setPlaybackSpeed,
    setVolume,
    setCcEnabled,
    setAutoPlayNext,
    setShowControls,
  } = useAppStore(
    useShallow(state => ({
      playbackSpeed: state?.playlist?.playbackSpeed ?? 1.0,
      volume: state?.playlist?.volume ?? 1.0,
      isCcEnabled: state?.playlist?.isCcEnabled ?? false,
      autoPlayNext: state?.playlist?.autoPlayNext ?? false,
      showControls: state?.playlist?.showControls ?? false,
      setPlaybackSpeed: state?.playlist?.setPlaybackSpeed,
      setVolume: state?.playlist?.setVolume,
      setCcEnabled: state?.playlist?.setCcEnabled,
      setAutoPlayNext: state?.playlist?.setAutoPlayNext,
      setShowControls: state?.playlist?.setShowControls,
    })),
  );

  const handleClose = () => {
    onClose?.();
    setShowControls?.(true);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}>
      <Animated.View
        style={styles.overlay}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor={theme.colors.blur}
        />

        {/* Tap outside to close */}
        <RectButton style={styles.backdropTouchable} onPress={handleClose}>
          <View accessible accessibilityRole="button" />
        </RectButton>

        <Animated.View
          style={styles.modalContainer}
          entering={SlideInDown.duration(400)}
          exiting={SlideOutDown.duration(400)}>
          <SafeAreaView style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Video Settings</Text>
              <BorderlessButton onPress={handleClose}>
                <View accessible accessibilityRole="button">
                  <MaterialIcons
                    name="close"
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
              </BorderlessButton>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: theme.spacing.lg}}>
              {/* Playback Speed */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Playback Speed</Text>
                <View style={styles.speedGrid}>
                  {PLAYBACK_SPEEDS.map(speed => (
                    <RectButton
                      key={speed}
                      onPress={() => setPlaybackSpeed?.(speed)}
                      rippleColor={theme.colors.primaryLight}
                      accessible
                      accessibilityRole="button"
                      style={[
                        styles.speedButton,
                        playbackSpeed === speed && {
                          backgroundColor: theme.colors.primary,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.speedButtonText,
                          playbackSpeed === speed && {
                            color: theme.colors.background,
                          },
                        ]}>
                        {speed === 1.0 ? 'Normal' : `${speed}x`}
                      </Text>
                    </RectButton>
                  ))}
                </View>
              </View>

              {/* Volume */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Volume</Text>
                <View style={styles.volumeRow}>
                  <MaterialIcons
                    name="volume-down"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                  <View style={styles.volumeBar}>
                    <View style={styles.volumeTrack}>
                      <View
                        style={[
                          styles.volumeFill,
                          {
                            width: `${(volume ?? 1) * 100}%`,
                            backgroundColor: theme.colors.primary,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.volumeSteps}>
                      {[0, 0.25, 0.5, 0.75, 1.0].map(vol => (
                        <BorderlessButton
                          key={vol}
                          onPress={() => setVolume?.(vol)}>
                          <View
                            accessible
                            accessibilityRole="button"
                            style={[
                              styles.volumeStep,
                              (volume ?? 1) >= vol && {
                                backgroundColor: theme.colors.primary,
                              },
                            ]}
                          />
                        </BorderlessButton>
                      ))}
                    </View>
                  </View>
                  <MaterialIcons
                    name="volume-up"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </View>
                <Text style={styles.volumeText}>
                  {Math.round((volume ?? 1) * 100)}%
                </Text>
              </View>

              {/* Captions */}
              <View style={styles.section}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <MaterialIcons
                      name="closed-caption"
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Closed Captions</Text>
                      <Text style={styles.settingDesc}>
                        Show subtitles when available
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={isCcEnabled ?? false}
                    onValueChange={v => setCcEnabled?.(v)}
                    trackColor={{
                      false: theme.colors.border,
                      true: theme.colors.primary,
                    }}
                  />
                </View>
              </View>

              {/* AutoPlay */}
              <View style={styles.section}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <MaterialIcons
                      name="skip-next"
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Auto-play Next</Text>
                      <Text style={styles.settingDesc}>
                        Play next video automatically
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={autoPlayNext ?? false}
                    onValueChange={v => setAutoPlayNext?.(v)}
                    trackColor={{
                      false: theme.colors.border,
                      true: theme.colors.primary,
                    }}
                  />
                </View>
              </View>

              {/* Quality */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Video Quality</Text>
                <RectButton rippleColor={theme.colors.primaryLight}>
                  <View
                    accessible
                    accessibilityRole="button"
                    style={styles.qualityButton}>
                    <Text style={styles.qualityButtonText}>
                      Auto (Recommended)
                    </Text>
                    <MaterialIcons
                      name="check"
                      size={16}
                      color={theme.colors.primary}
                    />
                  </View>
                </RectButton>
                <Text style={styles.qualityDesc}>
                  Adjusts based on connection
                </Text>
              </View>

              {/* Cache */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Storage & Cache</Text>
                <View style={styles.cacheRow}>
                  <MaterialIcons
                    name="storage"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                  <View style={styles.cacheText}>
                    <Text style={styles.cacheLabel}>Video Cache</Text>
                    <Text style={styles.cacheDesc}>
                      Enabled - saves for offline viewing
                    </Text>
                  </View>
                  <BorderlessButton onPress={() => {}}>
                    <View
                      accessible
                      accessibilityRole="button"
                      style={styles.clearCacheBtn}>
                      <MaterialIcons
                        name="delete-outline"
                        size={16}
                        color={theme.colors.error}
                      />
                      <Text style={styles.clearCacheText}>Clear Cache</Text>
                    </View>
                  </BorderlessButton>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default VideoSettings;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.overlay,
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    maxHeight: '80%',
  },
  modalContent: {
    backgroundColor: theme.colors.surfaceElevated,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  speedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  speedButton: {
    minWidth: 70,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  speedButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  volumeBar: {
    flex: 1,
    position: 'relative',
  },
  volumeTrack: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
  },
  volumeFill: {
    height: '100%',
    borderRadius: 2,
  },
  volumeSteps: {
    position: 'absolute',
    top: -6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  volumeStep: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.border,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  volumeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  settingDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  qualityButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  qualityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  qualityDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  cacheRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  cacheText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  cacheLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  cacheDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  clearCacheBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  clearCacheText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.error,
  },
});
