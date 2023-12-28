/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    QUASAR_PUBLIC_FOLDER: string;
    QUASAR_ELECTRON_PRELOAD: string;
    APP_URL: string;
  }
}

export interface IElectronAPI {
  receive(arg0: string, arg1: (event: any, data: any) => void): unknown;
  loadPreferences: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
