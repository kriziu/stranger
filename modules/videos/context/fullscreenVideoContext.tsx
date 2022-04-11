/* eslint-disable import/no-cycle */
import { createContext, useContext, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import Portal from '@/common/components/Portal/Portal';
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

  const setFullscreenVideo = (stream: MediaStream) => {
    setFullscreenStream(stream);
  };

  return (
    <fullscreenVideoContext.Provider value={{ setFullscreenVideo }}>
      <Portal>
        <AnimatePresence>
          {fullscreenStream && (
            <motion.div
              key="fullscreen-video"
              className="absolute h-full w-full bg-black/50 p-2 backdrop-blur-md transition-none sm:p-5 lg:p-24"
              style={{ zIndex: 999 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                className="btn btn-primary absolute top-5 right-5 lg:top-16 lg:right-16"
                style={{ zIndex: 1000 }}
                onClick={() => setFullscreenStream(null)}
              >
                Close
              </button>

              {myStream && myStream !== fullscreenStream && (
                <MovableVideo stream={myStream} unremovable fullScreen />
              )}

              <div className="absolute left-0 top-0 -z-10 flex h-full w-full items-center justify-center">
                <h3 className="text-2xl font-bold">No video stream</h3>
              </div>

              <CustomVideo stream={fullscreenStream} isFullscreen />
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
      {children}
    </fullscreenVideoContext.Provider>
  );
};

export default FullscreenVideoProvider;
