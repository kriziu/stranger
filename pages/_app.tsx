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
// 0. sprawdzic czy wyslalo sie sygnal i odebralo do kazdego z pokoju potem dolacza do niego
// 1. regiony, wysylac zdjecie, jak sie klika na telefonie to przypadkiem klika sie przycisk "ukryty"
//  2. pokoj "1 na 1"
