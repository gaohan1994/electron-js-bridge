import { Fragment, useRef } from 'react';

const JSBIframe = () => {
  const containerref = useRef(null);

  const debug = () => {
    containerref.current.postMessage('hello');
  };

  return (
    <Fragment>
      <h2>iframe demo</h2>
      <iframe src="http://localhost:3000" ref={containerref} />
      <button onClick={debug}>test</button>
    </Fragment>
  );
};

export default JSBIframe;
