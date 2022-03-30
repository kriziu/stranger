import RoomChat from './RoomChat';
import RoomInfo from './RoomInfo';
import RoomUsers from './RoomUsers';
import RoomUtilities from './RoomUtilities';

const Room = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <RoomInfo />
      <div className="mt-16 flex w-full grow flex-row">
        <div className="basis-1/4">
          <RoomUsers />
        </div>
        <div className="basis-1/2">
          <RoomChat />
        </div>
        <div className="basis-1/4">
          <RoomUtilities />
        </div>
      </div>
    </div>
  );
};

export default Room;
