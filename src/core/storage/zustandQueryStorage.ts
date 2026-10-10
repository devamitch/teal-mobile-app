import { useStore } from '../stores';

// Create a storage adapter that uses our query slice
export const createZustandQueryStorage = () => {
  return {
    getItem: (key: string): null | string => {
      return useStore.getState().query.getItem(key);
    },
    removeItem: (key: string): void => {
      useStore.getState().query.removeItem(key);
    },
    setItem: (key: string, value: string): void => {
      useStore.getState().query.setItem(key, value);
    },
  };
};
