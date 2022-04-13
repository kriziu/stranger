/* eslint-disable import/no-cycle */
import { useRef } from 'react';

import { motion } from 'framer-motion';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { MdClose } from 'react-icons/md';

import Portal from '@/common/components/Portal/Portal';

import { useFullscreen } from '../context/fullscreenVideoContext';
import {
  useLastZIndex,
  useMovableVideos,
} from '../context/movableVideosContext';
import CustomVideo from './CustomVideo';

const MovableVideo = ({
  stream,
  unremovable = false,
  fullScreen = false,
}: {
  stream: MediaStream;
  unremovable?: boolean;
  fullScreen?: boolean;
}) => {
  const ref = useRef(document.body);
  const videoContainer = useRef<HTMLDivElement>(null);

  const { removeMovableVideo } = useMovableVideos();
  const setFullscreenVideo = useFullscreen();

  const { incrementLastZIndex } = useLastZIndex();

  const handleMouseDown = () => {
    if (fullScreen) return;

    const index = incrementLastZIndex();

    if (videoContainer.current) {
      console.log(videoContainer.current.style.zIndex);
      videoContainer.current.style.zIndex = `${index}`;
    }
  };

  return (
    <Portal>
      <motion.div
        drag
        dragConstraints={ref}
        className="group absolute top-20 left-20 w-1/2 cursor-move overflow-hidden rounded-xl transition-none sm:w-1/3 md:w-1/4 lg:w-1/5 2xl:w-1/6"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onTapStart={handleMouseDown}
        dragElastic={0.2}
        dragTransition={{ power: 0.1, timeConstant: 100 }}
        style={{ zIndex: fullScreen ? 9999 : 5 }}
        ref={videoContainer}
      >
        {!unremovable && (
          <>
            <button
              className="btn btn-primary absolute left-2 top-2 z-50 hidden p-2 group-hover:block sm:left-5 sm:top-5"
              onClick={(e) => {
                e.stopPropagation();
                removeMovableVideo(stream);
              }}
            >
              <MdClose />
            </button>

            <button
              className="btn btn-primary absolute right-2 top-2 z-50 hidden p-2 group-hover:block sm:right-5 sm:top-5"
              onClick={() => setFullscreenVideo(stream)}
            >
              <AiOutlineExpandAlt />
            </button>
          </>
        )}

        <CustomVideo stream={stream} />
      </motion.div>
    </Portal>
  );
};

export default MovableVideo;
