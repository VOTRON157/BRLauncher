import { app, BrowserWindow, Notification, ipcMain } from "electron"
import config from "./config";
import client from "discord-rich-presence";
import { join } from "path"

const discord_client = client(config.discord_app_id)
const views = join(__dirname, "views")

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
      preload: join(__dirname, 'services', 'preload.js')
    }
  })

  win.loadFile(join(views, "index.html"))
  win.removeMenu()
  // win.webContents.openDevTools()

  new Notification({
    icon: join(__dirname, "assets/logo.ico"),
    title: "Minecraft Launcher",
    body: "O launcher está pronto."
  }).show()

  ipcMain.handle("minimize", () => win.minimize())

}

ipcMain.handle("downloadCompleted", () => {
  new Notification({
    icon: join(__dirname, "assets/logo.ico"),
    title: "Minecraft Launcher",
    body: "O download foi concluido"
  }).show()
})

ipcMain.handle('startDownload', async (event, ...args) => {
  new Notification({
    icon: join(__dirname, "assets/logo.ico"),
    title: "Minecraft Launcher",
    body: "O Minecraft está sendo baixado, quando tudo for concluido avisaremos."
  }).show()
})

process.on("unhandledRejection", (reason: any) => {
  if(reason.message.includes("connection closed")) return 0;
})

ipcMain.handle("stopPlaying", () => {
  discord_client.disconnect()
})

ipcMain.handle("playing", (event, version) => {
  discord_client
    .updatePresence({
      state: `Jogando Minecraft`,
      startTimestamp: Date.now(),
      largeImageKey: 'brlauncher',
      instance: false,
    });
})

app.whenReady().then(() => {
  if (process.platform === 'win32') {
    app.setAppUserModelId(app.name);
  }
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})