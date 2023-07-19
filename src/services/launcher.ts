import { ipcRenderer } from "electron"
import { writeFileSync } from "fs";
import { Mojang, Launch } from "minecraft-java-core"
import { Config } from "../interfaces/launcher";
import { readFileSync } from "original-fs";

const launcher = new Launch();

export default () => {
  window.addEventListener('DOMContentLoaded', () => {
    // const logs = document.getElementById("logs") as HTMLElement
    const playButton = document.getElementById("play") as HTMLButtonElement
    const minimize = document.getElementById("minimize") as HTMLElement
    const barra = document.getElementById('barra') as HTMLElement
    const discord = document.getElementById('discord') as HTMLInputElement

    const startlauncher = async () => {

      const config = JSON.parse(readFileSync("./config.json", "utf-8")) as Config

      playButton.disabled = true
      playButton.innerHTML = '<span class="material-icons mr-1">access_time</span> Carregando...'
      const name = (document.getElementById("name") as HTMLInputElement).value || "Player"
      const version = (document.getElementById("version") as HTMLSelectElement).value;

      writeFileSync("./cache.json", JSON.stringify({
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
        path: config.dir,
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
          width: config.width,
          height: config.height,
          fullscreen: config.fullScreen,
        },

        memory: {
          min: config.memory.min,
          max: config.memory.max
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
        if (data.includes("Launching")) ipcRenderer.invoke("playing", version)
        console.log(data)
      })
    }
    minimize.addEventListener("click", () => ipcRenderer.invoke("minimize"))
    playButton.addEventListener("click", startlauncher)
  })
}