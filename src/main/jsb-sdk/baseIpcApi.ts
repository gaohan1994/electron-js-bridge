import { app } from 'electron';
import logger from 'electron-log';
import { SUB_BUSINESS_TYPE } from './constants';
import EventEmitter from './emitter';

interface IpcWebviewCtx {
  type: any;
  processId: number;
  frameId: number;
}

export interface IpcApiHelper {
  type: string;
  handlers: any;
}

class BaseIpcApi extends EventEmitter {
  type = SUB_BUSINESS_TYPE.BASE;

  public handlers = {
    log(ctx: IpcWebviewCtx, ...info: any[]) {
      logger.log(`[${ctx.type}]`, ...info);
    },

    getAppInfo(ctx: IpcWebviewCtx) {
      logger.log(`[${ctx.type}] getAppInfo called`);
      const appInfo = {
        version: app.getVersion(),
        name: app.getName(),
        locale: app.getLocale(),
        countryCode: app.getLocaleCountryCode(),
      };
      logger.log(
        `[${ctx.type}] getAppInfo executed, result: ${JSON.stringify(appInfo)}`,
      );
      return appInfo;
    },
  };
}

export default BaseIpcApi;
