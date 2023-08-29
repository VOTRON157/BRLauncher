import { PageBase } from "../base.js";
import Launcher from "../../db/launcher.js";
import os from "os"
import { ipcRenderer } from "electron";

class ConfigPage extends PageBase {
    constructor() {
        super({
            pageName: 'config'
        })
    }

    async init() {
        if (!(await Launcher.config())) {
            await Launcher.resetConfig()
        }
        await this.startConfig()
        await this.initEvents()
    }

    async startConfig() {
        const data = await Launcher.config()
        if (!data) return this.notification('Algo deu errado.')

        const dirInput = document.getElementById('dir') as HTMLInputElement
        dirInput.value = data.path

        const heightInput = document.getElementById('height') as HTMLInputElement
        heightInput.value = data.height.toString()

        const widthInput = document.getElementById('width') as HTMLInputElement
        widthInput.value = data.width.toString()

        const minInput = document.getElementById('min') as HTMLInputElement
        minInput.min = '1024'
        minInput.max = Math.round((os.totalmem()) / (1020 ** 2)).toString()
        minInput.value = data.min.toString()

        const maxInput = document.getElementById('max') as HTMLInputElement
        maxInput.min = '1024'
        maxInput.max = Math.round((os.totalmem()) / (1020 ** 2)).toString()
        maxInput.value = data.max.toString()

        const maxPanel = document.getElementById('maxPanel') as HTMLDivElement
        const minPanel = document.getElementById('minPanel') as HTMLDivElement

        minPanel.innerHTML = minInput.value
        maxPanel.innerHTML = maxInput.value
    }

    async initEvents() { // Necessario pra não "clonar" os eventos
        const widthInput = document.getElementById('width') as HTMLInputElement
        const dirInput = document.getElementById('dir') as HTMLInputElement
        const heightInput = document.getElementById('height') as HTMLInputElement
        const minInput = document.getElementById('min') as HTMLInputElement
        const maxInput = document.getElementById('max') as HTMLInputElement
        const maxPanel = document.getElementById('maxPanel') as HTMLDivElement
        const minPanel = document.getElementById('minPanel') as HTMLDivElement
        const fileExplorer = document.getElementById('fileExplorer') as HTMLButtonElement

        minInput.addEventListener('input', () => minPanel.innerHTML = minInput.value)
        maxInput.addEventListener('input', () => maxPanel.innerHTML = maxInput.value)

        const saveButton = document.getElementById('salvar') as HTMLButtonElement
        saveButton.addEventListener('click', async () => {
            await Launcher.update(dirInput.value, parseInt(minInput.value), parseInt(maxInput.value), parseInt(widthInput.value), parseInt(heightInput.value))
            this.notification('Configuraçõe salvas 💫')
            this.startConfig()
        })

        const resetButton = document.getElementById('reset') as HTMLButtonElement
        resetButton.addEventListener('click', async () => {
            await Launcher.resetConfig()
            this.notification('Configurações resetadas 🗑️')
            this.startConfig()
        })

        fileExplorer.addEventListener('click', async () => {
            const path = await ipcRenderer.invoke('fileExplorer') as string[] | undefined
            if(!path) return 0;
            dirInput.value = path[0]
        })
    }
}

export {
    ConfigPage
}