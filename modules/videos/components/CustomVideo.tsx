/* eslint-disable import/no-cycle */
import { useMemo, useState } from 'react';

import { AiOutlineExpandAlt } from 'react-icons/ai';
import { BiMove } from 'react-icons/bi';

import { useStreams } from '@/common/context/peersContext';
import { useRoom, useSocket } from '@/common/context/roomContext';

import { useFullscreen } from '../context/fullscreenVideoContext';
import { useMovableVideos } from '../context/movableVideosContext';
import { useCheckStream } from '../hooks/useCheckStream';

interface Props {
  stream: MediaStream;
  utilityBtns?: boolean;
  isFullscreen?: boolean;
}

const center = '-translate-y-1/2 top-1/2 md:top-5 md:translate-y-0';

const AudioComponent = ({ stream }: { stream: MediaStream }) => (
  <audio
    ref={(audio) => {
      if (audio) {
        // eslint-disable-next-line no-param-reassign
        audio.srcObject = stream;

        audio.addEventListener('loadedmetadata', () => {
          audio.play().catch(() => {});
        });
      }
    }}
  />
);

const CustomVideo = ({
  stream,
  utilityBtns = false,
  isFullscreen = false,
}: Props) => {
  const [disabled, setDisabled] = useState(false);

  const { addMovableVideo } = useMovableVideos();

  const setFullscreenVideo = useFullscreen();

  const streams = useStreams();
  const room = useRoom();
  const socket = useSocket();

  const colorAssociated = useMemo(() => {
    let userId = Object.keys(streams).find((id) => streams[id] === stream);
    if (!userId) userId = socket.id;

    return room.colorsAssociated.get(userId);
  }, [room.colorsAssociated, socket.id, stream, streams]);

  const userName = useMemo(() => {
    let userId = Object.keys(streams).find((id) => streams[id] === stream);
    if (!userId) userId = socket.id;

    return room.users.find((user) => user.id === userId)?.name;
  }, [room.users, socket.id, stream, streams]);

  useCheckStream(
    stream,
    () => setDisabled(true),
    () => setDisabled(false)
  );

  if (disabled && isFullscreen) return null;

  if (disabled)
    return (
      <div
        className={`w-full bg-${colorAssociated}-400 ${
          utilityBtns ? 'h-full' : 'h-32'
        } flex items-center justify-center`}
      >
        <h3 className="px-5 text-center text-2xl font-bold text-black">
          {userName}
        </h3>
        <AudioComponent stream={stream} />
      </div>
    );

  return (
    <>
      {utilityBtns && (
        <>
          <button
            className={`btn btn-primary absolute ${center} left-2 z-10 hidden p-2 group-hover:block xl:left-5`}
            onClick={(e) => {
              e.stopPropagation();
              addMovableVideo(stream);
            }}
          >
            <BiMove />
          </button>
          <button
            className={`btn btn-primary absolute ${center} right-2 z-10 hidden p-2 group-hover:block xl:right-5`}
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenVideo(stream);
            }}
          >
            <AiOutlineExpandAlt />
          </button>
        </>
      )}

      <video
        ref={(video) => {
          if (video) {
            // eslint-disable-next-line no-param-reassign
            video.srcObject = stream;

            video.addEventListener('loadedmetadata', () => {
              video.play().catch(() => {});
            });
          }
        }}
        autoPlay
        playsInline
        muted
        className={`h-full w-full ${!isFullscreen && 'object-cover'}`}
      />

      <h3
        className={`absolute bottom-2 right-2 rounded-lg bg-${colorAssociated}-400 px-1 text-xs text-black`}
      >
        {userName}
      </h3>

      {!isFullscreen && <AudioComponent stream={stream} />}
    </>
  );
};

export default CustomVideo;
