import ejs from "ejs"
import * as shell from "shelljs";
import { MineAPI } from "./interfaces/launcher";
import { readdirSync, writeFileSync, existsSync } from "fs"
import { join } from "path"

fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")
    .then(res => res.json())
    .then(({ versions: json }: MineAPI) => {
        json = json.filter(el => el.type === "release")
        const views = join(__dirname, "views")
        const templates = readdirSync(views)

        for (let file of templates) {
            ejs.renderFile(join(views, file), {
                versions: json
            }, (err, str) => {
                if (err) process.exit(1);
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
    })