import React, { useState, useRef } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  Easing,
  Platform,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type DropdownProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  isExpanded?: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({ title, children, isExpanded = false }) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    const toValue = expanded ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    setExpanded(!expanded);
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], // Adjust as needed or make dynamic
  });

  const opacityInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View>
      <TouchableOpacity onPress={toggleDropdown}>
        {title}
      </TouchableOpacity>

      <Animated.View
        style={[
          {
            overflow: 'hidden',
            backgroundColor: '#fff',
          },
          {
            height: heightInterpolation,
            opacity: opacityInterpolation,
          },
        ]}
      >
        <View>{children}</View>
      </Animated.View>
    </View>
  );
};

export default Dropdown;
