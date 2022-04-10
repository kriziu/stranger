/* eslint-disable import/no-cycle */
import { useRef } from 'react';

import { motion } from 'framer-motion';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { MdClose } from 'react-icons/md';

import { useFullscreen } from '../context/fullscreenVideoContext';
import { useMovableVideos } from '../context/movableVideosContext';
import CustomVideo from './CustomVideo';

const MovableVideo = ({
  stream,
  unremovable = false,
}: {
  stream: MediaStream;
  unremovable?: boolean;
}) => {
  const ref = useRef(document.body);

  const { removeMovableVideo } = useMovableVideos();
  const setFullscreenVideo = useFullscreen();

  return (
    <motion.div
      drag
      dragConstraints={ref}
      className="group absolute top-20 left-20 z-40 w-1/2 cursor-move overflow-hidden rounded-xl transition-none sm:w-1/3 md:w-1/4 lg:w-1/5 2xl:w-1/6"
      onClick={(e) => e.stopPropagation()}
      dragElastic={0.2}
      dragTransition={{ power: 0.1, timeConstant: 100 }}
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
  );
};

export default MovableVideo;
