import { createContext, useContext, useEffect, useState } from 'react';

import { useMap } from 'react-use';
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

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peers, peersHandler] = useMap<Record<string, Peer.Instance>>();
  const [streams, streamsHandler] = useMap<Record<string, MediaStream>>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((newStream) => setStream(newStream))
      .catch(() => {});
  }, []);

  useRoomChange(() => {
    Object.values(peers).forEach((peer) => peer.destroy());
    peersHandler.reset();
    streamsHandler.reset();
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setupPeer = (userId: string) => {
    if (!stream) return;

    console.log('setup ', userId);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peersHandler.set(userId, peer);

    peer.on('error', (err) => {
      if (err.message === 'Connection failed.') {
        socket.emit('reconnect', userId);
        console.log('failed');
        peersHandler.remove(userId);
        streamsHandler.remove(userId);

        setupPeer(userId);
      }
    });

    peer.on('stream', (streamReceived) => {
      streamsHandler.set(userId, streamReceived);
    });

    let sent = false;
    peer.on('signal', (signal) => {
      if (sent) return;
      sent = true;

      socket.emit('signal_received', signal, userId);
    });
  };

  useEffect(() => {
    room.users.forEach((user) => {
      if (user.id !== socket.id && !Object.keys(peers).includes(user.id))
        setupPeer(user.id);
    });
  }, [peers, room.users, setupPeer, socket.id]);

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

    socket.on('user_reconnecting', (userId) => {
      peers[userId]?.destroy();
      peersHandler.remove(userId);
      streamsHandler.remove(userId);

      setupPeer(userId);
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('user_signal');
      socket.off('disconnected', handleUserDisconnected);
      socket.off('user_reconnecting');
    };
  }, [socket, peersHandler, peers, streamsHandler, setupPeer]);

  return (
    <peersContext.Provider value={{ peers, streams }}>
      {children}
    </peersContext.Provider>
  );
};

export default PeersProvider;
