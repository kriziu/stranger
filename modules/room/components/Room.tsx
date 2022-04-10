import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { BsChevronUp } from 'react-icons/bs';
import { FaVideo } from 'react-icons/fa';
import { useBoolean, useMedia } from 'react-use';

import Chat from '@/modules/chat/components/Chat';
import VideosContainer from '@/modules/videos/components/VideosContainer';

import RoomInfo from './RoomInfo';
import RoomUtilities from './RoomUtilities';

const Room = () => {
  const [videosOpened, setVideosOpened] = useBoolean(true);

  const [videosAnimations, setVideosAnimations] = useState({});

  const isVerySmall = useMedia('(max-width: 640px)');

  useEffect(() => {
    setVideosOpened(false);
  }, [setVideosOpened]);

  useEffect(() => {
    if (!isVerySmall) {
      setVideosAnimations({ maxHeight: '100%' });
    } else {
      setVideosAnimations(
        videosOpened ? { maxHeight: '50%' } : { maxHeight: 0 }
      );
    }
  }, [isVerySmall, videosOpened]);

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <RoomInfo />

      {/* TOP ON MOBILES */}
      <div className="flex w-full flex-col space-y-5 px-5 sm:px-14 lg:hidden">
        <div className="flex flex-col space-y-5 overflow-hidden pb-2 transition-none">
          <RoomUtilities />
        </div>
      </div>

      <div className="mt-2 flex w-full grow flex-col md:flex-row 2xl:mt-16">
        <div className="hidden px-7 lg:block 2xl:px-14">
          <RoomUtilities />
        </div>

        <div className="h-chat relative flex w-full flex-col-reverse justify-between px-0 sm:pr-5 md:flex-row xl:pr-10 2xl:pr-20">
          <span className="hidden h-full w-px bg-zinc-600 lg:block" />

          <div className=" flex-1">
            <Chat />
          </div>

          <button
            className="btn btn-primary absolute right-5 bottom-full w-min p-2 sm:hidden"
            onClick={() => setVideosOpened(!videosOpened)}
          >
            <FaVideo />
          </button>

          <motion.div
            className="relative flex-1 transition-none"
            animate={videosAnimations}
            transition={{ type: 'just' }}
          >
            <VideosContainer />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Room;
