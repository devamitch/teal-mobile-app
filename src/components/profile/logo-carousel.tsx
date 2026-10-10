import React, {useRef, useEffect} from 'react';
import {
  View,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
  Easing,
} from 'react-native';
import {IMAGES} from '@/constants';
import Colors from '@/constants/colors';

const LogoCarousel = () => {
  // Animation value for the position
  const scrollX = useRef(new Animated.Value(0)).current;
  const {width} = Dimensions.get('window');

  const logos = [
    IMAGES.AuraCore,
    IMAGES.rmh,
    IMAGES.shrf,
    IMAGES.ur,
    IMAGES.iapmd,
  ];

  useEffect(() => {
    // Calculate the width of a single logo item (logo + margins)
    const logoItemWidth = 120; // 100px width + 20px margins

    // Calculate total content width of a single set of logos
    const contentWidth = logos.length * logoItemWidth;

    // Create a continuous loop animation
    const animation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -contentWidth,
        duration: 15000, // 15 seconds for one complete scroll
        useNativeDriver: true,
        easing: Easing.linear, // Linear easing ensures constant speed
      }),
    );

    // Start the animation
    animation.start();

    return () => {
      // Clean up animation on unmount
      animation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{translateX: scrollX}],
          },
        ]}>
        {/* First set of logos */}
        {logos.map((logo, index) => (
          <Image
            key={`logo-${index}`}
            source={logo}
            style={[
              styles.logo,
              logo !== IMAGES.AuraCore && {tintColor: Colors.black},
            ]}
          />
        ))}

        {/* Duplicate set for seamless transition */}
        {logos.map((logo, index) => (
          <Image
            key={`logo-duplicate-${index}`}
            source={logo}
            style={[
              styles.logo,
              logo !== IMAGES.AuraCore && {tintColor: Colors.black},
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    overflow: 'hidden',
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
    resizeMode: 'contain',
  },
});

export default LogoCarousel;
