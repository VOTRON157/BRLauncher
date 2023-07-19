import { readFileSync } from "fs";
import { FabricAPI, MineAPI } from "../interfaces/launcher";
import { Config } from "../interfaces/launcher";
import axios from "axios";
import os from "os"
import { writeFileSync } from "original-fs";
import { ipcRenderer } from "electron";

const cache = JSON.parse(readFileSync("./cache.json", "utf-8"))
const config = JSON.parse(readFileSync("./config.json", "utf-8")) as Config

window.addEventListener("DOMContentLoaded", async () => {
    if (document.title == "Minecraft Launcher") {
        await versions()
        await setCachedUsername()
    } else if (document.title == "Launcher Configurações") {
        setDefaultOptions()
    }

    const loading = document.getElementById('loading') as HTMLElement
    loading.remove()
})

async function setDefaultOptions() {
    const dir = document.getElementById("dir") as HTMLInputElement
    const largura = document.getElementById("largura") as HTMLInputElement
    const altura = document.getElementById("altura") as HTMLInputElement
    const memory = document.getElementById("memory") as HTMLInputElement

    const fullScreen = document.getElementById("fullscreen") as HTMLInputElement
    const saveButton = document.getElementById("save") as HTMLButtonElement
    const memoryPanel = document.getElementById("memoryPanel") as HTMLInputElement
    const voltar = document.getElementById("voltar") as HTMLButtonElement

    fullScreen.checked = config.fullScreen
    dir.value = config.dir
    largura.value = config.width.toString()
    altura.value = config.height.toString()
    memory.min = config.memory.min.replace("M", '')
    memory.max = Math.round((os.totalmem()) / (1020**2)).toString()
    memory.value = config.memory.max.replace("M", '')

    memoryPanel.value = memory.value.toString()

    memoryPanel.addEventListener("input", () => {
        memory.value = memoryPanel.value
    })

    memoryPanel.addEventListener("change", () => {
        if(parseInt(memoryPanel.value) < 1024) memoryPanel.value = memory.min
        else if (parseInt(memoryPanel.value) > parseInt(memory.max)) memoryPanel.value = memory.max
    })

    memory.addEventListener("input", () => {
        memoryPanel.value = memory.value
    })

    voltar.addEventListener("click", () => ipcRenderer.invoke("home"))

    saveButton.addEventListener("click", () => {
        const data: Config = {
            dir: dir.value,
            width: parseInt(largura.value),
            height: parseInt(altura.value),
            fullScreen: fullScreen.checked,
            memory: {
                min: "1024M",
                max: memory.value + 'M',
            }
        }
        writeFileSync("./config.json", JSON.stringify(data))
        alert("Dados salvo!")
    })
}


async function setCachedUsername() {
    const name = document.getElementById('name') as HTMLInputElement
    if (cache.lastUsername.length) name.value = cache.lastUsername
}

async function versions() {
    const select = document.getElementById('version') as HTMLSelectElement
    let vanilla = await (await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")).json() as MineAPI
    let fabric = await (await fetch("https://meta.fabricmc.net/v2/versions/game")).json() as FabricAPI[]

    fabric = fabric.filter(v => v.stable)
    vanilla.versions = vanilla.versions.filter(v => v.type === "release")

    // da pra entender nada ai kkkk
    for (let j of vanilla.versions) {
        if (cache.lastVersion == `${j.id} vanilla`) select.innerHTML += `<option class="text-black" value='${j.id} vanilla' selected>${j.id} vanilla</option>`
        else select.innerHTML += `<option class="text-black" value='${j.id} vanilla'>${j.id} vanilla</option>`
        const equivalentFabric = fabric.find(v => v.version == j.id)
        if (equivalentFabric) {
            if (cache.lastVersion == `${j.id} fabric`) select.innerHTML += `<option class="text-black" value='${equivalentFabric.version} fabric' selected>${equivalentFabric.version} fabric</option>`
            select.innerHTML += `<option class="text-black" value='${equivalentFabric.version} fabric'>${equivalentFabric.version} fabric</option>`
        }
        try {
            const res = await axios.head(`https://files.minecraftforge.net/net/minecraftforge/forge/index_${j.id}.html`)
            if (res.status == 200) {
                console.log(`${j.id} forge disponivel`)
                if (cache.lastVersion == `${j.id} forge`) select.innerHTML += `<option class="text-black" value='${j.id} forge' selected>${j.id} forge</option>`
                else select.innerHTML += `<option class="text-black" value='${j.id} forge'>${j.id} forge</option>`
            }
        } catch {
            console.log(`${j.id} forge não disponivel`)
        }
    }



}