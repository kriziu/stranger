import { useInterval } from 'react-use';

export const useCheckStream = (
  stream: MediaStream | null,
  callback: () => void,
  elseCallback?: () => void
) =>
  useInterval(() => {
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];

    if (!videoTrack || !videoTrack.enabled || videoTrack.muted) callback();
    else if (elseCallback) elseCallback();
  }, 1000);
