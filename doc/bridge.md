
# JSB


# electron 和 iframe 通信
参考资料
https://juejin.cn/post/7081895571887243295

- Electron 配置 preload.js ，在 preload.js 配置可供 iframe 调用的方法。
- iframe 里按需调用，ipcMain 接受事件，并转发给 ipcRenderer
- ipcRenderer 收到消息，通过 postMessage 发送给 iframe
- iframe 收到回调消息，处理数据


# electron 和 webview 通信

javascript bridge

Electron 和 webview 标准化通信的 bridge

## 技术方案

主进程在打开 webview 时，注入 bridge 代码，webview 内调用 bridge api 时，主进程收到调用信息进行处理

调用 sdk.getDeviceInfo()

bridge
封装通信数据包，创建一个序列化的通信池，将池子中的通信消息传递给 electron
electron 处理之后，返回结果给 bridge
bridge 收到 electron 的结果之后再返回给 webview

