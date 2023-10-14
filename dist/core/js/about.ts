import { ipcRenderer } from "electron";
import { PageBase } from "../base.js";

class AboutPage extends PageBase {
    constructor() {
        super({
            pageName: 'about'
        })
        console.log("[CLIENT SIDE] O CLASSE ABOUT FOI CARREGADA")
    }

    async init() {
        this.initButtons()
    }

    initButtons(){
        const devtoolsBtn = document.getElementById('devtools') as HTMLButtonElement
        devtoolsBtn.addEventListener('click', () => ipcRenderer.invoke('openDevtools'))
    }
}

export {
    AboutPage
}