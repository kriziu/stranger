import { useRoom } from '@/common/context/storeContext';
import JoinRoom from '@/modules/JoinRoom/components/JoinRoom';
import Room from '@/modules/Room/components/Room';

const RoomPage = () => {
  const room = useRoom();

  if (room.id) return <Room />;

  return <JoinRoom />;
};

export default RoomPage;
