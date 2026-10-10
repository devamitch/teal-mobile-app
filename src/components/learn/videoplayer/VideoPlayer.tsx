import useAppStore from '@/core/stores';
import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import {useShallow} from 'zustand/react/shallow';
import Orientation from 'react-native-orientation-locker';

interface VideoPlayerComponentProps {
  video: {
    srtUrl?: string;
    videoUrl: string;
  };
  onClose?: () => void;
  startPosition?: number;
  onVideoComplete?: () => void;
}

const VideoPlayerComponent: React.FC<VideoPlayerComponentProps> = ({
  video,
  onClose,
  startPosition,
  onVideoComplete,
}) => {
  const {isCcEnabled, setCcEnabled} = useAppStore(
    useShallow(state => ({
      isCcEnabled: state.playlist.isCcEnabled,
      setCcEnabled: state.playlist.setCcEnabled,
    })),
  );

  // Initialize orientation to portrait
  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {
      // Cleanup: ensure we return to portrait when component unmounts
      Orientation.lockToPortrait();
    };
  }, []);

  const textTracks = video?.srtUrl
    ? [
        {
          title: 'English',
          language: 'en',
          type: 'application/x-subrip',
          uri: video.srtUrl,
        },
      ]
    : [];

  const selectedTextTrack =
    textTracks.length > 0 && isCcEnabled
      ? {type: 'index', value: 0}
      : {type: 'disabled'};

  const handleEnterFullscreen = () => {
    console.log('Entering fullscreen - setting landscape');
    try {
      // Use timeout to ensure the fullscreen transition has started
      setTimeout(() => {
        Orientation.lockToLandscape();
      }, 100);
    } catch (error) {
      console.error('Error setting landscape orientation:', error);
    }
  };

  const handleExitFullscreen = () => {
    console.log('Exiting fullscreen - setting portrait');
    try {
      // Use timeout to ensure the fullscreen transition has completed
      setTimeout(() => {
        Orientation.lockToPortrait();
      }, 100);
    } catch (error) {
      console.error('Error setting portrait orientation:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'transparent'}}>
      <VideoPlayer
        source={{uri: video.videoUrl}}
        textTracks={textTracks}
        selectedTextTrack={selectedTextTrack}
        onCCToggle={setCcEnabled}
        tapAnywhereToPause={true}
        showOnStart={true}
        controlTimeout={3000}
        onBack={onClose}
        seekTime={startPosition}
        disableVolume={true}
        onEnterFullscreen={handleEnterFullscreen}
        onExitFullscreen={handleExitFullscreen}
        onEnd={onVideoComplete}
        style={{flex: 1}}
      />
      {textTracks.length === 0 && (
        <Text style={{textAlign: 'center', marginTop: 12, color: 'red'}}>
          No caption available
        </Text>
      )}
    </View>
  );
};

export default VideoPlayerComponent;
