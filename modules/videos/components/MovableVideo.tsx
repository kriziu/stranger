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
      className="absolute top-20 left-20 z-40 w-1/6 cursor-move overflow-hidden rounded-3xl transition-none"
      onClick={(e) => e.stopPropagation()}
      dragElastic={0.2}
      dragTransition={{ power: 0.1, timeConstant: 100 }}
    >
      {!unremovable && (
        <>
          <button
            className="btn btn-primary absolute left-5 top-5 z-50 p-2"
            onClick={(e) => {
              e.stopPropagation();
              removeMovableVideo(stream);
            }}
          >
            <MdClose />
          </button>

          <button
            className="btn btn-primary absolute right-5 top-5 z-50 p-2"
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
