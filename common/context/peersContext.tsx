import { createContext, useContext, useEffect, useState } from 'react';

import { useMap } from 'react-use';
import Peer from 'simple-peer';

import { useRoom, useSocket } from '@/common/context/storeContext';

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

  const [currentRoomId, setCurrentRoomId] = useState('');

  const [peers, peersHandler] = useMap<Record<string, Peer.Instance>>();
  const [streams, streamsHandler] = useMap<Record<string, MediaStream>>();

  useEffect(() => {
    if (currentRoomId !== room.id) {
      Object.values(peers).forEach((peer) => peer.destroy());
      peersHandler.reset();
      streamsHandler.reset();
      setCurrentRoomId(room.id);
      return;
    }

    room.users.forEach((user) => {
      if (user.id === socket.id || peersHandler.get(user.id)) return;

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });

          peersHandler.set(user.id, peer);
        });
    });
  }, [currentRoomId, peers, peersHandler, room, socket.id, streamsHandler]);

  useEffect(() => {
    socket.on('user_signal', (userId, signalReceived) => {
      peersHandler.get(userId)?.signal(signalReceived);
    });

    const handleUserDisconnected = (user: UserType) => {
      peersHandler.get(user.id)?.destroy();
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

  useEffect(() => {
    if (!Object.keys(peers).length) return;

    Object.keys(peers).forEach((userId) => {
      peersHandler.get(userId).on('stream', (stream) => {
        streamsHandler.set(userId, stream);
      });

      let sent = false;
      peersHandler.get(userId).on('signal', (signal) => {
        if (sent) return;
        sent = true;

        socket.emit('signal_received', signal, userId);
      });
    });

    // eslint-disable-next-line consistent-return
    return () => {
      Object.values(peers).forEach((peer) => {
        peer.removeAllListeners('stream');
        peer.removeAllListeners('signal');
      });
    };
  }, [peers, peersHandler, socket, streamsHandler]);

  return (
    <peersContext.Provider value={{ peers, streams }}>
      {children}
    </peersContext.Provider>
  );
};

export default PeersProvider;
