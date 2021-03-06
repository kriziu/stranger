import { useEffect, useRef } from 'react';

import { useList } from 'react-use';

import { useSocket } from '@/common/context/roomContext';

import Message from './Message';
import MessageInput from './MessageInput';

const Chat = () => {
  const socket = useSocket();

  const [messages, messagesHandler] = useList<MessageType>();

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = chatRef.current;

    const handleNewMsg = (msg: MessageType) => {
      messagesHandler.push(msg);
      if (node) {
        node.scrollTo({ top: node.scrollHeight });
      }
    };

    socket.on('new_msg', handleNewMsg);
    socket.on('new_img', handleNewMsg);

    return () => {
      socket.off('new_msg');
      socket.off('new_img');
    };
  }, [messagesHandler, socket]);

  return (
    <div className={`flex h-full flex-1 justify-between`}>
      <div className="relative flex h-full w-full flex-col">
        <div
          className="h-msgs overflow-overlay absolute top-0 flex w-full flex-col space-y-4 p-5 pb-0"
          ref={chatRef}
        >
          <div className="self-center font-bold text-zinc-600 ">
            Chat beginning
          </div>
          {messages.map((message) => (
            <Message key={message.id} {...message} chatRef={chatRef} />
          ))}
        </div>
        <MessageInput />
      </div>
    </div>
  );
};

export default Chat;
