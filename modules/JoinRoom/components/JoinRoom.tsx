import { useRouter } from 'next/router';

import { useName, useSocket } from '@/common/context/storeContext';

const JoinRoom = () => {
  const { name, setName } = useName();
  const socket = useSocket();

  const { roomId } = useRouter().query;

  const handleConnectToRoom = () => {
    if (roomId) socket.emit('join_created', roomId.toString(), name);
  };

  return (
    <>
      <h3 className="mt-10 mb-3 px-5 text-center text-3xl font-bold">
        You are about to join room
      </h3>
      <div className="flex w-48 flex-col space-y-3">
        <input
          className="input"
          type="text"
          placeholder="Enter name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleConnectToRoom}>
          Join now
        </button>
      </div>
    </>
  );
};

export default JoinRoom;
