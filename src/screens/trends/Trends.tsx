import Colors from '@/constants/colors';
import React from 'react';
import {Text, View} from 'react-native';

const Trends = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.mainBgColor,
      }}>
      <Text>Trends</Text>
    </View>
  );
};

export default Trends;
