import { ipcRenderer } from "electron";
import { PageBase } from "../base.js";

class AboutPage extends PageBase {
    constructor() {
        super({
            pageName: 'about'
        })
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