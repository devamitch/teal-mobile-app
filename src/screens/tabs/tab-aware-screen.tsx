import Colors, {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Import your icon components
import {BookIcon, HomeIcon, UserIcon} from '../../components/common/icons';

interface TabAwareScreenProps {
  children: React.ReactNode;
  activeTab?: 'Home' | 'Learn' | 'Profile';
  hideTabBar?: boolean;
}

const TabAwareScreen: React.FC<TabAwareScreenProps> = ({
  children,
  activeTab = 'Home',
  hideTabBar = false,
}) => {
  const navigation = useNavigation();

  // Map tab names to index values
  const tabIndices = {
    Learn: '2',
    Home: '0',
    Profile: '1',
  };

  // Initialize with the active tab
  const [index, setIndex] = useState(tabIndices[activeTab]);

  // Navigation functions for each tab
  const navigateToLearn = () => {
    setIndex('2');
    navigation.reset({
      index: 0,
      routes: [{name: 'BottomTabNavigation', params: {screen: 'Learn'}}],
    });
  };

  const navigateToHome = () => {
    setIndex('0');
    navigation.reset({
      index: 0,
      routes: [{name: 'BottomTabNavigation', params: {screen: 'Home'}}],
    });
  };

  const navigateToProfile = () => {
    setIndex('1');
    navigation.reset({
      index: 0,
      routes: [{name: 'BottomTabNavigation', params: {screen: 'Profile'}}],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>

      {!hideTabBar && (
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            {/* Learn Tab */}
            <TouchableOpacity
              style={[styles.tabItem, index === '2' ? styles.activeTab : null]}
              onPress={navigateToLearn}
              activeOpacity={0.7}>
              <BookIcon
                color={index === '2' ? lightTheme.gradientMiddle : Colors.black}
                size={25}
              />
              <View style={styles.tabLabelContainer}>
                <View style={styles.tabLabel}>
                  <Text
                    style={[
                      styles.tabLabelText,
                      index === '2' ? styles.activeTabText : null,
                    ]}>
                    Learn
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Home Tab */}
            <TouchableOpacity
              style={[styles.tabItem, index === '0' ? styles.activeTab : null]}
              onPress={navigateToHome}
              activeOpacity={0.7}>
              <HomeIcon
                color={index === '0' ? lightTheme.gradientMiddle : Colors.black}
                size={25}
              />
              <View style={styles.tabLabelContainer}>
                <View style={styles.tabLabel}>
                  <Text
                    style={[
                      styles.tabLabelText,
                      index === '0' ? styles.activeTabText : null,
                    ]}>
                    Home
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Profile Tab */}
            <TouchableOpacity
              style={[styles.tabItem, index === '1' ? styles.activeTab : null]}
              onPress={navigateToProfile}
              activeOpacity={0.7}>
              <UserIcon
                color={index === '1' ? lightTheme.gradientMiddle : Colors.black}
                size={25}
              />
              <View style={styles.tabLabelContainer}>
                <View style={styles.tabLabel}>
                  <Text
                    style={[
                      styles.tabLabelText,
                      index === '1' ? styles.activeTabText : null,
                    ]}>
                    Profile
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBgColor,
  },
  content: {
    flex: 1,
  },
  tabBarContainer: {
    height: 80,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabItem: {
    height: 48,
    width: 80, // Increased width for better touch target
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    // Active tab styling
  },
  tabLabelContainer: {
    marginTop: 4,
  },
  tabLabel: {
    alignItems: 'center',
  },
  tabLabelText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: Colors.black,
  },
  activeTabText: {
    color: lightTheme.gradientMiddle,
  },
});

export default TabAwareScreen;
