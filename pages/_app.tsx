import '../common/styles/global.css';
import type { AppProps } from 'next/app';

import Layout from '@/common/layout/Layout';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;

// TODO:
// 1. regiony, wysylac zdjecie, jak sie klika na telefonie to przypadkiem klika sie przycisk "ukryty"
