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
// 0. !!!! usunac movablevideos przy zmianie pokoju
// 1. Co pare sekund sprawdz czy streamy nie są "muted".
// 2. Mozna "wejsc" do randomowego id pokoju
// 3. ! cos nie przypina kamerki od innych na telefonie (poprawic wyglad na telefonie bo sa za male i za bardzo zaokraglone)
// 6. poprawic czat zeby byl ciagle widoczny na kompach przynajmniej
// 7. Jakis szum przy przypitej kamerze
// 8. poczekac az sie polaczysz do pokoju
