import { IpcRendererEvent } from "electron";
import { PathLike, PathOrFileDescriptor, WriteFileOptions } from "fs";

declare global {
  interface Window {
    readonly setStore: (key: string, value: string) => null;
    readonly getStore: (key: string) => string;
    readonly ipcRendererOn: (
      channel: string,
      listener: (event: IpcRendererEvent, ...args: any[]) => void
    ) => this;
    readonly ipcRendererSend: (channel: string, ...args: any[]) => void;
    readonly writeFileSync: (data: object, options?: WriteFileOptions) => void;
    readonly readFileSync: () => Buffer;
    readonly existsSync: () => boolean;
  }
}
