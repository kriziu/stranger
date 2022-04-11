import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
  createContext,
} from 'react';

import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useBoolean } from 'react-use';
import io, { Socket } from 'socket.io-client';

import { colors } from '../utils/colors';
import { shuffleArray } from '../utils/functions';

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

export const useRoomChange = (callback: () => void) => {
  const room = useRoom();

  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    if (roomId !== room.id) {
      setRoomId(room.id);
      callback();
    }
  }, [room.id, roomId, callback]);
};

const colorNames = shuffleArray([...colors.keys()]);

const defaultRoom: RoomType = {
  type: 'private',
  users: [],
  id: '',
  colorsAssociated: new Map(),
};

const StoreProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [socket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io);
  const [room, setRoom] = useState<RoomType>(defaultRoom);
  const [name, setName] = useState('');
  const [isJoining, setIsJoining] = useBoolean(false);

  const router = useRouter();

  useEffect(() => {
    socket.on('join_room', (newRoom) => {
      setRoom(newRoom);
      router.push(`/${newRoom.id}`);
    });

    socket.on('new_connection', (user) => {
      setRoom((prev) => ({ ...prev, users: [...prev.users, user] }));
      if (user.id !== socket.id)
        toast(`${user.name} has joined the room`, { theme: 'dark' });
    });

    socket.on('send_check', (roomId) => {
      setIsJoining(true);
      router.push(`/${roomId}`);
    });

    socket.on('room_not_found', (roomId) => {
      toast.error(`Room with id ${roomId} not found`, { theme: 'dark' });
    });

    socket.on('room_max_users', (roomId) => {
      toast.warn(`Room with id ${roomId} has max users connected to it`, {
        theme: 'dark',
      });
    });

    const handleUserDisconnected = (user: UserType) => {
      setRoom((prev) => ({
        ...prev,
        users: prev.users.filter((arrUser) => arrUser.id !== user.id),
      }));
      if (user.id !== socket.id)
        toast(`${user.name} has left the room`, { theme: 'dark' });
    };
    socket.on('disconnected', handleUserDisconnected);

    return () => {
      socket.off('join_room');
      socket.off('new_connection');
      socket.off('send_check');
      socket.off('room_not_found');
      socket.off('room_max_users');
      socket.off('disconnected', handleUserDisconnected);
    };
  }, [room.id, router, setIsJoining, socket]);

  useEffect(() => {
    let i = 0;
    const colorsAssociated = new Map<string, ColorType>();

    room.users.forEach((user) => {
      if (i === colorNames.length) i = 0;

      const temp = i % 2 === 0 ? colorNames.length - i - 1 : i;

      colorsAssociated.set(user.id, colorNames[temp]);

      i += 1;
    });

    setRoom((prev) => ({ ...prev, colorsAssociated }));
  }, [room.users, room.id]);

  useEffect(() => {
    const handleRouteChange = (route: string) => {
      const roomIdURL = route.slice(1, route.length);

      if (roomIdURL !== room.id && !isJoining) {
        socket.emit('leave_room');
        setRoom(defaultRoom);
        router.replace('/');

        if (roomIdURL) {
          socket.emit('check_room', roomIdURL);
        }
      }

      setIsJoining(false);
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [isJoining, room.id, router, setIsJoining, socket]);

  useEffect(() => {
    const roomIdURL = router.asPath.slice(1, router.asPath.length);

    if (roomIdURL) {
      socket.emit('check_room', roomIdURL);
      router.replace('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <storeContext.Provider value={{ socket, room, name, setName }}>
      {children}
    </storeContext.Provider>
  );
};

export default StoreProvider;
