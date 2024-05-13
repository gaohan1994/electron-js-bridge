import { useState } from 'react';
import { IPC_CHANNELS } from '../../main/constants';

const BrowserWindowDemo = () => {
  const [url, setUrl] = useState('http://localhost:3000/');

  const openIframe = () => {
    window.electron.ipcRenderer.sendMessage(IPC_CHANNELS.CREATE_IFRAME_WINDOW, {
      url,
    });
  };

  return (
    <div>
      <h2>browser demo</h2>
      <input value={url} onChange={(event) => setUrl(event.target.value)} />
      <button onClick={openIframe}>open new browser window </button>
    </div>
  );
};

export default BrowserWindowDemo;
