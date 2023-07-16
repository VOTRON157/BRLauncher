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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs_1 = __importDefault(require("ejs"));
const shell = __importStar(require("shelljs"));
const fs_1 = require("fs");
const path_1 = require("path");
fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")
    .then(res => res.json())
    .then(({ versions: json }) => {
    json = json.filter(el => el.type === "release");
    const views = (0, path_1.join)(__dirname, "views");
    const templates = (0, fs_1.readdirSync)(views);
    for (let file of templates) {
        ejs_1.default.renderFile((0, path_1.join)(views, file), {
            versions: json
        }, (err, str) => {
            if (err)
                process.exit(1);
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
});
