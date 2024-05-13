const { ipcRenderer, contextBridge, webFrame } = require('electron');

window.isElectron = true;

const parseQuery = (search) => {
  const params = new URLSearchParams(search);
  const result = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

const frameId = webFrame.routingId;
// 从url里取出页面的业务类型（或者任意其他方式）
const { subBusinessType } = parseQuery(location.search);
const channelName = `ipc-webview-${subBusinessType ?? 'BASE'}-${frameId}`;

let registerIpcPromiseReslover = () => {};
const registerIpcPromise = new Promise((resolve) => {
  registerIpcPromiseReslover = resolve;
});
ipcRenderer
  .invoke('WEBVIEW_REGISTER', subBusinessType)
  .then(() => {
    return registerIpcPromiseReslover();
  })
  .catch((error) => {
    console.log('error', error);
  });

const eventCbMap = {};
ipcRenderer.on(channelName, (event, eventName, ...params) => {
  eventCbMap[eventName]?.forEach((cb) => {
    cb(...params);
  });
});

contextBridge.exposeInMainWorld('ipcApi', {
  invoke: async (cmd, ...params) => {
    await registerIpcPromise;
    console.log('call ipcApi invoke ', cmd);
    const result = await ipcRenderer.invoke(channelName, cmd, ...params);
    return result;
  },
  send: async (cmd, ...params) => {
    await registerIpcPromise;
    console.log('call ipcApi send ', cmd);
    ipcRenderer.send(channelName, cmd, ...params);
  },
  on: (eventName, cb) => {
    console.log(`Webview 注册监听 ${eventName}`);
    if (!eventCbMap[eventName]) {
      eventCbMap[eventName] = [];
    }
    eventCbMap[eventName].push(cb);
    return () => {
      eventCbMap[eventName] = eventCbMap[eventName].filter(
        (callback) => callback !== cb,
      );
      console.log(`Webview 移除监听 ${eventName}`);
    };
  },
});
