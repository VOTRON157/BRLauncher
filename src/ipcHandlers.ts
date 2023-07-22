import { ipcMain, BrowserWindow } from "electron";
import { join } from "path"
import { DiscordStatusManager } from "./discordStatus";


const discord = new DiscordStatusManager()
const pages = join(__dirname, "pages");


const initIPCHandlers = () => {
    ipcMain.handle("minimize", (event) =>
        BrowserWindow.getFocusedWindow()?.minimize()
    )
    ipcMain.handle("close", (event) => BrowserWindow.getFocusedWindow()?.close());
    ipcMain.handle("maxmize", (event) =>
        BrowserWindow.getFocusedWindow()?.isMaximized
            ? BrowserWindow.getFocusedWindow()?.unmaximize()
            : BrowserWindow.getFocusedWindow()?.maximize()
    );

    ipcMain.handle("stopPlaying", () =>  discord.setStatusPage('Acabou de fechar o Minecraft'));
    ipcMain.handle("changedPage", (event, page) =>  discord.setStatusPage(page));
    ipcMain.handle("playing", (event, version) => discord.setPlaying(version));
}

export {
    initIPCHandlers,
}