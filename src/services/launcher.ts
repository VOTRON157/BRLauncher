import { Client as Launcher, Authenticator } from "minecraft-launcher-core"
import { IpcRenderer, ipcRenderer } from "electron"

window.addEventListener('DOMContentLoaded', () => {
    // const logs = document.getElementById("logs") as HTMLElement
    const playButton = document.getElementById("play") as HTMLButtonElement
    const minimize = document.getElementById("minimize") as HTMLElement
    const barra = document.getElementById('barra') as HTMLElement
    const discord = document.getElementById('discord') as HTMLInputElement

    discord.addEventListener("click", (event) => {
        if(discord.checked) {
            ipcRenderer.invoke("playing")
            alert("Status definido no seu Discord, para desativar é so desmarca a caixa.")
        } else {
            ipcRenderer.invoke("stopPlaying")
        }
    })

    const startlauncher = async () => {
        const assets = new Set()
        playButton.disabled = true
        playButton.innerHTML = '<span class="material-icons mr-1">access_time</span> Carregando...'
        const name = (document.getElementById("name") as HTMLInputElement).value || "Player"
        const version = (document.getElementById("version") as HTMLSelectElement).value
        // const password = (document.getElementById("password") as HTMLInputElement).value

        const user = Authenticator.getAuth(name)
        const launcher = new Launcher();
        launcher.launch({
            authorization: user,
            root: './minecraft',
            version: {
                number: version,
                type: "release"
            },
            memory: {
                min: "1G",
                max: "3G"
            }
        })

        launcher.on("download-status", (download) => {
            const porcetagem = Math.round((download.current / download.total) * 100)
            barra.innerHTML = `Baixando ${download.name} | ${porcetagem}% | ${download.current}/${download.total} Bytes`
            barra.style.width = `${porcetagem}%`
        })

        launcher.on('close', code => {
            playButton.disabled = false
            playButton.innerHTML = '<span class="material-icons mr-1">play_circle</span> Jogar'
            ipcRenderer.invoke("stopPlaying")
        });

        launcher.on("error", (err) => {
            playButton.disabled = false
            playButton.innerHTML = '<span class="material-icons mr-1">play_circle</span> Jogar'
            alert(err)
        })

    }
    minimize.addEventListener("click", () => ipcRenderer.invoke("minimize"))
    playButton.addEventListener("click", startlauncher)
})


