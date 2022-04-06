import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { useInterval, useList, useMap } from 'react-use';
import Peer from 'simple-peer';

import {
  useRoom,
  useRoomChange,
  useSocket,
} from '@/common/context/roomContext';

export const peersContext = createContext<{
  peers: Record<string, Peer.Instance>;
  streams: Record<string, MediaStream>;
}>({ peers: {}, streams: {} });

export const usePeers = () => {
  const { peers } = useContext(peersContext);

  return peers;
};

export const useStreams = () => {
  const { streams } = useContext(peersContext);

  return streams;
};

const PeersProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const socket = useSocket();
  const room = useRoom();

  const [usersCalled, usersCalledHandler] = useList<string>();
  const [peers, peersHandler] = useMap<Record<string, Peer.Instance>>();
  const [streams, streamsHandler] = useMap<Record<string, MediaStream>>();

  const lastUsersLength = useRef(0);

  useRoomChange(() => {
    Object.values(peers).forEach((peer) => peer.destroy());
    peersHandler.reset();
    streamsHandler.reset();
  });

  console.log(peers);

  const setupPeer = useCallback(
    (peer: Peer.Instance, userId: string) => {
      console.log('setup ', userId);
      peersHandler.set(userId, peer);

      peer.on('stream', (stream) => {
        streamsHandler.set(userId, stream);
      });

      peer.on('error', (err) => {
        console.log(err, 'err, destroying');
        console.log(peers[userId]);
      });

      peer.on('close', () => {
        console.log('close');
        console.log(peers[userId]);
      });

      let sent = false;
      peer.on('signal', (signal) => {
        console.log('signal to', userId);
        if (sent) return;
        sent = true;

        socket.emit('signal_received', signal, userId);
      });
    },
    [peers, peersHandler, socket, streamsHandler]
  );

  useEffect(() => {
    room.users.forEach((user) => {
      if (user.id === socket.id || usersCalled.includes(user.id)) return;

      usersCalledHandler.push(user.id);

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });

          setupPeer(peer, user.id);
        });
    });

    // eslint-disable-next-line consistent-return
    return () => {
      lastUsersLength.current = room.users.length;
    };
  }, [
    peersHandler,
    room.users,
    setupPeer,
    socket.id,
    usersCalled,
    usersCalledHandler,
  ]);

  useEffect(() => {
    socket.on('user_signal', (userId, signalReceived) => {
      peersHandler.get(userId)?.signal(signalReceived);
    });

    const handleUserDisconnected = (user: UserType) => {
      peers[user.id]?.destroy();
      peersHandler.remove(user.id);
      streamsHandler.remove(user.id);
    };
    socket.on('disconnected', handleUserDisconnected);

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('user_signal');
      socket.off('disconnected', handleUserDisconnected);
    };
  }, [socket, peersHandler, peers, streamsHandler]);

  return (
    <peersContext.Provider value={{ peers, streams }}>
      {children}
    </peersContext.Provider>
  );
};

export default PeersProvider;
