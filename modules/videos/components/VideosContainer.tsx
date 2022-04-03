import { useState } from 'react';

import { useStreams } from '@/common/context/peersContext';
import { useMyStream } from '@/common/context/streamContext.hooks';

import CustomVideo from './CustomVideo';

const VideosContainer = () => {
  const myStream = useMyStream();

  const [selectedStream, setSelectedStream] = useState<MediaStream | null>(
    null
  );

  const streams = useStreams();

  if (!myStream) return null;

  return (
    <div className="relative grid h-full w-full grid-cols-3 grid-rows-3 gap-1 p-1">
      {selectedStream && (
        <div
          className="absolute top-0 left-0 h-full w-full p-2"
          onClick={() => setSelectedStream(null)}
        >
          <CustomVideo stream={selectedStream} active />

          <div
            className="absolute left-10 top-10 w-1/4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <CustomVideo stream={myStream} />
          </div>
        </div>
      )}

      {!selectedStream && (
        <>
          {[myStream, ...Object.values(streams)].map((stream) => (
            <div
              key={stream.id}
              onClick={() => setSelectedStream(stream)}
              className="overflow-hidden rounded-xl"
            >
              <CustomVideo stream={stream} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default VideosContainer;
