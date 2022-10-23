const { app, ipcMain, BrowserWindow } = require("electron");

const windows = {};

const createWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadFile("index.html");
  mainWindow.setAlwaysOnTop(true, "floating");
  windows[mainWindow.id] = mainWindow;
};

ipcMain.on("full-browser", ({ sender }) => {
  const id = sender.getOwnerBrowserWindow().id;
  if (windows[id].isMaximized()) windows[id].restore();
  else windows[id].maximize();
});
ipcMain.on("close-browser", ({ sender }) => {
  const id = sender.getOwnerBrowserWindow().id;
  windows[id].close();
  delete windows[id];
});

ipcMain.on("open-browser", createWindow);

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
