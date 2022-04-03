import { useContext } from 'react';

import { streamsContext } from './streamContext';

export const useStreamSetters = () => {
  const {
    isScreenStreaming,
    isVideoStreaming,
    isAudioStreaming,
    handleScreenStreaming,
    handleVideoStreaming,
    handleAudioStreaming,
  } = useContext(streamsContext);

  return {
    isScreenStreaming,
    isVideoStreaming,
    isAudioStreaming,
    handleScreenStreaming,
    handleVideoStreaming,
    handleAudioStreaming,
  };
};

export const useMyStream = () => {
  const { myStream } = useContext(streamsContext);

  return myStream;
};
