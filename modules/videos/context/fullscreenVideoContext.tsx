/* eslint-disable import/no-cycle */
import { createContext, useContext, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useRoomChange } from '@/common/context/storeContext';
import { useMyStream } from '@/common/context/streamContext.hooks';

import CustomVideo from '../components/CustomVideo';
import MovableVideo from '../components/MovableVideo';

export const fullscreenVideoContext = createContext<{
  setFullscreenVideo: (stream: MediaStream) => void;
}>({
  setFullscreenVideo: () => {},
});

export const useFullscreen = () => {
  const { setFullscreenVideo } = useContext(fullscreenVideoContext);

  return setFullscreenVideo;
};

const FullscreenVideoProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [fullscreenStream, setFullscreenStream] = useState<MediaStream | null>(
    null
  );

  const myStream = useMyStream();

  useRoomChange(() => setFullscreenStream(null));

  const setFullscreenVideo = (stream: MediaStream) => {
    setFullscreenStream(stream);
  };

  return (
    <fullscreenVideoContext.Provider value={{ setFullscreenVideo }}>
      <AnimatePresence>
        {fullscreenStream && (
          <motion.div
            key="fullscreen-video"
            className="absolute h-full w-full bg-black/50 p-24 backdrop-blur-md transition-none"
            style={{ zIndex: 999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="btn btn-primary absolute top-16 right-16"
              style={{ zIndex: 1000 }}
              onClick={() => setFullscreenStream(null)}
            >
              Close
            </button>

            {myStream && myStream !== fullscreenStream && (
              <MovableVideo stream={myStream} unremovable />
            )}

            <CustomVideo stream={fullscreenStream} isFullscreen />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </fullscreenVideoContext.Provider>
  );
};

export default FullscreenVideoProvider;
