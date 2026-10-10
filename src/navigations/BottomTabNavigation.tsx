import FONT_FAMILIES from '@/constants/fonts';
import {createMessageTables} from '@/services/sqlite/chat-messages';
import {createFeminineHealthTables, fetchLastGeneratedDate} from '@/services/sqlite/feminine-health';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useLayoutEffect} from 'react';
import {Platform} from 'react-native';
import Colors, {lightTheme} from '../constants/colors';
import Home from '../screens/home/Home';
import Learn from '../screens/learn/Learn';
import Profile from '../screens/profile/Profile';

// Import custom icon components instead of SVG files
import {BookIcon, HomeIcon, UserIcon} from '../components/common/icons';
import moment from 'moment';
import useAppStore from '@/core/stores';
import { useShallow } from 'zustand/react/shallow';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  const [index, setIndex] = React.useState('0');

  const { addPeriodDates } = useAppStore(state => state.cycle);
  const date = moment();

  const { getQuizWithID } = useAppStore(state => state.engagement);

  const generateDates = () => {
    fetchLastGeneratedDate()
      .then((last_date) => {
        if(date.isAfter(moment(last_date))){
          const startDate = moment(last_date).add(5, 'days');
          const endDate = moment(last_date).add(9, 'days');
          const cycle_days = getQuizWithID(5)?.answer || 28;

          addPeriodDates(startDate, endDate, cycle_days);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useLayoutEffect(
    generateDates,
    []
  )

  useEffect(() => {
    createFeminineHealthTables();
    createMessageTables();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: Colors.black,
        tabBarActiveTintColor: lightTheme.gradientMiddle,
        tabBarItemStyle: {
          height: 48,
          width: 45,
          alignSelf: 'center',
        },
        tabBarStyle: {
          height: 80,
          elevation: 10,
          borderColor: Colors.black,
          backgroundColor: Colors.white,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.44,
          shadowRadius: 2,
          paddingTop: Platform.OS === 'ios' ? 10 : -5,
        },
      })}>
      <Tab.Screen
        name="Learn"
        component={Learn}
        listeners={{
          tabPress: e => {
            setIndex('2');
          },
        }}
        options={{
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '500',
            fontFamily: FONT_FAMILIES.YoungSerifRegular,
          },
          headerShown: false,
          tabBarIcon: ({color, size}) => <BookIcon color={color} size={25} />,
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        listeners={{
          tabPress: e => {
            setIndex('0');
          },
        }}
        options={{
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '500',
            fontFamily: FONT_FAMILIES.YoungSerifRegular,
          },
          headerShown: false,
          tabBarIcon: ({color, size}) => <HomeIcon color={color} size={25} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        listeners={{
          tabPress: e => {
            setIndex('1');
          },
        }}
        options={{
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '500',
            fontFamily: FONT_FAMILIES.YoungSerifRegular,
          },
          headerShown: false,
          tabBarIcon: ({color, size}) => <UserIcon color={color} size={25} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
