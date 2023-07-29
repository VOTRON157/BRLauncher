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
const electron_1 = __importDefault(require("electron"));
const { app, BrowserWindow } = electron_1.default;
const ipcHandlers_js_1 = require("./core/js/ipcHandlers.js");
const path_1 = require("path");
const pages = (0, path_1.join)(__dirname, "pages");
function createWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        const win = new BrowserWindow({
            minWidth: 1200,
            minHeight: 700,
            titleBarStyle: "hidden",
            icon: (0, path_1.join)(__dirname, "assets/logo.ico"),
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
                preload: (0, path_1.join)(__dirname, 'core', "app.js"),
            },
        });
        win.loadFile((0, path_1.join)(pages, "index.html"));
        win.removeMenu();
        win.webContents.openDevTools();
        (0, ipcHandlers_js_1.initIPCHandlers)();
    });
}
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
