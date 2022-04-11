/* eslint-disable import/no-cycle */
import { createContext, useContext, useRef } from 'react';

import { useList } from 'react-use';

import { useRoomChange } from '@/common/context/roomContext';

import MovableVideo from '../components/MovableVideo';

export const movableVideosContext = createContext<{
  incrementLastZIndex: () => number;
  isAlreadyMovable: (stream: MediaStream) => boolean;
  addMovableVideo: (stream: MediaStream) => void;
  removeMovableVideo: (stream: MediaStream) => void;
}>({
  incrementLastZIndex: () => 0,
  isAlreadyMovable: () => false,
  addMovableVideo: () => {},
  removeMovableVideo: () => {},
});

export const useMovableVideos = () => {
  const { isAlreadyMovable, addMovableVideo, removeMovableVideo } =
    useContext(movableVideosContext);

  return { isAlreadyMovable, addMovableVideo, removeMovableVideo };
};

export const useLastZIndex = () => {
  const { incrementLastZIndex } = useContext(movableVideosContext);

  return { incrementLastZIndex };
};

const MovableVideosProvider = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  const [movableVideos, movableVideosHandler] = useList<MediaStream>();
  const lastZIndex = useRef(0);

  useRoomChange(() => {
    movableVideosHandler.reset();
  });

  const isAlreadyMovable = (stream: MediaStream) =>
    movableVideos.some((arrStream) => arrStream === stream);

  const addMovableVideo = (stream: MediaStream) => {
    if (!movableVideos.includes(stream)) movableVideosHandler.push(stream);
  };

  const removeMovableVideo = (stream: MediaStream) => {
    const tempIndex = movableVideos.indexOf(stream);

    if (tempIndex > -1) movableVideosHandler.removeAt(tempIndex);
  };

  const incrementLastZIndex = () => {
    lastZIndex.current += 1;

    return lastZIndex.current;
  };

  return (
    <movableVideosContext.Provider
      value={{
        isAlreadyMovable,
        addMovableVideo,
        removeMovableVideo,
        incrementLastZIndex,
      }}
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
