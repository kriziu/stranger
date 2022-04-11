import { useState } from 'react';

import { useInterval } from 'react-use';

const Dots = () => {
  const [dots, setDots] = useState(0);

  useInterval(() => {
    setDots((prev) => (prev === 3 ? 0 : prev + 1));
  }, 750);

  return <>{'.'.repeat(dots)}</>;
};

export default Dots;
