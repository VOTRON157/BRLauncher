import { app, BrowserWindow, Notification, ipcMain } from "electron";
import config from "./config";
import client from "discord-rich-presence";
import { join } from "path";

const discord_client = client(config.discord_app_id);
const views = join(__dirname, "views");

function createWindow2() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hidden",
    icon: join(__dirname, "assets/logo.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, "services", "preload.js"),
    },
  });

  win.loadFile(join(views, "config.html"));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hidden",
    icon: join(__dirname, "assets/logo.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, "services", "preload.js"),
    },
  });

  win.loadFile(join(views, "index.html"));
  win.removeMenu();
  win.webContents.openDevTools();

  new Notification({
    icon: join(__dirname, "assets/logo.ico"),
    title: "Minecraft Launcher",
    body: "Carregando as versões do Minecraft",
  }).show();

  discord_client.updatePresence({
    state: `Ainda não iniciou o Minecraft`,
    details: `No menu principal`,
    startTimestamp: Date.now(),
    largeImageKey: "brlauncher",
    instance: false,
  });

  ipcMain.handle("minimize", (event) =>
    BrowserWindow.getFocusedWindow()?.minimize()
  );
  ipcMain.handle("close", (event) => BrowserWindow.getFocusedWindow()?.close());
  ipcMain.handle("maxmize", (event) =>
    BrowserWindow.getFocusedWindow()?.isMaximized
      ? BrowserWindow.getFocusedWindow()?.unmaximize()
      : BrowserWindow.getFocusedWindow()?.maximize()
  );
}

ipcMain.handle("config", (event) => {
  BrowserWindow.getFocusedWindow()?.loadFile(join(views, "config.html"));
});

ipcMain.handle("home", (event) => {
  BrowserWindow.getFocusedWindow()?.loadFile(join(views, "index.html"));
})

ipcMain.handle("stopPlaying", () => {
  discord_client.updatePresence({
    state: `Ainda não iniciou o Minecraft`,
    details: `No menu principal`,
    startTimestamp: Date.now(),
    largeImageKey: "brlauncher",
    instance: false,
  });
});

ipcMain.handle("playing", (event, version) => {
  discord_client.updatePresence({
    state: `Minecraft ${version.split(" ")[1]}`,
    details: `Jogando Minecraft ${version.split(" ")[0]}`,
    startTimestamp: Date.now(),
    largeImageKey: "brlauncher",
    instance: false,
  });
});

app.whenReady().then(() => {
  if (process.platform === "win32") {
    app.setAppUserModelId("BRLauncher");
  }
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
