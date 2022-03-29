/* eslint-disable @next/next/no-title-in-document-head */
import Head from 'next/head';

import StoreProvider from '../context/storeContext';

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <StoreProvider>
      <Head>
        <title>Stranger</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-full w-full flex-col items-center bg-zinc-900 text-white">
        <h1 className="mt-3 w-max self-center bg-gradient-to-r from-white to-transparent bg-clip-text text-5xl font-bold uppercase text-transparent sm:text-extra">
          stranger
        </h1>
        {children}
      </div>
    </StoreProvider>
  );
};

export default Layout;
