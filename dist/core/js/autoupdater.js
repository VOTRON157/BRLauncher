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
exports.AutoUpdater = void 0;
const node_fs_1 = require("node:fs");
const semver_1 = __importDefault(require("semver"));
const events_1 = __importDefault(require("events"));
const decompress_1 = __importDefault(require("decompress"));
const node_child_process_1 = require("node:child_process");
class AutoUpdater extends events_1.default {
    constructor() {
        super();
        console.log("[CLIENT SIDE] O AUTOUPDATER FOI INICIALIZADO");
        this.checkForUpdates();
    }
    checkForUpdates() {
        console.log("Alou?");
        fetch("https://raw.githubusercontent.com/VOTRON157/BRLauncher/main/package.json")
            .then((res) => res.json())
            .then((json) => __awaiter(this, void 0, void 0, function* () {
            if (semver_1.default.lt(process.env.npm_package_version, json.version))
                this.emit("update-found");
            else
                this.emit("update-notavaliable");
        }));
    }
    downloadNewVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit("downloading-zip");
            const newVersion = "https://github.com/VOTRON157/BRLauncher/archive/refs/heads/main.zip";
            const data = yield fetch(newVersion);
            const buffer = Buffer.from(yield (yield data.blob()).arrayBuffer());
            (0, node_child_process_1.exec)("mkdir updater", () => {
                this.emit("unpacking");
                const writeStream = (0, node_fs_1.createWriteStream)("updater/brlauncher.zip");
                writeStream.write(buffer);
                writeStream.end();
                writeStream.on("finish", () => {
                    (0, decompress_1.default)("updater/brlauncher.zip", "updater/brlauncher")
                        .then(() => {
                        this.emit("copy");
                        (0, node_child_process_1.exec)("xcopy updater\\brlauncher\\BRLauncher-main\\* . /E /I /H /Y", () => (0, node_child_process_1.exec)("rd /s /q updater", () => this.emit("finished")));
                    });
                });
            });
        });
    }
}
exports.AutoUpdater = AutoUpdater;
// sim eu fiz isso kkkk, eu não achei nenhum pacote que funcionase 
