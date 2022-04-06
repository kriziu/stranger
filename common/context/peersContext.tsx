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

  console.log('peers', peers);

  useRoomChange(() => {
    Object.values(peers).forEach((peer) => peer.destroy());
    peersHandler.reset();
    streamsHandler.reset();
  });

  const setupPeer = useCallback(
    (peer: Peer.Instance, userId: string) => {
      console.log('setup');
      peersHandler.set(userId, peer);

      peer.on('stream', (stream) => {
        console.log('streaming ', userId);
        streamsHandler.set(userId, stream);
      });

      peer.on('error', (err) => {
        console.log(err, 'err');
      });

      let sent = false;
      peer.on('signal', (signal) => {
        if (sent) return;
        sent = true;

        socket.emit('signal_received', signal, userId);
      });
    },
    [peersHandler, socket, streamsHandler]
  );

  useInterval(() => {
    Object.keys(peers).forEach((userId) => {
      if (!peers[userId].connected) {
        peers[userId].destroy();
        peersHandler.remove(userId);
        streamsHandler.remove(userId);

        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            const peer = new Peer({
              initiator: true,
              trickle: false,
              stream,
            });

            setupPeer(peer, userId);
          });
      }
    });
  }, 5000);

  useEffect(() => {
    console.log('triggered');

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
