import { contextBridge, ipcRenderer } from "electron";
import * as store from "electron-localstorage";
import * as path from "path";
import { writeFileSync, readFileSync, existsSync, WriteFileOptions } from "fs";

const BOOKMARKS_DIR = "./bookmarks.json";

contextBridge.exposeInMainWorld("ipcRendererOn", (channel: string, cb: any) => {
  ipcRenderer.on(channel, cb);
});
contextBridge.exposeInMainWorld(
  "ipcRendererSend",
  (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args)
);
contextBridge.exposeInMainWorld("setStore", (key: string, value: string) =>
  store.setItem(key, value)
);
contextBridge.exposeInMainWorld("getStore", (key: string) =>
  store.getItem(key)
);
contextBridge.exposeInMainWorld(
  "writeFileSync",
  (data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions) =>
    writeFileSync(
      path.join(__dirname, BOOKMARKS_DIR),
      JSON.stringify(data),
      options
    )
);
contextBridge.exposeInMainWorld("readFileSync", () =>
  JSON.parse(readFileSync(path.join(__dirname, BOOKMARKS_DIR), "utf8"))
);
contextBridge.exposeInMainWorld("existsSync", () =>
  existsSync(path.join(__dirname, BOOKMARKS_DIR))
);
