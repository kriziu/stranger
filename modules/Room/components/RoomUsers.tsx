import Badge from '@/common/components/Badge/Badge';
import { useRoom } from '@/common/context/storeContext';

const RoomUsers = () => {
  const room = useRoom();

  return (
    <div className="flex flex-col items-start md:items-center">
      <h3 className="-mb-1 block text-center text-xl font-bold md:hidden">
        Users in room
      </h3>
      <div className="flex flex-wrap items-start space-y-2 space-x-3 md:flex-col md:space-x-0">
        <h3 className="-mb-1 hidden text-center text-xl font-bold md:block">
          Users in room
        </h3>
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
