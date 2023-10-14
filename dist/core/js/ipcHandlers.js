"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIPCHandlers = void 0;
const electron_1 = require("electron");
const discordStatus_js_1 = require("./discordStatus.js");
const discord = new discordStatus_js_1.DiscordStatusManager();
const initIPCHandlers = () => {
    electron_1.ipcMain.handle("minimize", (event) => { var _a; return (_a = electron_1.BrowserWindow.getFocusedWindow()) === null || _a === void 0 ? void 0 : _a.minimize(); });
    electron_1.ipcMain.handle("close", (event) => { var _a; return (_a = electron_1.BrowserWindow.getFocusedWindow()) === null || _a === void 0 ? void 0 : _a.close(); });
    electron_1.ipcMain.handle("maxmize", (event) => { var _a, _b, _c; return !((_a = electron_1.BrowserWindow.getFocusedWindow()) === null || _a === void 0 ? void 0 : _a.isMaximized()) ? (_b = electron_1.BrowserWindow.getFocusedWindow()) === null || _b === void 0 ? void 0 : _b.maximize() : (_c = electron_1.BrowserWindow.getFocusedWindow()) === null || _c === void 0 ? void 0 : _c.unmaximize(); });
    electron_1.ipcMain.handle("stopPlaying", () => discord.setStatusPage('Acabou de fechar o Minecraft'));
    electron_1.ipcMain.handle("changedPage", (event, page) => discord.setStatusPage(page));
    electron_1.ipcMain.handle("playing", (event, version) => discord.setPlaying(version));
    electron_1.ipcMain.handle('fileExplorer', (event) => {
        const path = electron_1.dialog.showOpenDialogSync({
            properties: ['openDirectory']
        });
        return path;
    });
    electron_1.ipcMain.handle('openDevtools', () => { var _a; return (_a = electron_1.BrowserWindow.getFocusedWindow()) === null || _a === void 0 ? void 0 : _a.webContents.openDevTools(); });
};
exports.initIPCHandlers = initIPCHandlers;
