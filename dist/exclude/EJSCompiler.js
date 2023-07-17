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
(() => __awaiter(void 0, void 0, void 0, function* () {
    const path = __dirname.split("\\");
    path.pop();
    const views = (0, path_1.join)(path.join("\\"), "views");
    const templates = (0, fs_1.readdirSync)(views);
    for (let file of templates) {
        ejs_1.default.renderFile((0, path_1.join)(views, file), {}, (err, str) => {
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
    shell.cp("-R", ["src/assets/*"], "dist/assets/");
    shell.cp("-R", ["src/views/*.html"], "dist/views/");
    shell.cp("-R", ["src/services/css/*.css"], "dist/services/css");
    shell.rm(["src/views/*.html"]);
}))();
