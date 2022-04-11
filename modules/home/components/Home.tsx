import { useBoolean } from 'react-use';

import Dots from '@/common/components/Dots/Dots';
import { useName, useSocket } from '@/common/context/roomContext';

import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import RandomRoom from './RandomRoom';

const Home = () => {
  const socket = useSocket();

  const { name, setName } = useName();

  const [searching, setSearching] = useBoolean(false);

  const handleCancelSearch = () => {
    socket.emit('leave_queue');
    setSearching(false);
  };

  return (
    <div className="flex flex-col items-center">
      {searching && (
        <div className="mt-10 flex flex-col items-center">
          <h3 className="px-5 text-center text-2xl text-zinc-400">
            Waiting for other user to connect
            <Dots />
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
            <RandomRoom setSearching={setSearching} />
            <span className="hidden h-96 w-px bg-zinc-600 md:block" />
            <div className="flex flex-col space-y-10">
              <JoinRoom />
              <CreateRoom />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
