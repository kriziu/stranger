/* eslint-disable @next/next/no-title-in-document-head */
import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PeersProvider from '../context/peersContext';
import StoreProvider from '../context/roomContext';
import StreamsProvider from '../context/streamContext';

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const [blocked, setBlocked] = useState(true);

  useEffect(() => {
    const handleScroll = (e: any) => {
      if (!e.target.classList?.contains('on-scrollbar')) {
        e.target.classList?.add('on-scrollbar');

        setTimeout(() => {
          e.target.classList?.remove('on-scrollbar');
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleScroll, true);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(() => setBlocked(false))
      .catch(() => {
        setBlocked(true);
      });

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  if (blocked)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="transition-none"
      >
        <h1 className="mt-24 px-5 text-center text-xl font-bold">
          You need to allow access for media devices (microphone, camera) to use
          this application (Don&apos;t worry, these devices will be used at your
          request).
        </h1>
      </motion.div>
    );

  return (
    <StoreProvider>
      <PeersProvider>
        <StreamsProvider>
          <Head>
            <title>Stranger</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <ToastContainer />

          <motion.div
            className="flex h-full w-full flex-col items-center transition-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <>
              <h1 className="mt-3 hidden w-max self-center bg-gradient-to-r from-white to-transparent bg-clip-text text-3xl font-bold uppercase text-transparent sm:block md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-extra">
                stranger
              </h1>
              {children}
            </>
          </motion.div>
        </StreamsProvider>
      </PeersProvider>
    </StoreProvider>
  );
};

export default Layout;
