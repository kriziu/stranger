/* eslint-disable no-console */
import { createContext, useEffect, useState } from 'react';

import { usePeers } from './peersContext';
import { useRoomChange } from './roomContext';
import { createNewStream } from './streamContext.helpers';

export const streamsContext = createContext<{
  isScreenStreaming: boolean;
  isVideoStreaming: boolean;
  isAudioStreaming: boolean;

  myStream: MediaStream | null;

  handleScreenStreaming: () => void;
  handleVideoStreaming: () => void;
  handleAudioStreaming: () => void;
}>({
  isScreenStreaming: false,
  isVideoStreaming: false,
  isAudioStreaming: false,

  myStream: null,

  handleScreenStreaming: () => {},
  handleVideoStreaming: () => {},
  handleAudioStreaming: () => {},
});

const StreamsProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [isScreenStreaming, setIsScreenStreaming] = useState(false);
  const [isVideoStreaming, setIsVideoStreaming] = useState(false);
  const [isAudioStreaming, setIsAudioStreaming] = useState(false);

  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  const peers = usePeers();

  useRoomChange(() => {
    setMyStream(new MediaStream());
    setIsAudioStreaming(false);
    setIsVideoStreaming(false);
    setIsScreenStreaming(false);
  });

  useEffect(() => {
    // const interval = setInterval(() => {
    //   let connected = true;

    Object.values(peers).forEach((peer) => {
      const stream = (peer as any).streams[0] as MediaStream;

      if (myStream && stream) {
        peer.replaceTrack(
          stream.getVideoTracks()[0],
          myStream.getVideoTracks()[0],
          stream
        );

        const audioTrackClone = stream.clone().getAudioTracks()[0];
        if (isAudioStreaming) audioTrackClone.enabled = true;
        else audioTrackClone.enabled = false;
        peer.replaceTrack(stream.getAudioTracks()[0], audioTrackClone, stream);

        console.log(peer);
        console.log(peer.connected);

        // if (!peer.connected) connected = false;
      }
    });

    //   if (connected) clearInterval(interval);
    // }, 1000);

    return () => {
      // clearInterval(interval);
    };
  }, [isAudioStreaming, isScreenStreaming, isVideoStreaming, myStream, peers]);

  const handleScreenStreaming = () => {
    if (!navigator.mediaDevices.getDisplayMedia) return;
    if (!isScreenStreaming) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then((newStream) => {
          const createdStream = createNewStream(myStream, newStream);

          setMyStream(createdStream);

          newStream.getVideoTracks()[0].addEventListener('ended', () => {
            setIsScreenStreaming(false);
            setMyStream(createNewStream(createdStream));
          });

          setIsScreenStreaming(true);
          setIsVideoStreaming(false);
        })
        .catch((err) => console.log(err));
    } else {
      setMyStream(createNewStream(myStream));

      setIsScreenStreaming(false);
    }
  };

  const handleVideoStreaming = () => {
    if (!isVideoStreaming) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((newStream) => {
          setMyStream(createNewStream(myStream, newStream));

          setIsVideoStreaming(true);
          setIsScreenStreaming(false);
        })
        .catch((err) => console.log(err));
    } else {
      setMyStream(createNewStream(myStream));

      setIsVideoStreaming(false);
    }
  };

  const handleAudioStreaming = () => setIsAudioStreaming(!isAudioStreaming);

  return (
    <streamsContext.Provider
      value={{
        isScreenStreaming,
        isVideoStreaming,
        isAudioStreaming,

        myStream,

        handleScreenStreaming,
        handleVideoStreaming,
        handleAudioStreaming,
      }}
    >
      {children}
    </streamsContext.Provider>
  );
};

export default StreamsProvider;
