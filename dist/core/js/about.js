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
exports.AboutPage = void 0;
const electron_1 = require("electron");
const base_js_1 = require("../base.js");
class AboutPage extends base_js_1.PageBase {
    constructor() {
        super({
            pageName: 'about'
        });
        console.log("[CLIENT SIDE] O CLASSE ABOUT FOI CARREGADA");
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initButtons();
        });
    }
    initButtons() {
        const devtoolsBtn = document.getElementById('devtools');
        devtoolsBtn.addEventListener('click', () => electron_1.ipcRenderer.invoke('openDevtools'));
    }
}
exports.AboutPage = AboutPage;
