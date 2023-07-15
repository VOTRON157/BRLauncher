import { Client as Launcher, Authenticator } from "minecraft-launcher-core"
import { IpcRenderer, ipcRenderer } from "electron"

window.addEventListener('DOMContentLoaded', () => {
    const logs = document.getElementById("logs") as HTMLElement
    const startlauncher = async () => {
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
       ipcRenderer.invoke("startDownload")
        logs.innerHTML = ""
        launcher.on("debug", (e) => {
            logs.innerHTML += `<p style="display: block; margin: 0;">${e}</p>`
        })
        launcher.on("data", (e) => {
            logs.innerHTML += `<p style="display: block; margin: 0;">${e}</p>`
        })
    }
    document.getElementById("play")?.addEventListener("click", startlauncher)
})


