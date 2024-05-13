import { Fragment, useRef } from 'react';

function JSBWebview() {
  const containerref = useRef(null);

  return (
    <>
      <h2>webview demo</h2>
      <webview
        src="http://localhost:3000?subBusinessType=BASE"
        ref={containerref}
      />
      <p>main should send event to webview after loaded 5s.</p>
    </>
  );
}

export default JSBWebview;
