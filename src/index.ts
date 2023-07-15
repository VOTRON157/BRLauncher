import { app, BrowserWindow, Notification, ipcMain } from "electron"
import { join } from "path"

const views = join(__dirname, "views")

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    icon: join(__dirname, "assets/logo.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, 'services', 'preload.js')
    }
  })

  win.loadFile(join(views, "index.html"))
  win.removeMenu()
  win.webContents.openDevTools()
  new Notification({
    icon: join(__dirname, "assets/logo.ico"),
    title: "Minecraft Launcher",
    body: "O launcher está pronto."
  }).show()
}

ipcMain.handle('startDownload', async (event, ...args) => {
  new Notification({
    icon: join(__dirname, "assets/logo.ico"),
    title: "Minecraft Launcher",
    body: "O Minecraft está sendo baixado, quando tudo for concluido avisaremos."
  }).show()
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