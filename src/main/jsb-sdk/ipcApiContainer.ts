import BaseIpcApi, { IpcApiHelper } from './baseIpcApi';

class IpcApiContainer {
  public static instance: IpcApiContainer | undefined = undefined;

  public static getInstance = () => {
    if (!IpcApiContainer.instance) {
      IpcApiContainer.instance = new IpcApiContainer();
    }
    return IpcApiContainer.instance;
  };

  private apiHandlerMap;

  constructor() {
    this.apiHandlerMap = new Map();
    this.registeIpcApiHelper(new BaseIpcApi());
  }

  private registeIpcApiHelper = (helper: IpcApiHelper) => {
    this.apiHandlerMap.set(helper.type, helper);
  };

  public getApiHandlers = (type: string) => {
    return this.apiHandlerMap.get(type);
  };
}

export default IpcApiContainer.getInstance();
