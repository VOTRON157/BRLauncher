"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const views = (0, path_1.join)(__dirname, "views");
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        icon: (0, path_1.join)(__dirname, "assets/logo.ico"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: (0, path_1.join)(__dirname, 'services', 'preload.js')
        }
    });
    win.loadFile((0, path_1.join)(views, "index.html"));
    win.removeMenu();
    win.webContents.openDevTools();
    new electron_1.Notification({
        icon: (0, path_1.join)(__dirname, "assets/logo.ico"),
        title: "Minecraft Launcher",
        body: "O launcher está pronto."
    }).show();
}
electron_1.ipcMain.handle('startDownload', (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    new electron_1.Notification({
        icon: (0, path_1.join)(__dirname, "assets/logo.ico"),
        title: "Minecraft Launcher",
        body: "O Minecraft está sendo baixado, quando tudo for concluido avisaremos."
    }).show();
}));
electron_1.app.whenReady().then(() => {
    if (process.platform === 'win32') {
        electron_1.app.setAppUserModelId(electron_1.app.name);
    }
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
