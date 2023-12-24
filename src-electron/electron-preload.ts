/* eslint-disable @typescript-eslint/no-explicit-any */
import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel: string, ...args: unknown[]) => {
    ipcRenderer.send(channel, ...args);
  },

  receive: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on(channel, listener),

  invoke(channel: string, ...args: any[]): Promise<any> {
    return ipcRenderer.invoke(channel, ...args);
  },
});
