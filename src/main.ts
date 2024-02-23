const { app, ipcMain, BrowserWindow } = require("electron");
const path = require("path");

interface Sender extends Electron.WebContents {
  getOwnerBrowserWindow(): Electron.BrowserWindow | null;
}
const windows = {};

const createWindow = (url = "https://google.com") => {
  let mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    transparent: true,
    frame: false,
    icon: __dirname + "./logo.ico",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile(__dirname + "./index.html");
  mainWindow.setAlwaysOnTop(true, "floating");
  windows[mainWindow.id] = mainWindow;
};

ipcMain.on("full-browser", ({ sender }) => {
  const id = (sender as Sender).getOwnerBrowserWindow().id;
  if (windows[id].isMaximized()) windows[id].unmaximize();
  else windows[id].maximize();
});
ipcMain.on("close-browser", ({ sender }) => {
  const id = (sender as Sender).getOwnerBrowserWindow().id;
  windows[id].close();
  delete windows[id];
});
ipcMain.on("rerender", () => {
  const windowKeys = Object.keys(windows);
  windowKeys.forEach((id) => windows[id].webContents.send("rerender"));
});

ipcMain.on("open-browser", (_, url) => createWindow(url));

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
