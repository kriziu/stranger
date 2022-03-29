import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
  createContext,
} from 'react';

import { useRouter } from 'next/router';
import io, { Socket } from 'socket.io-client';

interface ContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  room: RoomType;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}

export const storeContext = createContext<ContextType>({} as ContextType);

export const useSocket = () => {
  const { socket } = useContext(storeContext);

  return socket;
};

export const useRoom = () => {
  const { room } = useContext(storeContext);

  return room;
};

export const useName = (): {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
} => {
  const { name, setName } = useContext(storeContext);

  return { name, setName };
};

const defaultRoom: RoomType = {
  type: 'private',
  users: [],
  id: '',
  colorsAssociated: new Map(),
};

const colors = ['red.400', 'blue.400'];

const StoreProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [socket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io);
  const [room, setRoom] = useState<RoomType>(defaultRoom);
  const [name, setName] = useState('');

  const router = useRouter();

  useEffect(() => {
    socket.on('join_room', (newRoom) => {
      setRoom(newRoom);
      router.push(`/${newRoom.id}`);
    });

    socket.on('new_connection', (user) =>
      setRoom((prev) => ({ ...prev, users: [...prev.users, user] }))
    );

    socket.on('disconnected', (user) =>
      setRoom((prev) => ({
        ...prev,
        users: prev.users.filter((arrUser) => arrUser.id !== user.id),
      }))
    );

    return () => {
      socket.off('join_room');
      socket.off('new_connection');
      socket.off('disconnected');
    };
  }, [room.id, router, socket]);

  useEffect(() => {
    let i = 0;
    const colorsAssociated = new Map<string, string>();

    room.users.forEach((user) => {
      if (i === colors.length) i = 0;

      const temp = i % 2 === 0 ? colors.length - i : i;

      colorsAssociated.set(user.id, colors[temp] || '');

      i += 1;
    });

    setRoom((prev) => ({ ...prev, colorsAssociated }));
  }, [room.users]);

  useEffect(() => {
    const handleRouteChange = (route: string) => {
      const roomIdURL = route.slice(1, route.length);

      if (roomIdURL !== room.id) {
        socket.emit('leave_room');
        setRoom(defaultRoom);
        router.replace('/');
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [room.id, router, socket]);

  return (
    <storeContext.Provider value={{ socket, room, name, setName }}>
      {children}
    </storeContext.Provider>
  );
};

export default StoreProvider;
