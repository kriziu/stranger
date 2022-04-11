import { createPortal } from 'react-dom';

const Portal = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const portalElement = document.getElementById('portal');

  return portalElement ? createPortal(children, portalElement) : null;
};

export default Portal;
