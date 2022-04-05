import { useStreamSetters } from '@/common/context/streamContext.hooks';

const btnClass =
  'btn btn-secondary w-24 sm:w-36 px-0 text-center font-semibold text-sm md:text-base';

const active = 'bg-green-400 text-black hover:bg-green-500 active:bg-green-400';

const RoomUtilities = () => {
  const {
    isScreenStreaming,
    isVideoStreaming,
    isAudioStreaming,
    handleScreenStreaming,
    handleVideoStreaming,
    handleAudioStreaming,
  } = useStreamSetters();

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
        <button className={`${btnClass}`}>Send image</button>
      </div>
    </div>
  );
};

export default RoomUtilities;
