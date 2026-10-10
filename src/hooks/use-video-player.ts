import {useCallback, useRef, useState} from 'react';

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface VideoPlayerHandlers {
  onLoad: (data: any) => void;
  onProgress: (data: any) => void;
  onError: (error: any) => void;
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
}

export const useVideoPlayer = () => {
  const playerRef = useRef<any>(null);

  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: true,
    hasError: false,
  });

  const handlers: VideoPlayerHandlers = {
    onLoad: useCallback((data: any) => {
      setState(prev => ({
        ...prev,
        duration: data.duration || 0,
        isLoading: false,
        hasError: false,
      }));
    }, []),

    onProgress: useCallback((data: any) => {
      setState(prev => ({
        ...prev,
        currentTime: data.currentTime || 0,
      }));
    }, []),

    onError: useCallback((error: any) => {
      setState(prev => ({
        ...prev,
        hasError: true,
        errorMessage: error.message || 'Video playback error',
        isLoading: false,
      }));
    }, []),

    play: useCallback(() => {
      setState(prev => ({...prev, isPlaying: true}));
    }, []),

    pause: useCallback(() => {
      setState(prev => ({...prev, isPlaying: false}));
    }, []),

    seekTo: useCallback((time: number) => {
      setState(prev => ({...prev, currentTime: time}));
    }, []),
  };

  return {
    playerRef,
    state,
    handlers,
  };
};
