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
const minecraft_launcher_core_1 = require("minecraft-launcher-core");
const electron_1 = require("electron");
window.addEventListener('DOMContentLoaded', () => {
    // const logs = document.getElementById("logs") as HTMLElement
    const playButton = document.getElementById("play");
    const minimize = document.getElementById("minimize");
    const barra = document.getElementById('barra');
    const discord = document.getElementById('discord');
    discord.addEventListener("click", (event) => {
        if (discord.checked) {
            electron_1.ipcRenderer.invoke("playing");
            alert("Status definido no seu Discord, para desativar é so desmarca a caixa.");
        }
        else {
            electron_1.ipcRenderer.invoke("stopPlaying");
        }
    });
    const startlauncher = () => __awaiter(void 0, void 0, void 0, function* () {
        const assets = new Set();
        playButton.disabled = true;
        playButton.innerHTML = '<span class="material-icons mr-1">access_time</span> Carregando...';
        const name = document.getElementById("name").value || "Player";
        const version = document.getElementById("version").value;
        // const password = (document.getElementById("password") as HTMLInputElement).value
        const user = minecraft_launcher_core_1.Authenticator.getAuth(name);
        const launcher = new minecraft_launcher_core_1.Client();
        launcher.launch({
            authorization: user,
            root: './minecraft',
            version: {
                number: version,
                type: "release"
            },
            memory: {
                min: "1G",
                max: "3G"
            }
        });
        launcher.on("download-status", (download) => {
            const porcetagem = Math.round((download.current / download.total) * 100);
            barra.innerHTML = `Baixando ${download.name} | ${porcetagem}% | ${download.current}/${download.total} Bytes`;
            barra.style.width = `${porcetagem}%`;
        });
        launcher.on('close', code => {
            playButton.disabled = false;
            playButton.innerHTML = '<span class="material-icons mr-1">play_circle</span> Jogar';
            electron_1.ipcRenderer.invoke("stopPlaying");
        });
        launcher.on("error", (err) => {
            playButton.disabled = false;
            playButton.innerHTML = '<span class="material-icons mr-1">play_circle</span> Jogar';
            alert(err);
        });
    });
    minimize.addEventListener("click", () => electron_1.ipcRenderer.invoke("minimize"));
    playButton.addEventListener("click", startlauncher);
});
