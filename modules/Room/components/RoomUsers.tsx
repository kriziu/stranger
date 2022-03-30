import Badge from '@/common/components/Badge/Badge';
import { useRoom } from '@/common/context/storeContext';

const RoomUsers = () => {
  const room = useRoom();

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-start space-y-2">
        <h3 className="-mb-1 text-center text-xl font-bold">Users in room</h3>
        {room.users.map((user) => (
          <Badge
            color={room.colorsAssociated.get(user.id) || 'blue'}
            key={user.id}
          >
            {user.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RoomUsers;
