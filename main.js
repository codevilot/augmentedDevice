const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
    },
  });
  mainWindow.loadFile("index.html");
  mainWindow.setAlwaysOnTop(true, "floating");
};
ipcMain.on("open-browser", () => {
  createWindow();
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
