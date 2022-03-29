import { useState } from 'react';

import { useName, useSocket } from '@/common/context/storeContext';

const JoinChat = () => {
  const socket = useSocket();
  const { name } = useName();

  const [roomId, setRoomId] = useState('');

  const handleConnectToRoom = () => {
    socket.emit('join_created', roomId, name);
  };

  return (
    <div className="flex w-72 flex-col items-center">
      <h3 className="text-3xl font-bold">Custom chat</h3>
      <p className="-mt-2 mb-2 w-2/3 text-center leading-5 text-gray-400">
        Join to custom chat with id
      </p>
      <input
        className="input mb-3 w-48"
        placeholder="Enter chat id"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleConnectToRoom}>
        Join
      </button>
    </div>
  );
};

export default JoinChat;
