import Badge from '@/common/components/Badge/Badge';
import { useRoom, useSocket } from '@/common/context/storeContext';

const Message = ({ author, message }: MessageType) => {
  const socket = useSocket();
  const mine = socket.id === author.id;

  const room = useRoom();

  const color = room.colorsAssociated.get(author.id);

  return (
    <div className={`flex w-2/3 flex-col ${mine && 'self-end'}`}>
      <div className={`flex ${mine && 'justify-end'}`}>
        <Badge color={color || 'blue'}>{author.name}</Badge>
      </div>

      <div
        className={`mx-1 mt-1 flex ${
          mine ? 'flex-row-reverse' : 'flex-row'
        } items-start`}
      >
        <p className="px-1 font-bold text-zinc-500">14:13</p>
        <p className={`text-zinc-200 ${mine && 'text-right'}`}>{message}</p>
      </div>
    </div>
  );
};

export default Message;
