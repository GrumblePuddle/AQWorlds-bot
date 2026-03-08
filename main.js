const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const macro = require("./macro");

let mainWindow;
let overlayWindow;

Menu.setApplicationMenu(null);

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 860,
    height: 750,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      overlayWindow.close();
    }

    app.quit();
  });
}

function createOverlayWindow() {
  overlayWindow = new BrowserWindow({
    width: 340,
    height: 250,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  overlayWindow.loadFile("overlay.html");
}

function broadcastMacroStatus(isRunning) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("macro-status-changed", isRunning);
  }

  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send("macro-status-changed", isRunning);
  }
}

app.whenReady().then(() => {
  createMainWindow();
  createOverlayWindow();
});

ipcMain.on("start-macro", (_event, config) => {
  macro.startMacro(config);
  broadcastMacroStatus(true);
});

ipcMain.on("stop-macro", () => {
  macro.stopMacro();
  broadcastMacroStatus(false);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
