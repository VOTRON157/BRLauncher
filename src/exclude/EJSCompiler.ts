import ejs from "ejs"
import * as shell from "shelljs";
import { readdirSync, writeFileSync, existsSync, readFileSync } from "fs"
import { join } from "path"

; (async () => {
    const path = __dirname.split("\\")
    path.pop()
    const views = join(path.join("\\"), "views")
    
    const templates = readdirSync(views)
    for (let file of templates) {
        ejs.renderFile(join(views, file), {}, (err, str) => {
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

