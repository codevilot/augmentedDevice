const { app, ipcMain, BrowserWindow } = require("electron");

const windows = {};

const createWindow = (url = "https://google.com") => {
  let mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    transparent: true,
    frame: false,
    icon: __dirname + "/assets/logo.ico",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      enableRemoteModule: true,
      nativeWindowOpen: true,
    },
  });
  mainWindow.loadFile("./src/index.html");
  mainWindow.setAlwaysOnTop(true, "floating");
  mainWindow.send("src", url);
  windows[mainWindow.id] = mainWindow;
};

ipcMain.on("full-browser", ({ sender }) => {
  const id = sender.getOwnerBrowserWindow().id;
  if (windows[id].isMaximized()) windows[id].unmaximize();
  else windows[id].maximize();
});
ipcMain.on("close-browser", ({ sender }) => {
  const id = sender.getOwnerBrowserWindow().id;
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
