import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

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

  const [peers, peersHandler] = useMap<Record<string, Peer.Instance>>();
  const [streams, streamsHandler] = useMap<Record<string, MediaStream>>();

  const lastUsersLength = useRef(0);

  useRoomChange(() => {
    Object.values(peers).forEach((peer) => peer.destroy());
    peersHandler.reset();
    streamsHandler.reset();
  });

  const setupPeer = useCallback(
    (peer: Peer.Instance, user: UserType) => {
      console.log('setup');
      peersHandler.set(user.id, peer);

      peer.on('stream', (stream) => {
        streamsHandler.set(user.id, stream);
      });

      peer.on('error', (err) => {
        console.log(err, 'err');
      });

      let sent = false;
      peer.on('signal', (signal) => {
        if (sent) return;
        sent = true;

        console.log('signal to send');
        console.log('my ', socket.id);
        console.log('to ', user.id);
        console.log(signal);

        socket.emit('signal_received', signal, user.id);
      });
    },
    [peersHandler, socket, streamsHandler]
  );

  useEffect(() => {
    if (lastUsersLength.current === room.users.length) return;

    console.log('triggered');

    console.log(room.users);

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

          console.log(user);

          setupPeer(peer, user);
        });
    });

    // eslint-disable-next-line consistent-return
    return () => {
      lastUsersLength.current = room.users.length;
    };
  }, [peersHandler, room.users, setupPeer, socket.id]);

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

  return (
    <peersContext.Provider value={{ peers, streams }}>
      {children}
    </peersContext.Provider>
  );
};

export default PeersProvider;
