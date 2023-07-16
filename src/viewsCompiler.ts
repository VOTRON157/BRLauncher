import ejs from "ejs"
import * as shell from "shelljs";
import { MineAPI, FabricAPI, Cache } from "./interfaces/launcher";
import { readdirSync, writeFileSync, existsSync, readFileSync } from "fs"
import { join } from "path"
import notifier from "node-notifier"
import axios from "axios"

(async () => {
    console.clear()
    notifier.notify({
        appID: "BRLauncher",
        title: 'Minecraf Launcher',
        message: 'O launcher está verificando as versões, quando tudo estiver pronto avisaremos...',
        icon: join(__dirname, "assets/logo.ico"),
        sound: true,
        wait: false
    })

    console.log("⏳ Verificando as versões do minecraft e copiando arquivos, isso pode demorar um pouco...")
    let forge: string[] = [];
    let vanilla = await (await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")).json() as MineAPI
    let fabric = await (await fetch("https://meta.fabricmc.net/v2/versions/game")).json() as FabricAPI[]

    fabric = fabric.filter(v => v.stable)
    vanilla.versions = vanilla.versions.filter(v => v.type === "release")

    for (let j of vanilla.versions) {
        try {
            const res = await axios.head(`https://files.minecraftforge.net/net/minecraftforge/forge/index_${j.id}.html`)
            if (res.status == 200) {
                console.log(`${j.id} forge disponivel`)
                forge.push(j.id)
            }
        } catch {
            console.log(`${j.id} forge não disponivel`)
        }
    }

    console.log("✔️  Versões verificadas")

    const views = join(__dirname, "views")
    const templates = readdirSync(views)

    const cache = JSON.parse(readFileSync("./launcherCache.json", "utf-8"))

    for (let file of templates) {
        ejs.renderFile(join(views, file), {
            vanilla: vanilla.versions, fabric, forge, cache
        }, (err, str) => {
            if (err) {
                console.log(err);
                process.exit(1)
            }
            else {
                writeFileSync(join(views, file.replace("ejs", "html")), str)
            }
        })
    }

    if (!existsSync("./dist/views")) shell.mkdir("dist/views")
    if (!existsSync("./dist/assets")) shell.mkdir("dist/assets")
    if (!existsSync("./dist/services/css")) shell.mkdir("dist/services/css")
    shell.cp("-R", ["src/assets/*"], "dist/assets/")
    shell.cp("-R", ["src/views/*.html"], "dist/views/")
    shell.cp("-R", ["src/services/css/*.css"], "dist/services/css")
    shell.rm(["src/views/*.html"])
})()

