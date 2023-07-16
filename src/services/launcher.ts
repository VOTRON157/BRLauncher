import { ipcRenderer } from "electron"
import { writeFileSync } from "original-fs";
import { Mojang, Launch } from "minecraft-java-core"
const launcher = new Launch();

window.addEventListener('DOMContentLoaded', () => {
    // const logs = document.getElementById("logs") as HTMLElement
    const playButton = document.getElementById("play") as HTMLButtonElement
    const minimize = document.getElementById("minimize") as HTMLElement
    const barra = document.getElementById('barra') as HTMLElement
    const discord = document.getElementById('discord') as HTMLInputElement

    const startlauncher = async () => {

        playButton.disabled = true
        playButton.innerHTML = '<span class="material-icons mr-1">access_time</span> Carregando...'
        const name = (document.getElementById("name") as HTMLInputElement).value || "Player"
        const version = (document.getElementById("version") as HTMLSelectElement).value;

        writeFileSync("./launcherCache.json", JSON.stringify({
            lastUsername: name,
            lastVersion: version
        }))

        const custom = (value: string) => {
            const values: any = {
                vanilla: {
                    bool: false,
                    type: undefined
                },
                fabric: {
                    bool: true,
                    type: 'fabric'
                },
                forge: {
                    bool: true,
                    type: 'forge'
                }
            }
            return values[value]
        }
        // const password = (document.getElementById("password") as HTMLInputElement).value

        await launcher.Launch({
            authenticator: await Mojang.login(name),
            timeout: 10000,
            path: './.minecraft',
            version: version.split(" ")[0],
            detached: false,
            downloadFileMultiple: 100,

            loader: {
                type: custom(version.split(" ")[1])?.type,
                build: "latest",
                enable: custom(version.split(" ")[1])?.bool
            },

            verify: false,
            ignored: ['loader', 'options.txt'],
            args: [],
            javaPath: null,
            java: true,
            screen: {
                width: 1000,
                height: 650,
                fullscreen: null,
            },

            memory: {
                min: '1G',
                max: '3G'
            }
        })

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

        launcher.on('estimated', (time: number) => {
            let hours = Math.floor(time / 3600);
            let minutes = Math.floor((time - hours * 3600) / 60);
            let seconds = Math.floor(time - hours * 3600 - minutes * 60);
            console.log(`${hours}h ${minutes}m ${seconds}s`);
        })

        launcher.on('close', (code: number) => {
            playButton.disabled = false
            playButton.innerHTML = '<span class="material-icons mr-1">play_circle</span> Jogar'
            ipcRenderer.invoke("stopPlaying")
        });

        launcher.on("error", (err: any) => {
            playButton.disabled = false
            playButton.innerHTML = '<span class="material-icons mr-1">play_circle</span> Jogar'
            ipcRenderer.invoke("stopPlaying")
            alert(JSON.stringify(err))
        })

        launcher.on('data', (data: any) => {
            if(data.includes("Launching")) ipcRenderer.invoke("playing", version)
        })
        // launcher.on('debug', console.log)

    }
    minimize.addEventListener("click", () => ipcRenderer.invoke("minimize"))
    playButton.addEventListener("click", startlauncher)
})