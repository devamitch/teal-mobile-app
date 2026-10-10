import useAppStore from '@/core/stores';
import {useEffect} from 'react';
import {useShallow} from 'zustand/react/shallow';

export const useMedia = () => {
  const {
    groups,
    ungrouped,
    loading,
    error,
    lastUpdated,
    loadMedia,
    refreshMedia,
    clearMedia,
  } = useAppStore(useShallow(state => state.media));

  // Initial load
  useEffect(() => {
    loadMedia?.();
  }, [lastUpdated, loading, loadMedia]);

  return {
    groups,
    ungrouped,
    loading,
    error,
    lastUpdated,
    refreshMedia,
    clearMedia,
    hasData: groups.length > 0 || ungrouped.length > 0,
  };
};
