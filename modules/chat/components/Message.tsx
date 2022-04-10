import { RefObject, useMemo } from 'react';

import Badge from '@/common/components/Badge/Badge';
import { useRoom, useSocket } from '@/common/context/roomContext';
import { getTime } from '@/common/utils/functions';

interface Props extends MessageType {
  chatRef: RefObject<HTMLDivElement>;
}

const Message = ({ author, message, base64Url, chatRef }: Props) => {
  const socket = useSocket();
  const mine = socket.id === author.id;

  const room = useRoom();
  const color = room.colorsAssociated.get(author.id);

  const time = useMemo(() => getTime(), []);

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
        <p className="px-1 font-bold text-zinc-500">{time}</p>
        {message && (
          <p className={`text-zinc-200 ${mine && 'text-right'}`}>{message}</p>
        )}

        {base64Url && (
          <img
            src={base64Url}
            alt={`${author.name} image`}
            className="w-3/4"
            ref={(img) =>
              img?.addEventListener('load', () => {
                const node = chatRef.current;
                if (node) node.scrollTo({ top: node.scrollHeight });
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default Message;
