"use strict";
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
function createWindow2() {
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
            preload: (0, path_1.join)(__dirname, "services", "preload.js"),
        },
    });
    win.loadFile((0, path_1.join)(views, "config.html"));
}
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
            preload: (0, path_1.join)(__dirname, "services", "preload.js"),
        },
    });
    win.loadFile((0, path_1.join)(views, "index.html"));
    win.removeMenu();
    win.webContents.openDevTools();
    new electron_1.Notification({
        icon: (0, path_1.join)(__dirname, "assets/logo.ico"),
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
    electron_1.ipcMain.handle("minimize", (event) => { var _a; return (_a = electron_1.BrowserWindow.getFocusedWindow()) === null || _a === void 0 ? void 0 : _a.minimize(); });
    electron_1.ipcMain.handle("close", (event) => { var _a; return (_a = electron_1.BrowserWindow.getFocusedWindow()) === null || _a === void 0 ? void 0 : _a.close(); });
    electron_1.ipcMain.handle("maxmize", (event) => {
        var _a, _b, _c;
        return ((_a = electron_1.BrowserWindow.getFocusedWindow()) === null || _a === void 0 ? void 0 : _a.isMaximized)
            ? (_b = electron_1.BrowserWindow.getFocusedWindow()) === null || _b === void 0 ? void 0 : _b.unmaximize()
            : (_c = electron_1.BrowserWindow.getFocusedWindow()) === null || _c === void 0 ? void 0 : _c.maximize();
    });
}
electron_1.ipcMain.handle("config", (event) => {
    var _a;
    (_a = electron_1.BrowserWindow.getFocusedWindow()) === null || _a === void 0 ? void 0 : _a.loadFile((0, path_1.join)(views, "config.html"));
});
electron_1.ipcMain.handle("home", (event) => {
    var _a;
    (_a = electron_1.BrowserWindow.getFocusedWindow()) === null || _a === void 0 ? void 0 : _a.loadFile((0, path_1.join)(views, "index.html"));
});
electron_1.ipcMain.handle("stopPlaying", () => {
    discord_client.updatePresence({
        state: `Ainda não iniciou o Minecraft`,
        details: `No menu principal`,
        startTimestamp: Date.now(),
        largeImageKey: "brlauncher",
        instance: false,
    });
});
electron_1.ipcMain.handle("playing", (event, version) => {
    discord_client.updatePresence({
        state: `Minecraft ${version.split(" ")[1]}`,
        details: `Jogando Minecraft ${version.split(" ")[0]}`,
        startTimestamp: Date.now(),
        largeImageKey: "brlauncher",
        instance: false,
    });
});
electron_1.app.whenReady().then(() => {
    if (process.platform === "win32") {
        electron_1.app.setAppUserModelId("BRLauncher");
    }
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
