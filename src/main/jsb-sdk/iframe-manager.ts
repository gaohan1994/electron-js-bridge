import path from 'path';
import logger from 'electron-log';
import { IpcMainEvent, BrowserWindow, ipcMain } from 'electron';
import { IPC_CHANNELS, JSB_EVENTS } from '../constants';

interface CrateIframePayload {
  url: string;
}

class IframeManager {
  private winIframe: BrowserWindow | undefined = undefined;

  public readonly start = () => {
    ipcMain.on(IPC_CHANNELS.CREATE_IFRAME_WINDOW, this.createIframe);
    ipcMain.handle(JSB_EVENTS.IFRAME_TO_ELECTRON, this.iframeEventHandler);
    ipcMain.handle('', (event) => {
      const { processId, frameId } = event;
      event.sender.sendToFrame(
        [processId, frameId],
        'MainProceeToWebview',
        'helloWebview',
      );
    });
  };

  public readonly createIframe = (
    event: IpcMainEvent,
    params: CrateIframePayload,
  ) => {
    logger.log(`Receive IPC_CHANNELS.CREATE_IFRAME_WINDOW event`, params);

    const { url } = params;

    if (!this.winIframe) {
      this.winIframe = new BrowserWindow({
        webPreferences: {
          webviewTag: true,
          nodeIntegration: true,
          contextIsolation: false,
          nodeIntegrationInSubFrames: true,
          // 对应的文件在 public/repload.js
          preload: path.join(__dirname, 'iframe-preload.js'),
        },
      });
      this.winIframe.loadURL(url);
      this.winIframe.addListener('close', () => {
        this.winIframe = undefined;
      });
    } else {
      this.winIframe.loadURL(url);
    }
  };

  private readonly iframeEventHandler = async (_: any, data: unknown) => {
    logger.log(`Receive event from iframe to electorn`, data);
    return { code: 1000 };
  };
}

export default IframeManager;
