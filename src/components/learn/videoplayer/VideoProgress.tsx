import Slider from '@react-native-community/slider';
import React, {useMemo, useRef} from 'react';
import {
  Dimensions,
  Animated as RNAnimated,
  StyleSheet,
  View,
} from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const {width: screenWidth} = Dimensions.get('window');

interface VideoProgressProps {
  currentTime: number;
  duration: number;
  buffering?: boolean;
  onSeek: (time: number) => void;
  style?: any;
}

const VideoProgress: React.FC<VideoProgressProps> = ({
  currentTime,
  duration,
  buffering = false,
  onSeek,
  style,
}) => {
  const thumbScale = useSharedValue(1);
  const sliderValue = useRef(new RNAnimated.Value(0)).current;

  // % progress
  const progress = useMemo(() => {
    if (duration === 0) return 0;
    return Math.min(Math.max(currentTime / duration, 0), 1);
  }, [currentTime, duration]);

  // Animate thumb scaling
  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: thumbScale.value}],
  }));

  // Keep slider in sync when not dragging
  // useEffect(() => {
  //   RNAnimated.timing(sliderValue, {
  //     toValue: progress,
  //     duration: 150,
  //     useNativeDriver: false,
  //   }).start();
  // }, [progress]);

  return (
    <View style={[styles.container, style]}>
      {/* Background track */}

      {/* Buffering overlay */}
      {buffering && <View style={styles.bufferingOverlay} />}

      <Slider
        style={styles.slider}
        // value={progress}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#2D7D7A"
        maximumTrackTintColor="rgba(255,255,255,0.3)"
        thumbTintColor="white"
        onValueChange={value => {
          thumbScale.value = withSpring(1.5);
          onSeek(value * duration);
        }}
        onSlidingStart={() => {
          thumbScale.value = withSpring(1.5);
        }}
        onSlidingComplete={value => {
          thumbScale.value = withSpring(1);
          onSeek(value * duration);
        }}
        trackStyle={{height: 4, borderRadius: 2}}
        thumbStyle={[styles.thumb, thumbAnimatedStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  trackBackground: {
    position: 'absolute',
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    top: 18, // to align center of slider
  },
  bufferingOverlay: {
    position: 'absolute',
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
    top: 18,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default VideoProgress;
