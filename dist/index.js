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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const config_1 = __importDefault(require("./config"));
const discord_rich_presence_1 = __importDefault(require("discord-rich-presence"));
const path_1 = require("path");
const discord_client = (0, discord_rich_presence_1.default)(config_1.default.discord_app_id);
const views = (0, path_1.join)(__dirname, "views");
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: "hidden",
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
    electron_1.ipcMain.handle("minimize", () => win.minimize());
}
electron_1.ipcMain.handle("downloadCompleted", () => {
    new electron_1.Notification({
        icon: (0, path_1.join)(__dirname, "assets/logo.ico"),
        title: "Minecraft Launcher",
        body: "O download foi concluido"
    }).show();
});
electron_1.ipcMain.handle('startDownload', (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    new electron_1.Notification({
        icon: (0, path_1.join)(__dirname, "assets/logo.ico"),
        title: "Minecraft Launcher",
        body: "O Minecraft está sendo baixado, quando tudo for concluido avisaremos."
    }).show();
}));
electron_1.ipcMain.handle("stopPlaying", () => {
    discord_client.disconnect();
});
electron_1.ipcMain.handle("playing", (event, version) => {
    discord_client
        .updatePresence({
        state: `Minecraft ${version.split(" ")[1]}`,
        details: `Jogando Minecraft ${version.split(" ")[0]}`,
        startTimestamp: Date.now(),
        largeImageKey: 'brlauncher',
        instance: false,
    });
});
electron_1.app.whenReady().then(() => {
    if (process.platform === 'win32') {
        electron_1.app.setAppUserModelId("BRLauncher");
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
