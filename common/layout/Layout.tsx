/* eslint-disable @next/next/no-title-in-document-head */
import { useEffect } from 'react';

import Head from 'next/head';

import StoreProvider from '../context/storeContext';

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
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

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return (
    <StoreProvider>
      <Head>
        <title>Stranger</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-full w-full flex-col items-center">
        <h1 className="mt-3 hidden w-max self-center bg-gradient-to-r from-white to-transparent bg-clip-text text-4xl font-bold uppercase text-transparent sm:block md:text-6xl lg:text-extra">
          stranger
        </h1>
        {children}
      </div>
    </StoreProvider>
  );
};

export default Layout;
