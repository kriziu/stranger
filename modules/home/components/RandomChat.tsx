import { useName, useSocket } from '@/common/context/roomContext';

const RandomChat = ({
  setSearching,
}: {
  setSearching: (nextValue?: any) => void;
}) => {
  const socket = useSocket();
  const { name } = useName();

  const handleSearchRoom = () => {
    socket.emit('join_new', { region: 'poland', name });
    setSearching(true);
  };

  return (
    <div className="flex w-72 flex-col items-center">
      <h3 className="text-3xl font-bold">Random chat</h3>
      <p className="-mt-2 mb-2 text-gray-400">Find random people</p>
      <button className="btn btn-primary" onClick={handleSearchRoom}>
        Join
      </button>
    </div>
  );
};

export default RandomChat;
