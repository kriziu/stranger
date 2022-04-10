import { ChangeEvent } from 'react';

import Resizer from 'react-image-file-resizer';

import { useSocket } from '@/common/context/roomContext';
import { useStreamSetters } from '@/common/context/streamContext.hooks';

const btnClass =
  'btn btn-secondary w-24 sm:w-36 px-0 text-center font-semibold text-sm md:text-base';

const active = 'bg-green-400 text-black hover:bg-green-500 active:bg-green-400';

const RoomUtilities = () => {
  const socket = useSocket();

  const {
    isScreenStreaming,
    isVideoStreaming,
    isAudioStreaming,
    handleScreenStreaming,
    handleVideoStreaming,
    handleAudioStreaming,
  } = useStreamSetters();

  const handleSendImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    Resizer.imageFileResizer(
      e.target.files[0],
      800,
      800,
      'JPEG',
      100,
      0,
      (uri) => {
        const base64URL = uri as string;

        socket.emit('send_img', base64URL);
      }
    );
  };

  return (
    <div>
      <div className="flex flex-1 flex-wrap items-center justify-center space-y-3 space-x-2 sm:flex-nowrap lg:flex-col">
        <h3 className="-mb-2 hidden text-center text-xl font-bold lg:block">
          Utilities
        </h3>
        <button
          className={`${btnClass} ${isVideoStreaming && active}`}
          onClick={handleVideoStreaming}
        >
          Video chat
        </button>
        <button
          className={`${btnClass} ${isAudioStreaming && active}`}
          onClick={handleAudioStreaming}
        >
          Audio chat
        </button>
        <button
          className={`${btnClass} ${
            isScreenStreaming && active
          } disabled:opacity-30`}
          onClick={handleScreenStreaming}
          disabled={!navigator.mediaDevices.getDisplayMedia}
        >
          Share screen
        </button>
        <label
          className={`${btnClass} cursor-pointer`}
          tabIndex={0}
          htmlFor="select"
        >
          Send image
        </label>
        <input
          id="select"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleSendImage}
        />
      </div>
    </div>
  );
};

export default RoomUtilities;
