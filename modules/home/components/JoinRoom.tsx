import { FormEvent, useState } from 'react';

import { useName, useSocket } from '@/common/context/roomContext';

const JoinRoom = () => {
  const socket = useSocket();
  const { name } = useName();

  const [roomId, setRoomId] = useState('');

  const handleConnectToRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomId) socket.emit('join_created', roomId, name);
  };

  return (
    <form
      className="flex w-72 flex-col items-center"
      onSubmit={handleConnectToRoom}
    >
      <h3 className="text-3xl font-bold">Custom room</h3>
      <p className="-mt-2 mb-2 w-3/4 text-center leading-5 text-gray-400">
        Join to custom room with id
      </p>
      <input
        className="input mb-3 w-48"
        placeholder="Enter room id"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">
        Join
      </button>
    </form>
  );
};

export default JoinRoom;
