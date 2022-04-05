import { useStreams } from '@/common/context/peersContext';
import { useMyStream } from '@/common/context/streamContext.hooks';

import { useMovableVideos } from '../context/movableVideosContext';
import CustomVideo from './CustomVideo';

const VideosContainer = () => {
  const myStream = useMyStream();
  const streams = useStreams();

  const { isAlreadyMovable, removeMovableVideo } = useMovableVideos();

  if (!myStream) return null;

  return (
    <div
      className={`absolute top-0 left-0 grid h-full w-full grid-cols-3 grid-rows-3 gap-1 p-1 pb-0`}
    >
      {[myStream, ...Object.values(streams)].map((stream) => {
        const isMovable = isAlreadyMovable(stream);

        return (
          <div
            key={stream.id}
            className="group relative h-full w-full overflow-hidden rounded-xl"
          >
            {isMovable && (
              <div className="flex h-full w-full items-center justify-center bg-black">
                <button
                  className="btn btn-primary py-1 px-2 text-xs sm:text-lg 2xl:py-2 2xl:px-5"
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
