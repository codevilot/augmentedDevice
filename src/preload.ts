import { contextBridge, ipcRenderer } from "electron";
import * as store from "electron-localstorage";
import { favorites } from "./utils/favorites";
contextBridge.exposeInMainWorld("ipcRendererOn", (channel: string, cb: any) => {
  ipcRenderer.on(channel, cb);
});
contextBridge.exposeInMainWorld(
  "ipcRendererSend",
  (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  }
);
contextBridge.exposeInMainWorld("setStore", (key: string, value: string) =>
  store.setItem(key, value)
);
contextBridge.exposeInMainWorld("getStore", (key: string) =>
  store.getItem(key)
);
contextBridge.exposeInMainWorld("favorites", () => favorites());
