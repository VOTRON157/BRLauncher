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
    var _a;
    const logs = document.getElementById("logs");
    const startlauncher = () => __awaiter(void 0, void 0, void 0, function* () {
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
        electron_1.ipcRenderer.invoke("startDownload");
        logs.innerHTML = "";
        launcher.on("debug", (e) => {
            logs.innerHTML += `<p style="display: block; margin: 0;">${e}</p>`;
        });
        launcher.on("data", (e) => {
            logs.innerHTML += `<p style="display: block; margin: 0;">${e}</p>`;
        });
    });
    (_a = document.getElementById("play")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", startlauncher);
});
