import path from 'path';
import logger from 'electron-log';
import { BrowserWindow, ipcMain } from 'electron';
import { IPC_WEBVIEW_EVENTS } from './constants';
import ipcApiContainer from './ipcApiContainer';

class IpcWebviewManager {
  mainWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;

    this.mainWindow.webContents.addListener(
      'will-attach-webview',
      (event, webPreferences) => {
        logger.log('Receive attach webview event, set correct preload path');
        webPreferences.preload = path.join(__dirname, 'preload.js');
      },
    );
    /**
     * 处理 webview 注册事件
     */
    ipcMain.handle(IPC_WEBVIEW_EVENTS.WEBVIEW_REGISTER, async (event, type) => {
      const { processId, frameId } = event;

      const channelName = `ipc-webview-${type}-${frameId}`;
      logger.log('收到 Webview 注册事件', type, channelName);

      const helper = ipcApiContainer.getApiHandlers(type);
      // 处理来自特定webview的invoke方法，添加上下文之后分配给对应的helper
      ipcMain.handle(channelName, async (_, eventName, ...paylaod) => {
        if (helper.handlers[eventName]) {
          const result = await helper.handlers[eventName](
            {
              type,
              processId,
              frameId,
            },
            ...paylaod,
          );
          return result;
        }

        return Promise.reject(
          new Error(`Could not found eventName: ${eventName}`),
        );
      });

      // 处理来自特定webview的send方法，添加上下文之后分配给对应的helper
      ipcMain.on(channelName, (_, eventName, ...paylaod) => {
        if (helper.handlers[eventName]) {
          helper.handlers[eventName](
            {
              type,
              processId,
              frameId,
            },
            ...paylaod,
          );
        } else {
          logger.log(`Could not found eventName: ${eventName}`);
        }
      });

      const emitterName = `${processId}-${frameId}`;
      helper.on(emitterName, (eventName: string, ...params: any[]) => {
        event.sender.sendToFrame(
          [processId, frameId],
          channelName,
          eventName,
          ...params,
        );
      });

      const timer = setTimeout(() => {
        helper.emit(emitterName, 'Greeting', `主进程发给webview`);
        clearTimeout(timer);
        return undefined;
      }, 5000);

      return Promise.resolve(true);
    });
  }
}

export default IpcWebviewManager;
