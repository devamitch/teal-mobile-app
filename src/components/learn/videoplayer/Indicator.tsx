import {memo} from 'react';
import {ActivityIndicator} from 'react-native';

const _Indicator = () => {
  return <ActivityIndicator color="#2D7D7A" size="large" />;
};

export const Indicator = memo(_Indicator);
