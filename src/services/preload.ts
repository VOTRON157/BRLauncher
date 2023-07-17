import { readFileSync } from "fs";
import { FabricAPI, MineAPI } from "../interfaces/launcher";
import axios from "axios";
const cache = JSON.parse(readFileSync("./cache.json", "utf-8"))

window.addEventListener("DOMContentLoaded", async () => {
    await versions()
    await setCachedUsername()
    const loading = document.getElementById('loading') as HTMLElement
    loading.remove()
})

async function setCachedUsername() {
    const name = document.getElementById('name') as HTMLInputElement
    if(cache.lastUsername.length) name.value = cache.lastUsername
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