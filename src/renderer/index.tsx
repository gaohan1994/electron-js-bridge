import { createRoot } from 'react-dom/client';
import App from './App';
import { IPC_CHANNELS } from '../main/constants';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once(IPC_CHANNELS.IPC_EXAMPLE, (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage(IPC_CHANNELS.IPC_EXAMPLE, ['ping']);
