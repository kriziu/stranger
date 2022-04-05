import { useStreams } from '@/common/context/peersContext';
import { useMyStream } from '@/common/context/streamContext.hooks';

import { useMovableVideos } from '../context/movableVideosContext';
import CustomVideo from './CustomVideo';

const VideosContainer = () => {
  const myStream = useMyStream();
  const streams = useStreams();

  const { isAlreadyMovable, removeMovableVideo } = useMovableVideos();

  if (!myStream) return null;

  const stream = myStream;

  return (
    <div
      className={`absolute top-0 left-0 grid h-full w-full grid-cols-3 grid-rows-3 gap-1 p-1`}
    >
      {[...Array(9).keys()].map((i) => {
        const isMovable = isAlreadyMovable(stream);

        return (
          <div
            key={i}
            className="relative h-full w-full overflow-hidden rounded-xl"
          >
            {isMovable && (
              <div className="flex h-full w-full items-center justify-center bg-black">
                <button
                  className="btn btn-primary"
                  onClick={() => removeMovableVideo(stream)}
                >
                  Reset
                </button>
              </div>
            )}

            {!isMovable && <CustomVideo stream={stream} utilityBtns />}
          </div>
        );
      })}
    </div>
  );
};

export default VideosContainer;
