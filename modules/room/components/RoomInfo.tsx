import { useEffect, useState } from 'react';

import { useCopyToClipboard } from 'react-use';

import { useRoom } from '@/common/context/roomContext';

const RoomInfo = () => {
  const room = useRoom();

  const [show, setShow] = useState(false);
  const [copied, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (copied.value) {
      setShow(true);

      setTimeout(() => {
        setShow(false);
      }, 1250);
    }
  }, [copied]);

  return (
    <>
      <h2 className="mt-5 text-2xl font-bold text-zinc-200 sm:mt-0  md:text-3xl lg:text-4xl">
        {room.type === 'private' ? 'Private Room' : 'Custom Room'}
      </h2>
      {room.type === 'public' && (
        <div className="flex items-center space-x-3">
          <h4 className="text-center text-base font-bold text-zinc-400 md:text-xl lg:text-2xl">
            {room.id}
          </h4>
          <div className="relative">
            {show && (
              <div className="absolute bottom-full mb-2 rounded-2xl bg-black px-5 py-3">
                Copied!
              </div>
            )}

            <button
              className="btn btn-primary h-full px-2 py-1 text-sm"
              onClick={() => copyToClipboard(room.id)}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomInfo;
