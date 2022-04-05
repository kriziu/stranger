/* eslint-disable import/no-cycle */
import { createContext, useContext, useEffect } from 'react';

import { useList } from 'react-use';

import { useRoomChange } from '@/common/context/storeContext';

import MovableVideo from '../components/MovableVideo';

export const movableVideosContext = createContext<{
  isAlreadyMovable: (stream: MediaStream) => boolean;
  addMovableVideo: (stream: MediaStream) => void;
  removeMovableVideo: (stream: MediaStream) => void;
}>({
  isAlreadyMovable: () => false,
  addMovableVideo: () => {},
  removeMovableVideo: () => {},
});

export const useMovableVideos = () => {
  const { isAlreadyMovable, addMovableVideo, removeMovableVideo } =
    useContext(movableVideosContext);

  return { isAlreadyMovable, addMovableVideo, removeMovableVideo };
};

const MovableVideosProvider = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  const [movableVideos, movableVideosHandler] = useList<MediaStream>();

  useRoomChange(() => {
    movableVideosHandler.reset();
  });

  useEffect(() => {
    movableVideos.forEach((stream) => {
      // ZROBIC INTERVAL
      if (
        stream.getVideoTracks()[0].readyState === 'ended' ||
        stream.getVideoTracks()[0].muted
      ) {
        const tempIndex = movableVideos.indexOf(stream);

        if (tempIndex > -1) movableVideosHandler.removeAt(tempIndex);
      }
    });
  }, [movableVideos, movableVideosHandler]);

  const isAlreadyMovable = (stream: MediaStream) =>
    movableVideos.some((arrStream) => arrStream === stream);

  const addMovableVideo = (stream: MediaStream) => {
    if (!movableVideos.includes(stream)) movableVideosHandler.push(stream);
  };

  const removeMovableVideo = (stream: MediaStream) => {
    const tempIndex = movableVideos.indexOf(stream);

    if (tempIndex > -1) movableVideosHandler.removeAt(tempIndex);
  };

  return (
    <movableVideosContext.Provider
      value={{ isAlreadyMovable, addMovableVideo, removeMovableVideo }}
    >
      {movableVideos.map((stream) => {
        return (
          <MovableVideo stream={stream} key={stream.id} unremovable={false} />
        );
      })}

      {children}
    </movableVideosContext.Provider>
  );
};

export default MovableVideosProvider;
