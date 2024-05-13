const { ipcRenderer } = require('electron');

window.isElectron = true;
window.$bridge = {
  ipcRenderer,
};
ipcRenderer.on('ELECTRON_TO_IFRAME', (event, data) => {
  console.log('send event from electron to iframe', data);
});
