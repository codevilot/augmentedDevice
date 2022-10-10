const { app, BrowserWindow, ipcMain } = require("electron");
const storage = require("electron-localStorage");

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

  ipcMain.on("close-main", () => {
    mainWindow.close();
  });
  ipcMain.on("open-browser", () => {
    createBrowserWindow();
  });
  ipcMain.on("open-add-browser", (_, address) => {
    createBrowserWindow(address);
  });
};
const createBrowserWindow = (address = "") => {
  childWindow = new BrowserWindow({
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
  childWindow.setAlwaysOnTop(true, "floating");
  ipcMain.on("close-browser", () => {
    childWindow.close();
  });
  childWindow.loadFile("./browser/index.html", {
    hash: address.length > 0 ? address : "google.com",
  });
  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
