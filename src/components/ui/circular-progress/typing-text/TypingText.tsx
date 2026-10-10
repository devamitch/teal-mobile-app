import Colors from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import React, {useEffect, useState} from 'react';
import {StyleProp, StyleSheet, Text, TextStyle, ViewStyle} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface TypingTextProps {
  text: string;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  textStyle?: StyleProp<TextStyle> | undefined;
}

const TypingText: React.FC<TypingTextProps> = ({
  text,
  containerStyle,
  textStyle,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const animationValue = useSharedValue(0);

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(prev => prev + text[currentIndex]);
      currentIndex++;
      if (currentIndex === text.length) {
        clearInterval(intervalId);
      }
    }, 10); // Adjust the interval duration as needed

    return () => clearInterval(intervalId);
  }, [text]);

  useEffect(() => {
    animationValue.value = withTiming(1, {
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
    });
  }, [animationValue]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animationValue.value,
    };
  });

  return (
    <Animated.View style={[animatedStyle, containerStyle]}>
      <Text style={[styles.text, textStyle]}>{displayedText}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: Colors.white,
  },
});

export default TypingText;
