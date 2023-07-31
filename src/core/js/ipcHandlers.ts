import { ipcMain, BrowserWindow, dialog } from "electron";
import { DiscordStatusManager } from "./discordStatus.js";


const discord = new DiscordStatusManager()


const initIPCHandlers = () => {
    ipcMain.handle("minimize", (event) =>
        BrowserWindow.getFocusedWindow()?.minimize()
    )
    ipcMain.handle("close", (event) => BrowserWindow.getFocusedWindow()?.close());
    ipcMain.handle("maxmize", (event) =>
        !BrowserWindow.getFocusedWindow()?.isMaximized() ? BrowserWindow.getFocusedWindow()?.maximize() : BrowserWindow.getFocusedWindow()?.unmaximize()
    );

    ipcMain.handle("stopPlaying", () => discord.setStatusPage('Acabou de fechar o Minecraft'));
    ipcMain.handle("changedPage", (event, page) => discord.setStatusPage(page));
    ipcMain.handle("playing", (event, version) => discord.setPlaying(version));
    ipcMain.handle('fileExplorer', (event) => {
        const path = dialog.showOpenDialogSync({
            properties: ['openDirectory']
        })
        return path
    });
    ipcMain.handle('openDevtools', () => BrowserWindow.getFocusedWindow()?.webContents.openDevTools());
}

export {
    initIPCHandlers,
}