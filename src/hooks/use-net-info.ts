import NetInfo from '@react-native-community/netinfo';
import {useEffect, useState} from 'react';

const useNetInfo = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
};

export default useNetInfo;
