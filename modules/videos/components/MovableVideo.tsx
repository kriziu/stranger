import { useRef } from 'react';

import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';

// eslint-disable-next-line import/no-cycle
import { useMovableVideos } from '../context/movableVideosContext';
import CustomVideo from './CustomVideo';

const MovableVideo = ({
  stream,
  mine = false,
}: {
  stream: MediaStream;
  mine?: boolean;
}) => {
  const ref = useRef(document.body);

  const { removeMovableVideo } = useMovableVideos();

  return (
    <motion.div
      drag
      dragConstraints={ref}
      className={`absolute left-10 top-10 z-40 w-1/5 overflow-hidden rounded-3xl transition-none`}
      onClick={(e) => e.stopPropagation()}
      dragElastic={0.2}
      dragTransition={{ power: 0.1, timeConstant: 100 }}
    >
      {!mine && (
        <button
          className="btn btn-primary absolute right-5 top-5 z-50 p-2"
          onClick={(e) => {
            e.stopPropagation();
            removeMovableVideo(stream);
          }}
        >
          <MdClose />
        </button>
      )}

      <CustomVideo stream={stream} />
    </motion.div>
  );
};

export default MovableVideo;
