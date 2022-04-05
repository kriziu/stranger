import { useCheckConnectedAll } from '@/common/context/peersContext';
import { useRoom } from '@/common/context/roomContext';
import JoinRoom from '@/modules/joinRoom/components/JoinRoom';
import Room from '@/modules/room/components/Room';

const RoomPage = () => {
  const room = useRoom();

  const connectedAll = useCheckConnectedAll();

  console.log(connectedAll);

  if (!connectedAll) return <div>connecting...</div>;

  if (room.id) return <Room />;

  return <JoinRoom />;
};

export default RoomPage;
