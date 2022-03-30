import { useState } from 'react';

import { useBoolean, useInterval } from 'react-use';

import { useName, useSocket } from '@/common/context/storeContext';

import CreateChat from './CreateChat';
import JoinChat from './JoinChat';
import RandomChat from './RandomChat';

const Home = () => {
  const socket = useSocket();

  const { name, setName } = useName();

  const [searching, setSearching] = useBoolean(false);
  const [dots, setDots] = useState(0);

  useInterval(() => {
    setDots((prev) => (prev === 3 ? 0 : prev + 1));
  }, 750);

  const handleCancelSearch = () => {
    socket.emit('leave_queue');
    setSearching(false);
  };

  return (
    <div className="flex flex-col items-center">
      {searching && (
        <div className="mt-10 flex flex-col items-center">
          <h3 className="text-2xl text-zinc-400">
            Waiting for other user to connect{'.'.repeat(dots)}
          </h3>
          <button
            className="btn btn-secondary mt-3 px-4 font-normal"
            onClick={handleCancelSearch}
          >
            Cancel
          </button>
        </div>
      )}

      {!searching && (
        <>
          <input
            className="input mb-10 mt-14 sm:mt-0"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex w-auto flex-col items-center justify-between space-y-10 sm:w-160 md:flex-row md:items-start md:space-y-0">
            <RandomChat setSearching={setSearching} />
            <span className="hidden h-96 w-px bg-zinc-600 md:block" />
            <div className="flex flex-col space-y-10">
              <JoinChat />
              <CreateChat />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
