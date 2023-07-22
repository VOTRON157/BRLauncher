import axios from "axios"
import { Launcher } from "./launcher"
import { FabricAPI, MineAPI } from "../../interfaces/launcher"
import { ipcRenderer } from "electron"
import { PageBase } from "../base"
import Account from "../../db/account"


class HomePage extends PageBase {
    constructor() {
        super({
            pageName: 'home'
        })
    }

    async init() {
        await this.manageDropdown()
        const play = document.getElementById('play') as HTMLButtonElement
        play.addEventListener('click', () => {
            this.startLauncher()
            play.innerHTML = '<span class="material-icons">play_disabled</span> Instalando...'
            play.disabled = true
        })
    }

    private async getFabricVersions() {
        let fabric = (await (await fetch("https://meta.fabricmc.net/v2/versions/game")).json() as FabricAPI[]).filter(v => v.stable).map(v => v.version)
        return fabric
    }

    private async getVanillaVersions() {
        let vanilla = (await (await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")).json() as MineAPI).versions.filter(v => v.type === "release").map(v => v.id)
        return vanilla
    }

    private async getForgeVersions(versions: string[]) {
        const forge: string[] = []
        for (var version of versions) {
            const res = await axios.head(`https://files.minecraftforge.net/net/minecraftforge/forge/index_${version}.html`)
                .then(res => res.status == 200 ? forge.push(version) : null)
                .catch(e => console.log("Forge version not avaliable", version))
        }
        return forge
    }

    private returnOptionElement(type: 'forge' | 'fabric' | 'vanilla', version: string) {
        const div = document.createElement('div')
        div.classList.add('flex', 'items-center', 'gap-x-3', 'p-2', 'cursor-pointer', 'border-l-0', 'hover:border-l-4', 'border-blue-500', 'duration-150')
        div.innerHTML = `<img src="../core/imgs/${type}.png" width="30">${type} ${version}`
        div.addEventListener('click', () => this.setDropdownItem(div.innerHTML.split('>')[1]))
        return div
    }

    private setDropdownItem(item: string) {
        const fake = document.getElementById('fake-select') as HTMLElement
        fake.innerHTML = `<img src="../core/imgs/${item.split(' ')[0]}.png" width="30">${item}`
        const input = document.getElementById('version') as HTMLInputElement
        input.value = item
    }

    async manageDropdown() {
        const vanilla = await this.getVanillaVersions()
        const fabric = await this.getFabricVersions()
        const forge = await this.getForgeVersions(vanilla)

        const options = document.getElementById('options') as HTMLElement

        for (let version of vanilla) {
            const forgeDiv = this.returnOptionElement('forge', version)
            const fabricDiv = this.returnOptionElement('fabric', version)
            const vanillaDiv = this.returnOptionElement('vanilla', version)

            options.appendChild(vanillaDiv)

            if (fabric.includes(version)) {
                options.appendChild(fabricDiv)
            }
            if (forge.includes(version)) {
                options.appendChild(forgeDiv)
            }
        }
    }

    startLauncher() {
        const [type, version] = (document.getElementById('version') as HTMLInputElement).value.split(' ')
        const launcher = new Launcher()
        launcher.init(version, type)
       

        const barra = document.getElementById('barra') as HTMLElement

        launcher.on("progress", (progress: any, size: any, element: any) => {
            const porcentagem = Math.round((progress / size) * 100)
            barra.innerHTML = `Baixando ${element} | ${porcentagem}% | ${(progress / 1000000).toPrecision(2)}/${(size / 1000000).toPrecision(2)} MB`
            barra.style.width = `${porcentagem}%`
        })

        launcher.on("check", (progress: any, size: any, element: any) => {
            const porcentagem = Math.round((progress / size) * 100)
            barra.innerHTML = `Checando ${element} | ${porcentagem}% | ${(progress / 1000000).toPrecision(2)}/${(size / 1000000).toPrecision(2)} MB`
            barra.style.width = `${porcentagem}%`
        })

        launcher.on("error", (err: any) => {
            barra.innerHTML = `<span class="text-red-700">${JSON.stringify(err)}</span>`
            alert(JSON.stringify(err))
        })

        launcher.on('data', (data: any) => {
            barra.innerHTML = '<span class="text-lime-700">Iniciando JVM e o Minecraft</span>'
            barra.style.width = '100%'
            if (data.includes("Launching")) {
                barra.innerHTML = '<span class="text-lime-700">Jogo rodando...</span>'
                ipcRenderer.invoke("playing", `${type} ${version}`)
            }
        })

        launcher.on('close', (code: number) => {
            barra.style.width = '0%'
            const play = document.getElementById('play') as HTMLButtonElement
            play.disabled = false
            play.innerHTML = '<span class="material-icons">play_circle</span> Instalar e Jogar'
            ipcRenderer.invoke("stopPlaying")
        })
    }
}

export {
    HomePage
}