import { BsChevronUp } from 'react-icons/bs';
import { useBoolean } from 'react-use';

// import Chat from '@/modules/chat/components/Chat';
import VideosContainer from '@/modules/videos/components/VideosContainer';

import RoomInfo from './RoomInfo';
import RoomUsers from './RoomUsers';
import RoomUtilities from './RoomUtilities';

const Room = () => {
  const [opened, setOpened] = useBoolean(false);

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <RoomInfo />
      {/* TOP ON MOBILES */}
      <div className=" flex w-full flex-col space-y-5 px-5 sm:px-14 md:hidden">
        <div
          className={`${
            opened ? 'mt-3 max-h-[25rem]' : 'max-h-0'
          } flex flex-col space-y-5 overflow-hidden transition-all `}
        >
          <RoomUsers />
          <RoomUtilities />
        </div>
        <button
          className={`btn btn-primary w-max ${
            !opened && 'rotate-180'
          } self-center p-2`}
          onClick={() => setOpened(!opened)}
        >
          <BsChevronUp />
        </button>
      </div>

      <div className="mt-2 flex w-full grow flex-col md:mt-16 md:flex-row">
        <div className="hidden basis-1/4 md:block">
          <RoomUsers />
        </div>

        <div className="h-chat flex w-full px-0 sm:px-5 md:basis-1/2 md:px-0">
          <span className="hidden h-full w-px bg-zinc-600 md:block" />
          {/* <Chat /> */}
          <VideosContainer />
          <span className="hidden h-full w-px bg-zinc-600 md:block" />
        </div>

        <div className="hidden basis-1/4 md:block">
          <RoomUtilities />
        </div>
      </div>
    </div>
  );
};

export default Room;
