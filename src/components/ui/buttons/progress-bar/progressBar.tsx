import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ColorValue, ViewStyle } from 'react-native';

interface ProgressBarProps{
    progress: number;
    color: ColorValue;
    style?: ViewStyle;
}

const ProgressBar:React.FC<ProgressBarProps> = ({ progress, color, style }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: progress, // value between 0 and 1
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.progressBar, { width: widthInterpolated, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 12,
    width: '80%',
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});

export default ProgressBar;
