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
const fs_1 = require("fs");
const axios_1 = __importDefault(require("axios"));
const os_1 = __importDefault(require("os"));
const original_fs_1 = require("original-fs");
const electron_1 = require("electron");
const cache = JSON.parse((0, fs_1.readFileSync)("./cache.json", "utf-8"));
const config = JSON.parse((0, fs_1.readFileSync)("./config.json", "utf-8"));
window.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    if (document.title == "Minecraft Launcher") {
        yield versions();
        yield setCachedUsername();
    }
    else if (document.title == "Launcher Configurações") {
        setDefaultOptions();
    }
    const loading = document.getElementById('loading');
    loading.remove();
}));
function setDefaultOptions() {
    return __awaiter(this, void 0, void 0, function* () {
        const dir = document.getElementById("dir");
        const largura = document.getElementById("largura");
        const altura = document.getElementById("altura");
        const memory = document.getElementById("memory");
        const fullScreen = document.getElementById("fullscreen");
        const saveButton = document.getElementById("save");
        const memoryPanel = document.getElementById("memoryPanel");
        const voltar = document.getElementById("voltar");
        fullScreen.checked = config.fullScreen;
        dir.value = config.dir;
        largura.value = config.width.toString();
        altura.value = config.height.toString();
        memory.min = config.memory.min.replace("M", '');
        memory.max = Math.round((os_1.default.totalmem()) / (1020 ** 2)).toString();
        memory.value = config.memory.max.replace("M", '');
        memoryPanel.value = memory.value.toString();
        memoryPanel.addEventListener("input", () => {
            memory.value = memoryPanel.value;
        });
        memoryPanel.addEventListener("change", () => {
            if (parseInt(memoryPanel.value) < 1024)
                memoryPanel.value = memory.min;
            else if (parseInt(memoryPanel.value) > parseInt(memory.max))
                memoryPanel.value = memory.max;
        });
        memory.addEventListener("input", () => {
            memoryPanel.value = memory.value;
        });
        voltar.addEventListener("click", () => electron_1.ipcRenderer.invoke("home"));
        saveButton.addEventListener("click", () => {
            const data = {
                dir: dir.value,
                width: parseInt(largura.value),
                height: parseInt(altura.value),
                fullScreen: fullScreen.checked,
                memory: {
                    min: "1024M",
                    max: memory.value + 'M',
                }
            };
            (0, original_fs_1.writeFileSync)("./config.json", JSON.stringify(data));
            alert("Dados salvo!");
        });
    });
}
function setCachedUsername() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = document.getElementById('name');
        if (cache.lastUsername.length)
            name.value = cache.lastUsername;
    });
}
function versions() {
    return __awaiter(this, void 0, void 0, function* () {
        const select = document.getElementById('version');
        let vanilla = yield (yield fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")).json();
        let fabric = yield (yield fetch("https://meta.fabricmc.net/v2/versions/game")).json();
        fabric = fabric.filter(v => v.stable);
        vanilla.versions = vanilla.versions.filter(v => v.type === "release");
        // da pra entender nada ai kkkk
        for (let j of vanilla.versions) {
            if (cache.lastVersion == `${j.id} vanilla`)
                select.innerHTML += `<option class="text-black" value='${j.id} vanilla' selected>${j.id} vanilla</option>`;
            else
                select.innerHTML += `<option class="text-black" value='${j.id} vanilla'>${j.id} vanilla</option>`;
            const equivalentFabric = fabric.find(v => v.version == j.id);
            if (equivalentFabric) {
                if (cache.lastVersion == `${j.id} fabric`)
                    select.innerHTML += `<option class="text-black" value='${equivalentFabric.version} fabric' selected>${equivalentFabric.version} fabric</option>`;
                select.innerHTML += `<option class="text-black" value='${equivalentFabric.version} fabric'>${equivalentFabric.version} fabric</option>`;
            }
            try {
                const res = yield axios_1.default.head(`https://files.minecraftforge.net/net/minecraftforge/forge/index_${j.id}.html`);
                if (res.status == 200) {
                    console.log(`${j.id} forge disponivel`);
                    if (cache.lastVersion == `${j.id} forge`)
                        select.innerHTML += `<option class="text-black" value='${j.id} forge' selected>${j.id} forge</option>`;
                    else
                        select.innerHTML += `<option class="text-black" value='${j.id} forge'>${j.id} forge</option>`;
                }
            }
            catch (_a) {
                console.log(`${j.id} forge não disponivel`);
            }
        }
    });
}
