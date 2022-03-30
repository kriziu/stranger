import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useList } from 'react-use';

import { useSocket } from '@/common/context/storeContext';

let typed = false;

const MessageInput = () => {
  const socket = useSocket();

  const [message, setMessage] = useState('');
  const [usersTyping, usersTypingHandlers] = useList<UserType>();

  useEffect(() => {
    socket.on('user_start_type', (user) => {
      usersTypingHandlers.push(user);
    });

    socket.on('user_stop_type', (user) => {
      const index = usersTyping.findIndex((userArr) => userArr.id === user.id);

      if (index !== -1) {
        usersTypingHandlers.removeAt(index);
      }
    });

    return () => {
      socket.off('user_start_type');
      socket.off('user_stop_type');
    };
  }, [socket, usersTyping, usersTypingHandlers]);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message || /^\s*$/.test(message)) return;

    socket.emit('send_msg', message);
    setMessage('');
    socket.emit('stop_type');
    typed = false;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (e.target.value && !typed) {
      socket.emit('start_type');
      typed = true;
    } else if (!e.target.value) {
      socket.emit('stop_type');
      typed = false;
    }
  };

  const handleInputFocus = () => {
    if (message && !typed) {
      socket.emit('start_type');
      typed = true;
    }
  };

  const handleInputBlur = () => {
    socket.emit('stop_type');
    typed = false;
  };

  const renderUsersTyping = () => {
    if (!usersTyping.length) return '';

    return `${usersTyping.map((user) => user.name).join(', ')} ${
      usersTyping.length > 1 ? ' are' : ' is'
    } typing...`;
  };

  return (
    <div className="absolute bottom-0 w-full px-5">
      <span className="ml-3 text-zinc-500">{renderUsersTyping()}</span>

      <form className="flex w-full" onSubmit={handleSendMessage}>
        <input
          placeholder="Type message..."
          className="input flex-1 text-base"
          value={message}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <button className="btn btn-primary ml-5 px-5 text-base" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
