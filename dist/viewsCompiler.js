"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const ejs_1 = __importDefault(require("ejs"));
const shell = __importStar(require("shelljs"));
const fs_1 = require("fs");
const path_1 = require("path");
const node_notifier_1 = __importDefault(require("node-notifier"));
const axios_1 = __importDefault(require("axios"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    node_notifier_1.default.notify({
        appID: "BRLauncher",
        title: 'Minecraf Launcher',
        message: 'O launcher está verificando as versões, quando tudo estiver pronto avisaremos...',
        icon: (0, path_1.join)(__dirname, "assets/logo.ico"),
        sound: true,
        wait: false
    });
    console.log("⏳ Verificando as versões do minecraft e copiando arquivos, isso pode demorar um pouco...");
    let forge = [];
    let vanilla = yield (yield fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")).json();
    let fabric = yield (yield fetch("https://meta.fabricmc.net/v2/versions/game")).json();
    fabric = fabric.filter(v => v.stable);
    vanilla.versions = vanilla.versions.filter(v => v.type === "release");
    for (let j of vanilla.versions) {
        try {
            const res = yield axios_1.default.head(`https://files.minecraftforge.net/net/minecraftforge/forge/index_${j.id}.html`);
            if (res.status == 200) {
                console.log(`${j.id} forge disponivel`);
                forge.push(j.id);
            }
        }
        catch (_a) {
            console.log(`${j.id} forge não disponivel`);
        }
    }
    console.log("✔️  Versões verificadas");
    const views = (0, path_1.join)(__dirname, "views");
    const templates = (0, fs_1.readdirSync)(views);
    for (let file of templates) {
        ejs_1.default.renderFile((0, path_1.join)(views, file), {
            vanilla: vanilla.versions, fabric, forge
        }, (err, str) => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            else {
                (0, fs_1.writeFileSync)((0, path_1.join)(views, file.replace("ejs", "html")), str);
            }
        });
    }
    if (!(0, fs_1.existsSync)("./dist/views"))
        shell.mkdir("dist/views");
    if (!(0, fs_1.existsSync)("./dist/assets"))
        shell.mkdir("dist/assets");
    if (!(0, fs_1.existsSync)("./dist/services/css"))
        shell.mkdir("dist/services/css");
    shell.cp("-R", "package.json", "dist");
    shell.cp("-R", ["src/assets/*"], "dist/assets/");
    shell.cp("-R", ["src/views/*.html"], "dist/views/");
    shell.cp("-R", ["src/services/css/*.css"], "dist/services/css");
    shell.rm(["src/views/*.html"]);
}))();
