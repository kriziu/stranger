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
  connectedAll: boolean;
}>({ peers: {}, streams: {}, connectedAll: false });

export const usePeers = () => {
  const { peers } = useContext(peersContext);

  return peers;
};

export const useStreams = () => {
  const { streams } = useContext(peersContext);

  return streams;
};

export const useCheckConnectedAll = () => {
  const { connectedAll } = useContext(peersContext);

  return connectedAll;
};

const PeersProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const socket = useSocket();
  const room = useRoom();

  const [peers, peersHandler] = useMap<Record<string, Peer.Instance>>();
  const [streams, streamsHandler] = useMap<Record<string, MediaStream>>();

  const [peersConnected, setPeersConnected] = useState(0);
  const [connectedAll, setConnectedAll] = useState(false);

  useRoomChange(() => {
    Object.values(peers).forEach((peer) => peer.destroy());
    peersHandler.reset();
    streamsHandler.reset();
    setConnectedAll(false);
    setPeersConnected(0);
  });

  useEffect(() => {
    if (connectedAll || Object.keys(peers).length === 0) return;

    console.log(peersConnected);

    if (peersConnected === Object.keys(peers).length) {
      console.log('siuuu');
      setConnectedAll(true);
    }
  }, [connectedAll, peers, peersConnected]);

  useEffect(() => {
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
  }, [peers, peersHandler, room, socket.id, streamsHandler]);

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
        setPeersConnected((prev) => prev + 1);
        streamsHandler.set(userId, stream);
      });

      peersHandler.get(userId).on('error', (err) => {
        console.log(err, 'err');
      });

      let sent = false;
      peersHandler.get(userId).on('signal', (signal) => {
        console.log('signal to send');
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
    <peersContext.Provider value={{ peers, streams, connectedAll }}>
      {children}
    </peersContext.Provider>
  );
};

export default PeersProvider;
